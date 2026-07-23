import { NextResponse } from 'next/server';
import { UserRole } from '@/types/crm';

/**
 * Validates request header user role against allowed roles for serverless API operations.
 */
export function validateServerRole(req: Request, allowedRoles: UserRole[]): { 
  authorized: boolean; 
  role?: UserRole; 
  userId?: string;
  userEmail?: string;
  errorResponse?: NextResponse 
} {
  const roleHeader = req.headers.get('x-user-role') as UserRole | null;
  const userIdHeader = req.headers.get('x-user-id') || undefined;
  const userEmailHeader = req.headers.get('x-user-email') || undefined;

  if (!roleHeader || !allowedRoles.includes(roleHeader)) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { success: false, error: `Unauthorized action for role: ${roleHeader || 'anonymous'}` },
        { status: 403 }
      ),
    };
  }

  return { 
    authorized: true, 
    role: roleHeader, 
    userId: userIdHeader, 
    userEmail: userEmailHeader 
  };
}
