import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { PermissionMatrix, UserRole } from '@/types/crm';
import { validateServerRole } from '@/lib/auth-server';

export async function GET() {
  try {
    const rows = await sql`
      SELECT 
        role, 
        view_leads as "viewLeads", 
        edit_lead_status as "editLeadStatus", 
        delete_leads as "deleteLeads", 
        export_leads as "exportLeads", 
        view_staff as "viewStaff", 
        manage_staff as "manageStaff", 
        edit_rbac_matrix as "editRbacMatrix"
      FROM rbac_permissions;
    `;

    const permissions: Partial<PermissionMatrix> = {};
    for (const r of rows) {
      const roleKey = r.role as UserRole;
      permissions[roleKey] = {
        viewLeads: Boolean(r.viewLeads),
        editLeadStatus: Boolean(r.editLeadStatus),
        deleteLeads: Boolean(r.deleteLeads),
        exportLeads: Boolean(r.exportLeads),
        viewStaff: Boolean(r.viewStaff),
        manageStaff: Boolean(r.manageStaff),
        editRbacMatrix: Boolean(r.editRbacMatrix),
      };
    }

    return NextResponse.json({ success: true, permissions });
  } catch (error: any) {
    console.error('Error fetching permissions from Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    const body = await req.json();
    const { role, key, value } = body;

    // Convert key camelCase to snake_case for PostgreSQL
    const snakeKeyMap: Record<string, string> = {
      viewLeads: 'view_leads',
      editLeadStatus: 'edit_lead_status',
      deleteLeads: 'delete_leads',
      exportLeads: 'export_leads',
      viewStaff: 'view_staff',
      manageStaff: 'manage_staff',
      editRbacMatrix: 'edit_rbac_matrix',
    };

    const dbColumn = snakeKeyMap[key];
    if (!dbColumn) {
      return NextResponse.json({ success: false, error: 'Invalid permission key' }, { status: 400 });
    }

    // Run dynamic column update via Neon SQL
    await sql.query(
      `UPDATE rbac_permissions SET ${dbColumn} = $1 WHERE role = $2;`,
      [value, role]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating permission in Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
