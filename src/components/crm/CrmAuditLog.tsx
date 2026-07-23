"use client";

import { useEffect } from "react";
import { useCrmStore } from "@/store/useCrmStore";
import { AuditAction } from "@/types/crm";
import {
  ClockCounterClockwise,
  ArrowsLeftRight,
  UserPlus,
  UserMinus,
  ShieldCheck,
  Spinner,
} from "@phosphor-icons/react";

const ACTION_CONFIG: Record<AuditAction, { label: string; icon: React.ReactNode; color: string }> = {
  lead_status_changed: {
    label: "Lead Status Changed",
    icon: <ArrowsLeftRight size={15} weight="bold" />,
    color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
  user_added: {
    label: "Team Member Added",
    icon: <UserPlus size={15} weight="bold" />,
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  },
  user_deleted: {
    label: "Team Member Removed",
    icon: <UserMinus size={15} weight="bold" />,
    color: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
  },
  permissions_saved: {
    label: "Permissions Updated",
    icon: <ShieldCheck size={15} weight="bold" />,
    color: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
};

export default function CrmAuditLog() {
  const { auditLogs, fetchAuditLogs, theme } = useCrmStore();
  const isLight = theme === "light";

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-900 border-zinc-800"
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-500 dark:from-zinc-600 dark:to-zinc-400 flex items-center justify-center text-white shadow-lg">
            <ClockCounterClockwise size={30} weight="bold" />
          </div>
          <div>
            <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-zinc-50"}`}>
              System Audit Log
            </h2>
            <p className={`text-sm mt-1 font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
              Immutable record of all critical actions performed in the CRM.
            </p>
          </div>
        </div>
      </div>

      {/* Log Timeline */}
      <div className={`p-6 rounded-3xl border transition-colors ${
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-900 border-zinc-800"
      }`}>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
            Activity Timeline
          </h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
            isLight ? "bg-slate-100 text-slate-600" : "bg-zinc-800 text-zinc-400"
          }`}>
            {auditLogs.length} records
          </span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Spinner size={32} className={`animate-spin ${isLight ? "text-slate-300" : "text-zinc-600"}`} />
            <p className={`text-sm font-semibold ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
              Loading audit records...
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute left-5 top-0 bottom-0 w-px ${isLight ? "bg-slate-200" : "bg-zinc-800"}`} />

            <div className="flex flex-col gap-0">
              {auditLogs.map((log, idx) => {
                const config = ACTION_CONFIG[log.action];
                return (
                  <div key={log.id} className={`relative flex gap-4 pb-6 ${idx === auditLogs.length - 1 ? "pb-0" : ""}`}>
                    {/* Timeline dot with icon */}
                    <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${config.color}`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 p-4 rounded-2xl border transition-colors mt-0.5 ${
                      isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950/60 border-zinc-800"
                    }`}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.color}`}>
                            {config.label}
                          </span>
                          <span className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                            by {log.performedBy}
                          </span>
                        </div>
                        <span className={`text-[10px] font-semibold tabular-nums ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed font-medium ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                        {log.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
