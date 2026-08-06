"use client";

import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { 
  ChartLineUp, 
  UsersThree, 
  Gear,
  Sparkle,
  ClockCounterClockwise,
  ChartBar,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface CrmSidebarProps {
  activeTab: 'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit') => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export default function CrmSidebar({ activeTab, setActiveTab, setIsOpenMobile }: CrmSidebarProps) {
  const { theme, leads, staffMembers, currentUser, setLeadStatusFilter, sidebarCollapsed, toggleSidebarCollapsed } = useCrmStore();

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
    <aside className={`w-full ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72 xl:w-80'} border-r flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
      isLight 
        ? "bg-white border-slate-100/80 text-slate-800" 
        : "bg-zinc-900 border-zinc-800/50 text-zinc-100"
    }`}>
      {/* Sidebar Header / Brand Logo */}
      <div className={`p-4 sm:p-5 border-b border-slate-100/80 dark:border-zinc-800/40 flex items-center ${sidebarCollapsed ? 'lg:justify-center justify-between' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="/logo.png" 
              alt="KTD Team Logo" 
              className="w-9 h-9 object-contain"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="hidden lg:block">
              <div className="flex items-center gap-1.5">
                <span className={`font-bold text-base tracking-tight ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                  KTD <span className="text-amber-500 font-bold">CRM</span>
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                KTD Team Management
              </p>
            </div>
          )}
          {/* Always show text on mobile inside drawer */}
          <div className="lg:hidden">
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
      <div className="p-3 sm:p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          {!sidebarCollapsed && (
            <span className={`hidden lg:block px-3 text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
              Main Workspace
            </span>
          )}
          <span className={`lg:hidden px-3 text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
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
                title={sidebarCollapsed ? "Executive Analytics" : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                  activeTab === 'analytics'
                    ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ChartBar size={20} weight={activeTab === 'analytics' ? "bold" : "regular"} className="shrink-0" />
                  <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>Executive Analytics</span>
                </div>
                {!sidebarCollapsed && (
                  <span className="hidden lg:inline text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    SA
                  </span>
                )}
                <span className="lg:hidden text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  SA
                </span>
              </button>
            )}

            {/* Lead Dashboard Button (Shared Workspace) */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              title={sidebarCollapsed ? "Lead Analytics" : undefined}
              className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                activeTab === 'dashboard'
                  ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                  : isLight
                  ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                  : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <ChartLineUp size={20} weight={activeTab === 'dashboard' ? "bold" : "regular"} className="shrink-0" />
                <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>Lead Analytics</span>
              </div>
              {!sidebarCollapsed && (
                <span className={`hidden lg:inline text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  activeTab === 'dashboard'
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                }`}>
                  {totalLeads}
                </span>
              )}
              <span className={`lg:hidden text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
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
                title={sidebarCollapsed ? "Personnel & RBAC" : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                  activeTab === 'rbac'
                    ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <UsersThree size={20} weight={activeTab === 'rbac' ? "bold" : "regular"} className="shrink-0" />
                  <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>Personnel & RBAC</span>
                </div>
                {!sidebarCollapsed && (
                  <span className={`hidden lg:inline text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    activeTab === 'rbac'
                      ? "bg-slate-950/15 text-slate-950"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                  }`}>
                    {activeStaff}
                  </span>
                )}
                <span className={`lg:hidden text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
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
                title={sidebarCollapsed ? "System Audit Log" : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                  activeTab === 'audit'
                    ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClockCounterClockwise size={20} weight={activeTab === 'audit' ? "bold" : "regular"} className="shrink-0" />
                  <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>System Audit Log</span>
                </div>
              </button>
            )}

            {/* User Settings Button */}
            <button
              onClick={() => {
                setActiveTab('settings');
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              title={sidebarCollapsed ? "Account Settings" : undefined}
              className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none select-none ${
                activeTab === 'settings'
                  ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                  : isLight
                  ? "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
                  : "text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Gear size={20} weight={activeTab === 'settings' ? "bold" : "regular"} className="shrink-0" />
                <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>Account Settings</span>
              </div>
            </button>

          </nav>
        </div>

        {/* Quick Stats Widget (Interactive - Neon Glassmorphism) */}
        {!sidebarCollapsed ? (
          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleInspectNewLead}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md relative overflow-hidden group cursor-pointer ${
              isLight 
                ? "bg-gradient-to-br from-amber-500/10 via-amber-50/70 to-orange-500/10 border-amber-400/60 shadow-md shadow-amber-500/10 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20" 
                : "bg-gradient-to-br from-amber-500/15 via-zinc-900/90 to-orange-500/10 border-amber-500/50 shadow-md shadow-amber-500/20 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/30"
            }`}
            title="Click to view and filter new leads on Dashboard"
          >
            {/* Ambient neon glow behind widget */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-all pointer-events-none" />

            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className={`text-xs font-black tracking-tight ${isLight ? "text-slate-900" : "text-amber-100"}`}>
                Actionable Inbound Leads
              </span>
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Sparkle size={14} weight="fill" className="animate-pulse" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1 relative z-10">
              <span className="text-3xl font-black tracking-tight text-amber-500 dark:text-amber-400 tabular-nums drop-shadow-xs">
                {newLeads}
              </span>
              <span className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                New Leads
              </span>
            </div>

            <p className={`text-[11px] leading-snug font-medium mb-3 relative z-10 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              SLA Response Target: <span className="font-bold text-amber-600 dark:text-amber-400">24h</span>
            </p>

            {/* Neon Orange Pill Button */}
            <div className="relative z-10 flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md group-hover:from-amber-400 group-hover:to-orange-400 transition-all">
              <span>Filter Lead</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </motion.button>
        ) : (
          <button
            onClick={handleInspectNewLead}
            title={`${newLeads} Actionable Inbound Leads`}
            className="hidden lg:flex flex-col items-center justify-center p-3 rounded-2xl border-2 bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400 hover:border-amber-400 shadow-md shadow-amber-500/20 transition-all w-full cursor-pointer group"
          >
            <Sparkle size={18} weight="fill" className="animate-pulse text-amber-500" />
            <span className="text-xs font-black mt-1 tabular-nums">{newLeads}</span>
          </button>
        )}
      </div>

      {/* Sidebar Footer Info */}
      <div className={`p-4 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs flex items-center ${sidebarCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} font-medium ${
        isLight ? "text-slate-500" : "text-zinc-400"
      }`}>
        <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>v1.0</span>

        <span className={`px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1.5 ${sidebarCollapsed ? 'lg:hidden' : 'flex'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>
    </aside>
  );
}
