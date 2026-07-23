import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Lead, 
  LeadStatus, 
  StaffUser, 
  UserRole, 
  PermissionMatrix, 
  ThemeMode,
  RolePermission,
  AuditLog,
  AuditAction,
  CrmNotification,
} from '@/types/crm';

const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'Alex Rivera',
    email: 'admin@company.com',
    role: 'super_admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    joinedDate: '2025-01-15',
  },
  {
    id: 'staff-2',
    name: 'Sarah Chen',
    email: 'manager@company.com',
    role: 'crm_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    joinedDate: '2025-03-01',
  },
  {
    id: 'staff-3',
    name: 'Marcus Vance',
    email: 'sales@company.com',
    role: 'sales_rep',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    joinedDate: '2025-04-10',
  },
  {
    id: 'staff-4',
    name: 'Elena Rostova',
    email: 'elena@company.com',
    role: 'sales_rep',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    joinedDate: '2025-05-18',
  },
];

const INITIAL_PERMISSIONS: PermissionMatrix = {
  super_admin: {
    viewLeads: true,
    editLeadStatus: true,
    deleteLeads: true,
    exportLeads: true,
    viewStaff: true,
    manageStaff: true,
    editRbacMatrix: true,
  },
  crm_manager: {
    viewLeads: true,
    editLeadStatus: true,
    deleteLeads: false,
    exportLeads: true,
    viewStaff: true,
    manageStaff: false,
    editRbacMatrix: false,
  },
  sales_rep: {
    viewLeads: true,
    editLeadStatus: true,
    deleteLeads: false,
    exportLeads: false,
    viewStaff: false,
    manageStaff: false,
    editRbacMatrix: false,
  },
};

interface CrmStoreState {
  theme: ThemeMode;
  toggleTheme: () => void;

  currentUser: StaffUser | null;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<Pick<StaffUser, 'email' | 'avatar'>>) => void;

  leads: Lead[];
  fetchDataFromDb: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'notes'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addLeadNote: (leadId: string, content: string) => void;
  deleteLead: (id: string) => void;

  staffMembers: StaffUser[];
  addStaff: (staff: Omit<StaffUser, 'id' | 'joinedDate'>) => void;
  updateStaffRole: (staffId: string, newRole: UserRole) => void;
  toggleStaffStatus: (staffId: string) => void;
  deleteStaff: (staffId: string) => void;

  testRole: UserRole | null;
  setTestRole: (role: UserRole | null) => void;

  inspectingLead: Lead | null;
  setInspectingLead: (lead: Lead | null) => void;

  permissions: PermissionMatrix;
  updatePermission: (role: UserRole, key: keyof RolePermission, value: boolean) => void;
  saveAllPermissions: (newMatrix: PermissionMatrix) => void;
  resetPermissionsToDefault: () => void;

  // Audit Logs (F3)
  auditLogs: AuditLog[];
  fetchAuditLogs: () => Promise<void>;
  addAuditLog: (action: AuditAction, description: string) => void;

  // Notifications (F4) — in-memory only, no persist
  notifications: CrmNotification[];
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useCrmStore = create<CrmStoreState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      testRole: null,
      setTestRole: (role) => set({ testRole: role }),

      inspectingLead: null,
      setInspectingLead: (lead) => set({ inspectingLead: lead }),

      currentUser: INITIAL_STAFF[0],
      isAuthenticated: true,

      login: (email: string) => {
        const foundStaff = get().staffMembers.find(
          (s) => s.email.toLowerCase() === email.toLowerCase() && s.status === 'active'
        );
        if (foundStaff) {
          set({ currentUser: foundStaff, isAuthenticated: true, testRole: null });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null, isAuthenticated: false, testRole: null }),

      updateUserProfile: (updates) => {
        const current = get().currentUser;
        if (!current) return;
        const updatedUser: StaffUser = { ...current, ...updates };
        set((state) => ({
          currentUser: updatedUser,
          staffMembers: state.staffMembers.map((s) => (s.id === current.id ? updatedUser : s)),
        }));

        fetch('/api/crm/staff', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': current.role,
            'x-user-id': current.id,
          },
          body: JSON.stringify({ type: 'update_profile', staffId: current.id, ...updates }),
        }).catch((err) => console.error('Error syncing profile to Neon:', err));
      },

      leads: [],
      staffMembers: INITIAL_STAFF,
      permissions: INITIAL_PERMISSIONS,

      fetchDataFromDb: async () => {
        try {
          const current = get().currentUser;
          const currentRole = get().testRole || current?.role || 'sales_rep';
          const authHeaders: Record<string, string> = {
            'x-user-role': currentRole,
            'x-user-id': current?.id || '',
            'x-user-email': current?.email || '',
          };

          const [leadsRes, staffRes, permsRes] = await Promise.all([
            fetch('/api/crm/leads', { headers: authHeaders }),
            fetch('/api/crm/staff', { headers: authHeaders }),
            fetch('/api/crm/permissions', { headers: authHeaders }),
          ]);

          const leadsData = await leadsRes.json();
          const staffData = await staffRes.json();
          const permsData = await permsRes.json();

          if (leadsData.success && Array.isArray(leadsData.leads)) {
            set({ leads: leadsData.leads });
          }

          if (staffData.success && Array.isArray(staffData.staffMembers) && staffData.staffMembers.length > 0) {
            set({ staffMembers: staffData.staffMembers });
            if (current) {
              const matched = staffData.staffMembers.find((s: StaffUser) => s.id === current.id || s.email === current.email);
              if (matched) set({ currentUser: matched });
            }
          }

          if (permsData.success && permsData.permissions) {
            set((state) => ({
              permissions: { ...state.permissions, ...permsData.permissions },
            }));
          }
        } catch (err) {
          console.error('Error fetching CRM data from Neon DB:', err);
        }
      },

      addLead: (newLeadData) => {
        const current = get().currentUser;
        const currentRole = get().testRole || current?.role || 'sales_rep';
        const tempId = `lead-${crypto.randomUUID()}`;
        const createdAt = new Date().toISOString();
        const newLead: Lead = {
          ...newLeadData,
          id: tempId,
          createdAt,
          notes: [],
        };
        set((state) => ({ leads: [newLead, ...state.leads] }));

        // F4: Push notification for new lead
        const notiId = `noti-${crypto.randomUUID()}`;
        set((state) => ({
          notifications: [
            {
              id: notiId,
              message: `New lead received: ${newLeadData.name}${newLeadData.company ? ` from ${newLeadData.company}` : ''}`,
              leadId: tempId,
              timestamp: createdAt,
            },
            ...state.notifications,
          ],
        }));

        fetch('/api/crm/leads', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
            'x-user-id': current?.id || '',
            'x-user-email': current?.email || '',
          },
          body: JSON.stringify({ ...newLeadData, assignedTo: newLeadData.assignedTo || current?.id }),
        }).catch((err) => console.error('Error saving lead to Neon DB:', err));
      },

      updateLeadStatus: (id, status) => {
        const current = get().currentUser;
        const currentRole = get().testRole || current?.role || 'sales_rep';
        const authorName = current?.name || 'Nhân sự CRM';

        const prevLead = get().leads.find((l) => l.id === id);
        const prevStatus = prevLead?.status || 'new';

        const auditNote = {
          id: `note-${crypto.randomUUID()}`,
          content: `[System Audit Trail] Trạng thái Lead đã được cập nhật từ "${prevStatus}" sang "${status}" bởi ${authorName}.`,
          author: 'Hệ Thống',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, status, notes: [auditNote, ...l.notes] } : l
          ),
        }));

        // F3: Add audit log entry
        get().addAuditLog(
          'lead_status_changed',
          `Lead "${prevLead?.name || id}" status changed from "${prevStatus}" → "${status}" by ${authorName}`
        );

        fetch('/api/crm/leads', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
            'x-user-id': current?.id || '',
            'x-user-email': current?.email || '',
          },
          body: JSON.stringify({ type: 'update_status', leadId: id, status, author: authorName }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success && data.error) {
              alert(`Lỗi Business Logic: ${data.error}`);
              get().fetchDataFromDb();
            }
          })
          .catch((err) => console.error('Error updating lead status in Neon DB:', err));
      },

      addLeadNote: (leadId, content) => {
        const currentRole = get().testRole || get().currentUser?.role || 'sales_rep';
        const authorName = get().currentUser?.name || 'Internal Staff';
        const newNote = {
          id: `note-${crypto.randomUUID()}`,
          content,
          author: authorName,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === leadId ? { ...l, notes: [newNote, ...l.notes] } : l
          ),
        }));

        fetch('/api/crm/leads', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
          },
          body: JSON.stringify({ type: 'add_note', leadId, content, author: authorName }),
        }).catch((err) => console.error('Error adding note to Neon DB:', err));
      },

      deleteLead: (id) => {
        const currentRole = get().testRole || get().currentUser?.role || 'sales_rep';
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        }));

        fetch(`/api/crm/leads?id=${id}`, {
          method: 'DELETE',
          headers: { 'x-user-role': currentRole },
        }).catch((err) =>
          console.error('Error deleting lead from Neon DB:', err)
        );
      },

      addStaff: (staffData) => {
        const current = get().currentUser;
        const currentRole = get().testRole || current?.role || 'sales_rep';
        const newStaff: StaffUser = {
          ...staffData,
          id: `staff-${crypto.randomUUID()}`,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ staffMembers: [...state.staffMembers, newStaff] }));

        // F3: Audit log
        get().addAuditLog(
          'user_added',
          `New team member "${staffData.name}" (${staffData.role}) added by ${current?.name || 'Admin'}`
        );

        fetch('/api/crm/staff', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
          },
          body: JSON.stringify(staffData),
        }).catch((err) => console.error('Error adding staff to Neon DB:', err));
      },

      updateStaffRole: (staffId, newRole) => {
        const currentRole = get().testRole || get().currentUser?.role || 'sales_rep';
        set((state) => ({
          staffMembers: state.staffMembers.map((s) =>
            s.id === staffId ? { ...s, role: newRole } : s
          ),
          currentUser:
            state.currentUser?.id === staffId
              ? { ...state.currentUser, role: newRole }
              : state.currentUser,
        }));

        fetch('/api/crm/staff', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
          },
          body: JSON.stringify({ type: 'update_role', staffId, role: newRole }),
        }).catch((err) => console.error('Error updating staff role in Neon DB:', err));
      },

      toggleStaffStatus: (staffId) => {
        const currentRole = get().testRole || get().currentUser?.role || 'sales_rep';
        set((state) => ({
          staffMembers: state.staffMembers.map((s) =>
            s.id === staffId
              ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
              : s
          ),
        }));

        fetch('/api/crm/staff', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
          },
          body: JSON.stringify({ type: 'toggle_status', staffId }),
        }).catch((err) => console.error('Error toggling staff status in Neon DB:', err));
      },

      deleteStaff: (staffId) => {
        const current = get().currentUser;
        const currentRole = get().testRole || current?.role || 'sales_rep';
        const target = get().staffMembers.find((s) => s.id === staffId);
        set((state) => ({
          staffMembers: state.staffMembers.filter((s) => s.id !== staffId),
        }));

        // F3: Audit log
        get().addAuditLog(
          'user_deleted',
          `Team member "${target?.name || staffId}" was removed by ${current?.name || 'Admin'}`
        );

        fetch(`/api/crm/staff?id=${staffId}`, {
          method: 'DELETE',
          headers: { 'x-user-role': currentRole },
        }).catch((err) =>
          console.error('Error deleting staff from Neon DB:', err)
        );
      },

      updatePermission: (role, key, value) => {
        const currentRole = get().testRole || get().currentUser?.role || 'sales_rep';
        set((state) => ({
          permissions: {
            ...state.permissions,
            [role]: {
              ...state.permissions[role],
              [key]: value,
            },
          },
        }));

        fetch('/api/crm/permissions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
          },
          body: JSON.stringify({ role, key, value }),
        }).catch((err) => console.error('Error updating permission in Neon DB:', err));
      },

      saveAllPermissions: (newMatrix) => {
        const current = get().currentUser;
        const currentRole = current?.role || 'sales_rep';
        set({ permissions: newMatrix });

        // F3: Audit log
        get().addAuditLog(
          'permissions_saved',
          `RBAC permission matrix saved by ${current?.name || 'Admin'}`
        );

        Object.entries(newMatrix).forEach(([role, perms]) => {
          Object.entries(perms).forEach(([key, value]) => {
            fetch('/api/crm/permissions', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-user-role': currentRole,
              },
              body: JSON.stringify({ role, key, value }),
            }).catch((err) => console.error('Error saving matrix to Neon DB:', err));
          });
        });
      },

      resetPermissionsToDefault: () => {
        const currentRole = get().currentUser?.role || 'sales_rep';
        set({ permissions: INITIAL_PERMISSIONS });

        Object.entries(INITIAL_PERMISSIONS).forEach(([role, perms]) => {
          Object.entries(perms).forEach(([key, value]) => {
            fetch('/api/crm/permissions', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-user-role': currentRole,
              },
              body: JSON.stringify({ role, key, value }),
            }).catch((err) => console.error('Error resetting matrix in Neon DB:', err));
          });
        });
      },

      // F3: Audit Logs
      auditLogs: [],

      fetchAuditLogs: async () => {
        try {
          const current = get().currentUser;
          const currentRole = current?.role || 'sales_rep';
          const res = await fetch('/api/crm/audit-logs', {
            headers: {
              'x-user-role': currentRole,
              'x-user-id': current?.id || '',
            },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.logs)) {
            set({ auditLogs: data.logs });
          }
        } catch (err) {
          console.error('Error fetching audit logs:', err);
        }
      },

      addAuditLog: (action: AuditAction, description: string) => {
        const current = get().currentUser;
        const performedBy = current?.name || 'System';
        const newLog: AuditLog = {
          id: `audit-${crypto.randomUUID()}`,
          action,
          description,
          performedBy,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));

        // Persist to DB
        const currentRole = current?.role || 'sales_rep';
        fetch('/api/crm/audit-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': currentRole,
            'x-user-id': current?.id || '',
          },
          body: JSON.stringify(newLog),
        }).catch((err) => console.error('Error saving audit log to Neon:', err));
      },

      // F4: Notifications (in-memory)
      notifications: [],

      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAllNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'vlsc_crm_storage',
      storage: createJSONStorage(() => localStorage),
      // Exclude notifications from persistence (in-memory only)
      partialize: (state) => {
        const { notifications, auditLogs, ...persisted } = state;
        return persisted;
      },
    }
  )
);
