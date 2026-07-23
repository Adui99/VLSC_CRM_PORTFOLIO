"use client";

import { useState, useEffect } from "react";
import { useCrmStore } from "@/store/useCrmStore";
import { UserRole, RolePermission, PermissionMatrix } from "@/types/crm";
import { 
  Users, 
  UserPlus, 
  Check, 
  UserGear,
  Trash,
  Lock,
  ShieldWarning,
  ArrowCounterClockwise,
  FloppyDisk,
  Key
} from "@phosphor-icons/react";

export default function CrmRbacManager() {
  const { 
    staffMembers, 
    permissions, 
    theme, 
    addStaff, 
    updateStaffRole, 
    toggleStaffStatus, 
    deleteStaff, 
    updatePermission,
    saveAllPermissions,
    resetPermissionsToDefault,
    currentUser 
  } = useCrmStore();

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showResetWarningModal, setShowResetWarningModal] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<import('@/types/crm').StaffUser | null>(null);
  const [matrixDraft, setMatrixDraft] = useState<PermissionMatrix>(permissions);
  const [isDirty, setIsDirty] = useState(false);

  const [newStaffForm, setNewStaffForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatar: string;
  }>({
    name: "",
    email: "",
    password: "",
    role: "sales_rep",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  });

  useEffect(() => {
    setMatrixDraft(permissions);
  }, [permissions]);

  const isLight = theme === "light";
  const currentRole = currentUser?.role || 'sales_rep';
  const isSuperAdmin = currentRole === 'super_admin';
  const isManager = currentRole === 'crm_manager';

  // Access restriction: Only Super Admin & Manager can access
  if (!isSuperAdmin && !isManager) {
    return (
      <div className={`p-12 text-center rounded-3xl border ${
        isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-800"
      }`}>
        <ShieldWarning size={48} className="mx-auto text-amber-500 mb-3" />
        <h3 className="text-xl font-bold">Access Restricted</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Only Super Admin and CRM Manager roles are authorized to access Team & RBAC management.
        </p>
      </div>
    );
  }

  const roleLabels: Record<UserRole, { label: string; style: string }> = {
    super_admin: { label: "Super Admin", style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" },
    crm_manager: { label: "CRM Manager", style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
    sales_rep: { label: "Sales Rep", style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  };

  const permissionLabels: Record<keyof RolePermission, string> = {
    viewLeads: "View Dashboard & Leads",
    editLeadStatus: "Update Lead Pipeline Status",
    deleteLeads: "Delete Leads Permanently",
    exportLeads: "Export Leads Data to CSV",
    viewStaff: "View Team Roster",
    manageStaff: "Add & Remove Staff Accounts",
    editRbacMatrix: "Configure RBAC Permission Matrix",
  };

  const handleCheckboxToggle = (role: UserRole, permKey: keyof RolePermission, checked: boolean) => {
    const updated = {
      ...matrixDraft,
      [role]: {
        ...matrixDraft[role],
        [permKey]: checked
      }
    };
    setMatrixDraft(updated);
    setIsDirty(true);
  };

  const handleSaveMatrix = () => {
    saveAllPermissions(matrixDraft);
    setIsDirty(false);
  };

  const handleConfirmReset = () => {
    resetPermissionsToDefault();
    setShowResetWarningModal(false);
    setIsDirty(false);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.email) return;
    addStaff({
      name: newStaffForm.name,
      email: newStaffForm.email,
      password: newStaffForm.password || "Password123!",
      role: newStaffForm.role,
      status: 'active',
      avatar: newStaffForm.avatar
    });
    setShowAddStaffModal(false);
    setNewStaffForm({ name: "", email: "", password: "", role: "sales_rep", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" });
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: STAFF ROSTER */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-900 border-zinc-800"
      }`}>
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Users size={22} className="text-amber-500" />
              <h2 className="text-lg font-extrabold tracking-tight">Team Personnel Roster</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
              Manage team accounts, role assignments, and login access.
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-[0.98]"
            >
              <UserPlus size={18} weight="bold" /> Add Team Member
            </button>
          )}
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-extrabold uppercase tracking-wider ${
                isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
              }`}>
                <th className="py-3 px-4">Member Name & Email</th>
                <th className="py-3 px-4">Role Assignment</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
              {staffMembers.map((member) => {
                const roleInfo = roleLabels[member.role];
                const isTargetSuperAdmin = member.role === 'super_admin';
                const canCurrentManageMember = isSuperAdmin || (isManager && !isTargetSuperAdmin);

                return (
                  <tr key={member.id} className={isLight ? "hover:bg-slate-50/80" : "hover:bg-zinc-800/40"}>
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30"
                        />
                        <div>
                          <div className={`font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>{member.name}</div>
                          <div className={`text-xs ${isLight ? "text-slate-600" : "text-zinc-400"}`}>{member.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Selector or Badge */}
                    <td className="py-3.5 px-4">
                      {canCurrentManageMember && member.id !== currentUser?.id ? (
                        <select
                          value={member.role}
                          onChange={(e) => updateStaffRole(member.id, e.target.value as UserRole)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${roleLabels[member.role].style}`}
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="crm_manager">CRM Manager</option>
                          <option value="sales_rep">Sales Rep</option>
                        </select>
                      ) : (
                        <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-lg border ${roleLabels[member.role].style}`}>
                          {roleLabels[member.role].label}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        disabled={!canCurrentManageMember || member.id === currentUser?.id}
                        onClick={() => toggleStaffStatus(member.id)}
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                          member.status === 'active'
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Joined Date */}
                    <td className={`py-3.5 px-4 text-xs font-semibold tabular-nums ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                      {member.joinedDate}
                    </td>

                    {/* Actions & Protection */}
                    <td className="py-3.5 px-4 text-right">
                      {!canCurrentManageMember ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-400 text-xs font-extrabold border border-amber-500/30">
                          <Lock size={13} /> Protected Admin
                        </span>
                      ) : member.id !== currentUser?.id ? (
                        <button
                          onClick={() => setDeleteConfirmTarget(member)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Remove Staff"
                        >
                          <Trash size={18} />
                        </button>
                      ) : (
                        <span className="text-xs font-extrabold text-slate-500 dark:text-zinc-400 italic">Current User</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: RBAC PERMISSION MATRIX */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-900 border-zinc-800"
      }`}>
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <UserGear size={22} className="text-amber-500" />
              <h2 className="text-lg font-extrabold tracking-tight">RBAC Permission Matrix</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
              Granular feature capability mapping per team role.
            </p>
          </div>

          {isSuperAdmin ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowResetWarningModal(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight 
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300" 
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                }`}
                title="Reset matrix permissions to system factory defaults"
              >
                <ArrowCounterClockwise size={15} weight="bold" /> Reset Defaults
              </button>

              <button
                onClick={handleSaveMatrix}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isDirty
                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20"
                    : "bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed"
                }`}
              >
                <FloppyDisk size={16} weight="bold" /> Save Changes
              </button>
            </div>
          ) : (
            <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Lock size={14} /> Read-Only (Super Admin Required to Modify)
            </span>
          )}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-extrabold uppercase tracking-wider ${
                isLight ? "bg-slate-100/90 border-slate-200 text-slate-800" : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
              }`}>
                <th className="py-3 px-4 w-1/2">Permission Capability</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">CRM Manager</th>
                <th className="py-3 px-4 text-center">Sales Rep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-sm">
              {(Object.keys(permissionLabels) as (keyof RolePermission)[]).map((permKey) => (
                <tr key={permKey} className={isLight ? "hover:bg-slate-50/80" : "hover:bg-zinc-800/40"}>
                  <td className={`py-3.5 px-4 font-extrabold ${isLight ? "text-slate-950" : "text-zinc-100"}`}>
                    {permissionLabels[permKey]}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <Check size={14} weight="bold" />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      disabled={!isSuperAdmin}
                      checked={matrixDraft.crm_manager[permKey]}
                      onChange={(e) => handleCheckboxToggle('crm_manager', permKey, e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer disabled:opacity-50"
                    />
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      disabled={!isSuperAdmin}
                      checked={matrixDraft.sales_rep[permKey]}
                      onChange={(e) => handleCheckboxToggle('sales_rep', permKey, e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer disabled:opacity-50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WARNING CONFIRMATION MODAL: RESET PERMISSIONS */}
      {showResetWarningModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isLight ? "bg-slate-900/60 backdrop-blur-md" : "bg-black/80 backdrop-blur-md"
        }`}>
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border text-center space-y-4 ${
            isLight ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-zinc-50"
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
              <ShieldWarning size={36} weight="bold" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Reset RBAC Matrix to Factory Defaults?</h3>
              <p className={`text-xs font-medium mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                Warning: This action will restore all <strong>CRM Manager</strong> and <strong>Sales Rep</strong> permission capabilities back to system factory defaults. Any custom permissions will be permanently overwritten.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetWarningModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer transition-all shadow-md shadow-amber-500/20 active:scale-[0.98]"
              >
                Confirm Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isLight ? "bg-slate-900/60 backdrop-blur-md" : "bg-black/80 backdrop-blur-md"
        }`}>
          <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
            isLight ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
          }`}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Trash size={26} className="text-red-500" weight="bold" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">Remove Team Member?</h3>
                <p className={`text-sm mt-1 font-medium ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                  This will permanently delete the account for:
                </p>
              </div>
              <div className={`flex items-center gap-3 w-full p-3 rounded-2xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-800"
              }`}>
                <img
                  src={deleteConfirmTarget.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={deleteConfirmTarget.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/30"
                />
                <div className="text-left">
                  <div className="font-extrabold text-sm">{deleteConfirmTarget.name}</div>
                  <div className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-zinc-400"}`}>{deleteConfirmTarget.email}</div>
                </div>
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-lg border ${roleLabels[deleteConfirmTarget.role].style}`}>
                  {roleLabels[deleteConfirmTarget.role].label}
                </span>
              </div>
              <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                ⚠️ This action cannot be undone and will revoke all access immediately.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-5">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStaff(deleteConfirmTarget.id);
                  setDeleteConfirmTarget(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-all shadow-md shadow-red-500/20 active:scale-[0.98] flex items-center gap-1.5"
              >
                <Trash size={15} weight="bold" /> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isLight ? "bg-slate-900/60 backdrop-blur-md" : "bg-black/80 backdrop-blur-md"
        }`}>
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
            isLight ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-zinc-50"
          }`}>
            <h3 className="text-xl font-extrabold tracking-tight mb-4">Add New Team Member</h3>
            <form onSubmit={handleAddStaffSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  placeholder="e.g. Jordan Lee"
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 mt-1 ${
                    isLight ? "bg-slate-50 border-slate-300 text-slate-950 font-medium" : "bg-zinc-950 border-zinc-800 text-zinc-100"
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">Company Email</label>
                <input
                  type="email"
                  required
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  placeholder="jordan@company.com"
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 mt-1 ${
                    isLight ? "bg-slate-50 border-slate-300 text-slate-950 font-medium" : "bg-zinc-950 border-zinc-800 text-zinc-100"
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>Initial Password</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Required for login</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    required
                    value={newStaffForm.password}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                    placeholder="Set account password..."
                    className={`w-full p-3 pl-9 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
                      isLight ? "bg-slate-50 border-slate-300 text-slate-950 font-medium" : "bg-zinc-950 border-zinc-800 text-zinc-100"
                    }`}
                  />
                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">Assigned Role</label>
                <select
                  value={newStaffForm.role}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value as UserRole })}
                  className={`w-full p-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 mt-1 cursor-pointer ${
                    isLight ? "bg-slate-50 border-slate-300 text-slate-950" : "bg-zinc-950 border-zinc-800 text-zinc-100"
                  }`}
                >
                  <option value="sales_rep">Sales Representative</option>
                  <option value="crm_manager">CRM Manager</option>
                  {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-600 cursor-pointer transition-all shadow-md shadow-amber-500/20 active:scale-[0.98]"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
