export type LeadStatus = 'new' | 'contacted' | 'in_negotiation' | 'closed_won' | 'closed_lost';

export interface LeadNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  dealValue: number;
  source: string;
  message?: string;
  createdAt: string;
  assignedTo?: string;
  notes: LeadNote[];
}

export type UserRole = 'super_admin' | 'crm_manager' | 'sales_rep';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatar?: string;
  joinedDate: string;
}

export interface RolePermission {
  viewLeads: boolean;
  editLeadStatus: boolean;
  deleteLeads: boolean;
  exportLeads: boolean;
  viewStaff: boolean;
  manageStaff: boolean;
  editRbacMatrix: boolean;
}

export type PermissionMatrix = Record<UserRole, RolePermission>;

export type ThemeMode = 'light' | 'dark';

export type AuditAction = 'lead_status_changed' | 'user_added' | 'user_deleted' | 'permissions_saved';

export interface AuditLog {
  id: string;
  action: AuditAction;
  description: string;
  performedBy: string;
  createdAt: string;
}

export interface CrmNotification {
  id: string;
  message: string;
  leadId: string;
  timestamp: string;
}
