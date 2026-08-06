"use client";

import { useState, useRef, useEffect } from "react";
import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { 
  Sun, 
  Moon, 
  SignOut, 
  UserGear,
  List,
  Gear,
  Bell,
  X,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { UserRole } from "@/features/crm/types/crm";
import { motion, AnimatePresence } from "framer-motion";

interface CrmHeaderProps {
  activeTab: 'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit') => void;
  toggleMobileSidebar?: () => void;
}

export default function CrmHeader({ activeTab, setActiveTab, toggleMobileSidebar }: CrmHeaderProps) {
  const { 
    theme, toggleTheme, currentUser, logout, testRole, setTestRole,
    notifications, dismissNotification, clearAllNotifications,
    sidebarCollapsed, toggleSidebarCollapsed,
  } = useCrmStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const activeRole = testRole || currentUser?.role || 'sales_rep';

  // Close noti dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleColors: Record<UserRole, { bg: string; text: string; label: string }> = {
    super_admin: { 
      bg: isLight ? "bg-amber-100/90 border-amber-400/80" : "bg-amber-500/15 border-amber-500/30", 
      text: isLight ? "text-amber-950 font-black" : "text-amber-400 font-bold", 
      label: "Super Admin" 
    },
    crm_manager: { 
      bg: isLight ? "bg-blue-100/90 border-blue-400/80" : "bg-blue-500/15 border-blue-500/30", 
      text: isLight ? "text-blue-950 font-black" : "text-blue-400 font-bold", 
      label: "CRM Manager" 
    },
    sales_rep: { 
      bg: isLight ? "bg-emerald-100/90 border-emerald-400/80" : "bg-emerald-500/15 border-emerald-500/30", 
      text: isLight ? "text-emerald-950 font-black" : "text-emerald-400 font-bold", 
      label: "Sales Rep" 
    },
  };

  const currentRoleInfo = roleColors[activeRole];

  const pageTitles: Record<'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit', string> = {
    dashboard: "Lead Analytics & Workspace",
    analytics: "Executive Analytics & Financial Intelligence",
    rbac: "Team Personnel & RBAC Management",
    settings: "Account & Profile Settings",
    audit: "System Audit Log",
  };

  return (
    <header className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between transition-colors duration-200 sticky top-0 z-30 ${
      isLight 
        ? "bg-white border-slate-200/60 text-slate-900 shadow-xs" 
        : "bg-zinc-900 border-zinc-800/60 text-zinc-100"
    }`}>
      
      {/* Left: Mobile Toggle, Desktop Sidebar Collapse Toggle & Page Title */}
      <div className="flex items-center gap-3">
        {toggleMobileSidebar && (
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <List size={22} weight="bold" />
          </button>
        )}

        {/* Desktop Sidebar Collapse / Expand Toggle Button */}
        <button
          onClick={toggleSidebarCollapsed}
          title={sidebarCollapsed ? "Mở rộng thanh bên" : "Thu nhỏ thanh bên"}
          className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-amber-500/40"
              : "bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 hover:border-amber-500/40"
          }`}
        >
          {sidebarCollapsed ? (
            <CaretRight size={18} weight="bold" className="text-amber-500" />
          ) : (
            <CaretLeft size={18} weight="bold" className="text-amber-500" />
          )}
        </button>

        <div>
          <h1 className={`text-sm sm:text-base font-bold tracking-tight ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
            {pageTitles[activeTab]}
          </h1>
          <p className={`text-[11px] hidden sm:block font-medium ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
            Internal Enterprise Portal • VLSC CRM
          </p>
        </div>
      </div>

      {/* Right: Quick Role Test, Notifications, Theme Switcher, User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Test Role Quick Selector */}
        {isSuperAdmin && (
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
            isLight ? "bg-slate-50/50 border-slate-200/80 shadow-xs" : "bg-zinc-800/60 border-zinc-700/60"
          }`}>
            <UserGear size={15} className="text-amber-500" />
            <span className={`font-extrabold ${isLight ? "text-slate-900" : "text-zinc-300"}`}>Test View As:</span>
            <select
              value={activeRole}
              onChange={(e) => {
                const val = e.target.value as UserRole;
                setTestRole(val === currentUser.role ? null : val);
              }}
              className="bg-transparent font-extrabold text-amber-600 dark:text-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">Super Admin</option>
              <option value="crm_manager" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">CRM Manager</option>
              <option value="sales_rep" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">Sales Rep</option>
            </select>
            {testRole && (
              <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Preview</span>
            )}
          </div>
        )}

        {/* F4: Notification Bell */}
        <div className="relative" ref={notiRef}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setNotiDropdownOpen((prev) => !prev)}
            className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight 
                ? "bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:border-amber-500/40 shadow-xs" 
                : "bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 hover:border-amber-500/40"
            }`}
            title="Notifications"
          >
            <Bell size={18} weight={notifications.length > 0 ? "fill" : "bold"} className={notifications.length > 0 ? "text-amber-500" : ""} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notiDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border z-50 overflow-hidden ${
                  isLight 
                    ? "bg-white border-slate-200/60 shadow-slate-200/60" 
                    : "bg-zinc-900 border-zinc-800/60 shadow-black/60"
                }`}
              >
                {/* Dropdown Header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b ${isLight ? "border-slate-100" : "border-zinc-800/40"}`}>
                  <div className="flex items-center gap-2">
                    <Bell size={15} weight="bold" className="text-amber-500" />
                    <span className="text-sm font-bold">Notifications</span>
                    {notifications.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">{notifications.length}</span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell size={28} className="mx-auto text-slate-300 dark:text-zinc-600 mb-2" />
                      <p className={`text-xs font-semibold ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((noti) => (
                      <div
                        key={noti.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors ${
                          isLight ? "border-slate-50 hover:bg-amber-50/40" : "border-zinc-800/40 hover:bg-zinc-800/40"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell size={14} weight="fill" className="text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold leading-snug ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                            {noti.message}
                          </p>
                          <p className={`text-[10px] font-medium mt-0.5 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                            {new Date(noti.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={() => dismissNotification(noti.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0 mt-0.5"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Light / Dark Mode Switch */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isLight 
              ? "bg-white border-slate-200/60 text-slate-800 hover:bg-slate-50 hover:border-amber-500/40 shadow-xs" 
              : "bg-zinc-800/60 border-zinc-700/60 text-amber-400 hover:bg-zinc-800 hover:border-amber-500/40"
          }`}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLight ? <Moon size={18} weight="bold" /> : <Sun size={18} weight="bold" />}
        </motion.button>

        {/* User Info & Interactive Profile Dropdown */}
        {currentUser && (
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotiDropdownOpen(false); }}
              className={`flex items-center gap-2.5 p-1.5 px-3 rounded-xl border transition-colors cursor-pointer ${
                isLight 
                  ? "bg-white hover:bg-slate-50 border-slate-200/60 hover:border-amber-500/40 shadow-xs" 
                  : "bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700/60 hover:border-amber-500/40"
              }`}
            >
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/50"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className={`text-xs font-bold leading-tight ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                  {currentUser.name}
                </span>
                <span className={`text-[10px] font-bold border rounded px-1.5 py-0.2 mt-0.5 ${currentRoleInfo.bg} ${currentRoleInfo.text}`}>
                  {currentRoleInfo.label}
                </span>
              </div>
            </motion.button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-60 rounded-2xl shadow-xl border p-2 z-50 transition-all ${
                isLight 
                  ? "bg-white border-slate-200/60 text-slate-900 shadow-slate-200/60" 
                  : "bg-zinc-900 border-zinc-800/60 text-zinc-100 shadow-black/60"
              }`}>
                <div className="p-3 border-b border-slate-100 dark:border-zinc-800/40 mb-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-zinc-50">{currentUser.name}</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium truncate mt-0.5">{currentUser.email}</div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Gear size={16} weight="bold" /> Account Settings
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <SignOut size={16} weight="bold" /> Log Out
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
