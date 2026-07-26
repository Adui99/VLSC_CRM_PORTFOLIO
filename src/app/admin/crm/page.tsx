"use client";

import { useState, useEffect } from "react";
import { useCrmStore } from "@/features/crm/store/useCrmStore";
import CrmSidebar from "@/features/crm/components/CrmSidebar";
import CrmHeader from "@/features/crm/components/CrmHeader";
import CrmKpiStats from "@/features/crm/components/CrmKpiStats";
import CrmLeadManager from "@/features/crm/components/CrmLeadManager";
import CrmRbacManager from "@/features/crm/components/CrmRbacManager";
import CrmUserSettings from "@/features/crm/components/CrmUserSettings";
import CrmLoginModal from "@/features/crm/components/CrmLoginModal";
import CrmAuditLog from "@/features/crm/components/CrmAuditLog";
import CrmExecutiveAnalytics from "@/features/crm/components/CrmExecutiveAnalytics";
import { ShieldWarning } from "@phosphor-icons/react";

export default function CrmAdminPage() {
  const { theme, isAuthenticated, currentUser, testRole, permissions, fetchDataFromDb } = useCrmStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'rbac' | 'settings' | 'audit'>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    fetchDataFromDb();
  }, [fetchDataFromDb]);

  if (!mounted) return null;

  const isLight = theme === "light";
  const currentRole = testRole || currentUser?.role || 'sales_rep';
  const userPerms = permissions[currentRole];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isLight ? "bg-white text-slate-900" : "bg-zinc-950 text-zinc-50"
    } ${theme}`}>
      
      {/* Auth Guard Modal if not logged in */}
      {!isAuthenticated || !currentUser ? (
        <CrmLoginModal />
      ) : (
        <div className="flex min-h-screen relative">
          
          {/* 30% Left Sidebar (Desktop) */}
          <div className="hidden lg:flex">
            <CrmSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div 
                className="fixed inset-0 bg-black/75 transition-opacity"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="relative z-10 w-4/5 max-w-xs h-full bg-white dark:bg-zinc-900">
                <CrmSidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isOpenMobile={mobileSidebarOpen}
                  setIsOpenMobile={setMobileSidebarOpen}
                />
              </div>
            </div>
          )}

          {/* 70% Right Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Header */}
            <CrmHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            />

            {/* Main Content Workspace */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {activeTab === 'dashboard' ? (
                userPerms.viewLeads ? (
                  <>
                    <CrmKpiStats />
                    <CrmLeadManager />
                  </>
                ) : (
                  <div className={`p-12 text-center rounded-3xl border ${
                    isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-800"
                  }`}>
                    <ShieldWarning size={48} className="mx-auto text-amber-500 mb-3" />
                    <h3 className="text-xl font-bold">Access Restricted</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Your role ({currentRole}) does not have permission to view lead dashboard data.
                    </p>
                  </div>
                )
              ) : activeTab === 'analytics' ? (
                currentRole === 'super_admin' ? (
                  <CrmExecutiveAnalytics />
                ) : (
                  <div className={`p-12 text-center rounded-3xl border ${
                    isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-800"
                  }`}>
                    <ShieldWarning size={48} className="mx-auto text-amber-500 mb-3" />
                    <h3 className="text-xl font-bold">Super Admin Access Only</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                      Executive Analytics & Financial Dashboards are reserved exclusively for Super Admin.
                    </p>
                  </div>
                )
              ) : activeTab === 'rbac' ? (
                userPerms.viewStaff ? (
                  <CrmRbacManager />
                ) : (
                  <div className={`p-12 text-center rounded-3xl border ${
                    isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-800"
                  }`}>
                    <ShieldWarning size={48} className="mx-auto text-amber-500 mb-3" />
                    <h3 className="text-xl font-bold">Access Restricted</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Your role ({currentRole}) does not have permission to view Team & RBAC management.
                    </p>
                  </div>
                )
              ) : activeTab === 'audit' ? (
                currentRole === 'super_admin' ? (
                  <CrmAuditLog />
                ) : (
                  <div className={`p-12 text-center rounded-3xl border ${
                    isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-800"
                  }`}>
                    <ShieldWarning size={48} className="mx-auto text-amber-500 mb-3" />
                    <h3 className="text-xl font-bold">Access Restricted</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                      Audit Log is only accessible by Super Admin.
                    </p>
                  </div>
                )
              ) : (
                <CrmUserSettings />
              )}
            </main>
          </div>

        </div>
      )}

    </div>
  );
}
