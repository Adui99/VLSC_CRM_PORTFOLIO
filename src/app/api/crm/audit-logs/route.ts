import { NextResponse } from 'next/server';
import { sql } from '@/core/db/db';
import { validateServerRole } from '@/core/auth/auth';

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS crm_audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      performed_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function GET(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    await ensureTable();

    const rows = await sql`
      SELECT id, action, description, performed_by as "performedBy", created_at as "createdAt"
      FROM crm_audit_logs
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    return NextResponse.json({ success: true, logs: rows });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching audit logs:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager', 'sales_rep']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    await ensureTable();

    const body = await req.json();
    const { id, action, description, performedBy, createdAt } = body;

    await sql`
      INSERT INTO crm_audit_logs (id, action, description, performed_by, created_at)
      VALUES (${id}, ${action}, ${description}, ${performedBy}, ${createdAt});
    `;

    // Auto-pruning: Ring buffer maintaining max 1,000 latest audit logs (Zero DB Bloat)
    await sql`
      DELETE FROM crm_audit_logs
      WHERE id NOT IN (
        SELECT id FROM crm_audit_logs ORDER BY created_at DESC LIMIT 1000
      );
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error inserting audit log:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    await ensureTable();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    await sql`
      DELETE FROM crm_audit_logs 
      WHERE created_at < NOW() - (${days} || ' days')::INTERVAL;
    `;

    return NextResponse.json({ 
      success: true, 
      message: `Successfully purged audit logs older than ${days} days.` 
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error clearing audit logs:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
