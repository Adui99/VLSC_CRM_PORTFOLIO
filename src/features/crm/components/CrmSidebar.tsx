"use client";

import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { 
  ChartLineUp, 
  UsersThree, 
  Gear,
  Sparkle,
  ClockCounterClockwise,
  ChartBar,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface CrmSidebarProps {
  activeTab: 'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit') => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export default function CrmSidebar({ activeTab, setActiveTab, setIsOpenMobile }: CrmSidebarProps) {
  const { theme, leads, staffMembers, currentUser, setLeadStatusFilter } = useCrmStore();

  const isLight = theme === 'light';
  const currentRole = currentUser?.role || 'sales_rep';
  const canAccessStaff = currentRole === 'super_admin' || currentRole === 'crm_manager';
  const isSuperAdmin = currentRole === 'super_admin';

  const totalLeads = leads.length;
  const newLeadList = leads.filter((l) => l.status === 'new');
  const newLeads = newLeadList.length;
  const activeStaff = staffMembers.filter((s) => s.status === 'active').length;

  const handleInspectNewLead = () => {
    setLeadStatusFilter('new');
    setActiveTab('dashboard');
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  return (
    <aside className={`w-full lg:w-72 xl:w-80 border-r flex flex-col shrink-0 transition-colors duration-200 ${
      isLight 
        ? "bg-white border-slate-100/80 text-slate-800" 
        : "bg-zinc-900 border-zinc-800/50 text-zinc-100"
    }`}>
      {/* Sidebar Header / Brand Logo */}
      <div className="p-5 border-b border-slate-100/80 dark:border-zinc-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="/logo.png" 
              alt="KTD Team Logo" 
              className="w-9 h-9 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-base tracking-tight ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                KTD <span className="text-amber-500 font-bold">CRM</span>
              </span>
            </div>
            <p className={`text-[11px] font-medium ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              KTD Team Management
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <span className={`px-3 text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
            Main Workspace
          </span>
          <nav className="mt-2 space-y-1">
            
            {/* Executive Analytics (Visible FIRST for Super Admin) */}
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                  activeTab === 'analytics'
                    ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ChartBar size={19} weight={activeTab === 'analytics' ? "bold" : "regular"} />
                  <span>Executive Analytics</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Super Admin
                </span>
              </button>
            )}

            {/* Lead Dashboard Button (Shared Workspace) */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                activeTab === 'dashboard'
                  ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                  : isLight
                  ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                  : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <ChartLineUp size={19} weight={activeTab === 'dashboard' ? "bold" : "regular"} />
                <span>Lead Dashboard</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                activeTab === 'dashboard'
                  ? "bg-slate-950/15 text-slate-950"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
              }`}>
                {totalLeads}
              </span>
            </button>

            {/* Team & RBAC (Visible for Super Admin and Manager) */}
            {canAccessStaff && (
              <button
                onClick={() => {
                  setActiveTab('rbac');
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                  activeTab === 'rbac'
                    ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <UsersThree size={19} weight={activeTab === 'rbac' ? "bold" : "regular"} />
                  <span>Team & RBAC</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  activeTab === 'rbac'
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                }`}>
                  {activeStaff}
                </span>
              </button>
            )}

            {/* Audit Log (Super Admin only) */}
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setActiveTab('audit');
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                  activeTab === 'audit'
                    ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClockCounterClockwise size={19} weight={activeTab === 'audit' ? "bold" : "regular"} />
                  <span>Audit Log</span>
                </div>
              </button>
            )}

            {/* User Settings Button */}
            <button
              onClick={() => {
                setActiveTab('settings');
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                activeTab === 'settings'
                  ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                  : isLight
                  ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                  : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Gear size={19} weight={activeTab === 'settings' ? "bold" : "regular"} />
                <span>User Settings</span>
              </div>
            </button>

          </nav>
        </div>

        {/* Quick Stats Widget (Interactive - Click to filter Dashboard to new leads) */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleInspectNewLead}
          className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
            isLight 
              ? "bg-amber-50/60 border-amber-500/20 shadow-xs hover:shadow-sm hover:border-amber-500/40 hover:bg-amber-50/90" 
              : "bg-amber-500/10 border-amber-500/20 shadow-xs hover:shadow-sm hover:border-amber-500/40 hover:bg-amber-500/15"
          }`}
          title="Click to view and filter new leads on Dashboard"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-bold ${isLight ? "text-slate-800" : "text-zinc-200"}`}>
              Inbound Action Needed
            </span>
            <Sparkle size={15} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {newLeads} <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-zinc-400"}`}>New Leads</span>
          </div>
          <p className={`text-[11px] mt-1 leading-snug font-normal ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
            Requires initial contact by sales team within 24 hours.
          </p>
          <div className="mt-2.5 pt-2 border-t border-amber-500/15 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between hover:underline">
            <span>Xem Lead Dashboard (Mới)</span>
            <span>&rarr;</span>
          </div>
        </motion.button>
      </div>

      {/* Sidebar Footer Info */}
      <div className={`p-4 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs flex items-center justify-between font-medium ${
        isLight ? "text-slate-500" : "text-zinc-400"
      }`}>
        <span>KTD CRM v1.0</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Sync
        </span>
      </div>
    </aside>
  );
}
