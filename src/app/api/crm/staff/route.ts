import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { StaffUser } from '@/types/crm';
import { validateServerRole } from '@/lib/auth-server';

export async function GET() {
  try {
    const rawStaff = await sql`
      SELECT 
        id, 
        name, 
        email, 
        role, 
        status, 
        avatar, 
        joined_date as "joinedDate"
      FROM staff_users
      ORDER BY joined_date ASC;
    `;

    const staffMembers: StaffUser[] = rawStaff.map((s) => ({
      id: s.id as string,
      name: s.name as string,
      email: s.email as string,
      role: s.role as any,
      status: s.status as any,
      avatar: s.avatar as string || undefined,
      joinedDate: s.joinedDate as string,
    }));

    return NextResponse.json({ success: true, staffMembers });
  } catch (error: any) {
    console.error('Error fetching staff from Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    const body = await req.json();
    const { name, email, role, status, avatar } = body;

    const id = `staff-${crypto.randomUUID()}`;
    const joinedDate = new Date().toISOString().split('T')[0];

    await sql`
      INSERT INTO staff_users (id, name, email, role, status, avatar, joined_date)
      VALUES (${id}, ${name}, ${email}, ${role || 'sales_rep'}, ${status || 'active'}, ${avatar || null}, ${joinedDate});
    `;

    const newStaff: StaffUser = {
      id,
      name,
      email,
      role: role || 'sales_rep',
      status: status || 'active',
      avatar,
      joinedDate,
    };

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error: any) {
    console.error('Error adding staff to Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authCheck = validateServerRole(req, ['super_admin', 'crm_manager', 'sales_rep']);
    if (!authCheck.authorized) return authCheck.errorResponse!;

    const body = await req.json();
    const { type, staffId, role, status, name, email, avatar } = body;

    if (type === 'update_role' || type === 'toggle_status') {
      const roleCheck = validateServerRole(req, ['super_admin', 'crm_manager']);
      if (!roleCheck.authorized) return roleCheck.errorResponse!;
    }

    if (type === 'update_role') {
      await sql`
        UPDATE staff_users SET role = ${role} WHERE id = ${staffId};
      `;
      return NextResponse.json({ success: true });
    }

    if (type === 'toggle_status') {
      await sql`
        UPDATE staff_users SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END WHERE id = ${staffId};
      `;
      return NextResponse.json({ success: true });
    }

    if (type === 'update_profile') {
      await sql`
        UPDATE staff_users 
        SET 
          name = COALESCE(${name}, name),
          email = COALESCE(${email}, email),
          avatar = COALESCE(${avatar}, avatar)
        WHERE id = ${staffId};
      `;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid patch type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating staff in Neon:', error);
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
      DELETE FROM staff_users WHERE id = ${id};
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting staff from Neon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
