"use client";

import { useCrmStore } from "@/store/useCrmStore";
import { 
  ChartLineUp, 
  UsersThree, 
  Gear,
  Sparkle,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface CrmSidebarProps {
  activeTab: 'dashboard' | 'rbac' | 'settings' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'rbac' | 'settings' | 'audit') => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export default function CrmSidebar({ activeTab, setActiveTab, isOpenMobile, setIsOpenMobile }: CrmSidebarProps) {
  const { theme, leads, staffMembers, currentUser, setInspectingLead } = useCrmStore();

  const isLight = theme === 'light';
  const currentRole = currentUser?.role || 'sales_rep';
  const canAccessStaff = currentRole === 'super_admin' || currentRole === 'crm_manager';
  const isSuperAdmin = currentRole === 'super_admin';

  const totalLeads = leads.length;
  const newLeadList = leads.filter((l) => l.status === 'new');
  const newLeads = newLeadList.length;
  const latestNewLead = newLeadList[0] || leads[0];
  const activeStaff = staffMembers.filter((s) => s.status === 'active').length;

  const handleInspectNewLead = () => {
    setActiveTab('dashboard');
    if (setIsOpenMobile) setIsOpenMobile(false);
    if (latestNewLead) {
      setInspectingLead(latestNewLead);
    }
  };

  return (
    <aside className={`w-full lg:w-72 xl:w-80 border-r flex flex-col shrink-0 transition-colors duration-200 ${
      isLight 
        ? "bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-900" 
        : "bg-zinc-900/95 backdrop-blur-md border-zinc-800/80 text-zinc-100"
    }`}>
      {/* Sidebar Header / Brand Logo */}
      <div className="p-6 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* KTD Team Logo Frame - No harsh border */}
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="/logo.png" 
              alt="KTD Team Logo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-black text-lg tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                KTD <span className="text-amber-500 font-black">CRM</span>
              </span>
            </div>
            <p className={`text-[11px] font-extrabold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              KTD Team Management
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <span className={`px-3 text-[10px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-zinc-500"}`}>
            Main Workspace
          </span>
          <nav className="mt-2 space-y-1.5">
            
            {/* Dashboard Button */}
            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab('dashboard');
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                  : isLight
                  ? "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <ChartLineUp size={20} weight={activeTab === 'dashboard' ? "bold" : "regular"} />
                <span>Lead Dashboard</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold tabular-nums ${
                activeTab === 'dashboard'
                  ? "bg-slate-950/20 text-slate-950"
                  : "bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300"
              }`}>
                {totalLeads}
              </span>
            </motion.button>

            {/* Team & RBAC (Visible for Super Admin and Manager) */}
            {canAccessStaff && (
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab('rbac');
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  activeTab === 'rbac'
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                    : isLight
                    ? "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <UsersThree size={20} weight={activeTab === 'rbac' ? "bold" : "regular"} />
                  <span>Team & RBAC</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold tabular-nums ${
                  activeTab === 'rbac'
                    ? "bg-slate-950/20 text-slate-950"
                    : "bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300"
                }`}>
                  {activeStaff}
                </span>
              </motion.button>
            )}

            {/* Audit Log (Super Admin only) */}
            {isSuperAdmin && (
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab('audit');
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  activeTab === 'audit'
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                    : isLight
                    ? "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClockCounterClockwise size={20} weight={activeTab === 'audit' ? "bold" : "regular"} />
                  <span>Audit Log</span>
                </div>
              </motion.button>
            )}

            {/* User Settings Button */}
            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab('settings');
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === 'settings'
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                  : isLight
                  ? "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Gear size={20} weight={activeTab === 'settings' ? "bold" : "regular"} />
                <span>User Settings</span>
              </div>
            </motion.button>

          </nav>
        </div>

        {/* Quick Stats Widget (Interactive - Click to inspect latest new lead) */}
        <motion.button
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleInspectNewLead}
          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
            isLight 
              ? "bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/30 shadow-sm hover:shadow-md hover:border-amber-500/60" 
              : "bg-gradient-to-br from-amber-500/15 to-amber-500/5 border-amber-500/30 hover:border-amber-500/60"
          }`}
          title="Click to view and inspect latest new lead"
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-extrabold ${isLight ? "text-slate-800" : "text-zinc-300"}`}>
              Inbound Action Needed
            </span>
            <Sparkle size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
            {newLeads} <span className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>New Leads</span>
          </div>
          <p className={`text-[11px] mt-1 leading-snug font-semibold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
            Requires initial contact by sales team within 24 hours.
          </p>
          <div className="mt-2.5 pt-2 border-t border-amber-500/20 text-[11px] font-black text-amber-600 dark:text-amber-400 flex items-center justify-between">
            <span>Inspect Latest Lead</span>
            <span>&rarr;</span>
          </div>
        </motion.button>
      </div>

      {/* Sidebar Footer Info */}
      <div className={`p-4 border-t border-slate-200/80 dark:border-zinc-800 text-xs flex items-center justify-between font-bold ${
        isLight ? "text-slate-600" : "text-zinc-400"
      }`}>
        <span>KTD CRM v1.0</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Sync
        </span>
      </div>
    </aside>
  );
}
