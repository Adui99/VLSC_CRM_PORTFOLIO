import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { validateServerRole } from '@/lib/auth-server';

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
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error inserting audit log:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
