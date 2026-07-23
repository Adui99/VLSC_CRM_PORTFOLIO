import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Lead, LeadNote, LeadStatus } from '@/types/crm';
import { validateServerRole } from '@/lib/auth-server';
import { validateLeadStatusTransition } from '@/lib/lead-state-machine';

export async function GET(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager', 'sales_rep']);
    const userRole = authCheck.role || 'sales_rep';

    // Single optimized query joining leads and lead_notes via PostgreSQL JSON_AGG
    const rawLeads = await sql`
      SELECT 
        l.id, 
        l.name, 
        l.email, 
        l.phone, 
        l.company, 
        l.status, 
        l.deal_value as "dealValue", 
        l.source, 
        l.message, 
        l.created_at as "createdAt", 
        l.assigned_to as "assignedTo",
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', n.id,
              'content', n.content,
              'author', n.author,
              'createdAt', n.created_at
            ) ORDER BY n.created_at DESC
          ) FILTER (WHERE n.id IS NOT NULL),
          '[]'::json
        ) as notes
      FROM leads l
      LEFT JOIN lead_notes n ON l.id = n.lead_id
      GROUP BY l.id
      ORDER BY l.created_at DESC;
    `;

    const leads: Lead[] = rawLeads.map((l) => ({
      id: l.id as string,
      name: l.name as string,
      email: l.email as string,
      phone: l.phone as string || undefined,
      company: l.company as string || undefined,
      status: l.status as any,
      dealValue: Math.max(0, Number(l.dealValue) || 0),
      source: l.source as string,
      message: l.message as string || undefined,
      createdAt: new Date(l.createdAt as string).toISOString(),
      assignedTo: l.assignedTo as string || undefined,
      notes: Array.isArray(l.notes) ? l.notes.map((n: any) => ({
        id: n.id,
        content: n.content,
        author: n.author,
        createdAt: new Date(n.createdAt).toISOString()
      })) : [],
    }));

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error('Error fetching leads from Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager', 'sales_rep']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    const body = await req.json();
    const { name, email, phone, company, status, dealValue, source, message, assignedTo } = body;

    const validatedDealValue = Math.max(0, Number(dealValue) || 0);
    const id = `lead-${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    await sql`
      INSERT INTO leads (id, name, email, phone, company, status, deal_value, source, message, created_at, assigned_to)
      VALUES (${id}, ${name}, ${email}, ${phone || null}, ${company || null}, ${status || 'new'}, ${validatedDealValue}, ${source || 'Website'}, ${message || null}, ${createdAt}, ${assignedTo || null});
    `;

    const newLead: Lead = {
      id,
      name,
      email,
      phone,
      company,
      status: status || 'new',
      dealValue: validatedDealValue,
      source: source || 'Website',
      message,
      createdAt,
      assignedTo: assignedTo || undefined,
      notes: [],
    };

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error('Error creating lead in Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager', 'sales_rep']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    const body = await req.json();
    const { type, leadId, status, content, author } = body;
    const userRole = authCheck.role || 'sales_rep';

    if (type === 'update_status') {
      // 1. Fetch current lead status from DB
      const existingLeads = await sql`
        SELECT status, deal_value as "dealValue" FROM leads WHERE id = ${leadId};
      `;

      if (existingLeads.length === 0) {
        return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
      }

      const currentStatus = existingLeads[0].status as LeadStatus;

      // 2. Validate state machine transition rules
      const transitionCheck = validateLeadStatusTransition(currentStatus, status as LeadStatus, userRole);
      if (!transitionCheck.allowed) {
        return NextResponse.json(
          { success: false, error: transitionCheck.reason || 'Invalid status transition' },
          { status: 400 }
        );
      }

      // 3. Update status in database
      await sql`
        UPDATE leads SET status = ${status} WHERE id = ${leadId};
      `;

      // 4. Create System Audit Trail Note
      const auditNoteId = `note-${crypto.randomUUID()}`;
      const auditCreatedAt = new Date().toISOString();
      const auditContent = `[System Audit Trail] Trạng thái Lead đã được cập nhật từ "${currentStatus}" sang "${status}" bởi ${author || 'Nhân sự CRM'}.`;

      await sql`
        INSERT INTO lead_notes (id, lead_id, content, author, created_at)
        VALUES (${auditNoteId}, ${leadId}, ${auditContent}, ${author || 'Hệ Thống'}, ${auditCreatedAt});
      `;

      return NextResponse.json({ 
        success: true, 
        auditNote: { id: auditNoteId, content: auditContent, author: author || 'Hệ Thống', createdAt: auditCreatedAt } 
      });
    }

    if (type === 'add_note') {
      const noteId = `note-${crypto.randomUUID()}`;
      const createdAt = new Date().toISOString();

      await sql`
        INSERT INTO lead_notes (id, lead_id, content, author, created_at)
        VALUES (${noteId}, ${leadId}, ${content}, ${author || 'Internal Staff'}, ${createdAt});
      `;

      return NextResponse.json({
        success: true,
        note: { id: noteId, content, author: author || 'Internal Staff', createdAt },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid patch type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating lead in Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    await sql`
      DELETE FROM leads WHERE id = ${id};
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting lead from Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
