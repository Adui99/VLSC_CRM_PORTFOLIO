import { LeadStatus, UserRole } from '@/types/crm';

/**
 * Valid allowed state transitions for CRM Lead workflow
 */
export const ALLOWED_STATE_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ['contacted', 'closed_lost'],
  contacted: ['in_negotiation', 'closed_lost'],
  in_negotiation: ['closed_won', 'closed_lost'],
  closed_won: [], // Locked state
  closed_lost: [], // Locked state
};

/**
 * Validates whether a lead status transition is permitted according to business logic rules and user role.
 */
export function validateLeadStatusTransition(
  currentStatus: LeadStatus,
  newStatus: LeadStatus,
  userRole: UserRole
): { allowed: boolean; reason?: string } {
  if (currentStatus === newStatus) {
    return { allowed: true };
  }

  // Managers and Super Admins can re-open or override locked deals
  const isElevatedRole = userRole === 'super_admin' || userRole === 'crm_manager';

  if ((currentStatus === 'closed_won' || currentStatus === 'closed_lost') && !isElevatedRole) {
    return {
      allowed: false,
      reason: 'Hợp đồng đã đóng. Chỉ Quản lý hoặc Super Admin mới có quyền mở lại hoặc thay đổi trạng thái.',
    };
  }

  // Check valid transition path if not manager override
  if (!isElevatedRole) {
    const allowedNextStates = ALLOWED_STATE_TRANSITIONS[currentStatus] || [];
    if (!allowedNextStates.includes(newStatus)) {
      return {
        allowed: false,
        reason: `Không thể chuyển trực tiếp từ "${currentStatus}" sang "${newStatus}". Vui lòng tuân thủ quy trình bán hàng.`,
      };
    }
  }

  return { allowed: true };
}
