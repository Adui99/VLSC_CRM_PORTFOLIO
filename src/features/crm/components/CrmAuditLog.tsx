"use client";

import { useEffect, useState } from "react";
import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { AuditAction } from "@/features/crm/types/crm";
import {
  ClockCounterClockwise,
  ArrowsLeftRight,
  UserPlus,
  UserMinus,
  ShieldCheck,
  Flame,
  Spinner,
  Funnel,
  DownloadSimple,
  Trash,
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
  hot_lead_detected: {
    label: "🔥 Hot Lead Detected",
    icon: <Flame size={15} weight="bold" />,
    color: "bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400 animate-pulse",
  },
};

const FILTER_OPTIONS: { key: AuditAction | "all"; label: string }[] = [
  { key: "all", label: "Tất cả (All)" },
  { key: "lead_status_changed", label: "Status Changed" },
  { key: "hot_lead_detected", label: "🔥 Hot Lead" },
  { key: "user_added", label: "User Added" },
  { key: "user_deleted", label: "User Removed" },
  { key: "permissions_saved", label: "Permissions" },
];

export default function CrmAuditLog() {
  const { auditLogs, fetchAuditLogs, theme, currentUser } = useCrmStore();
  const [selectedFilter, setSelectedFilter] = useState<AuditAction | "all">("all");
  const [purging, setPurging] = useState(false);
  const isLight = theme === "light";
  const isSuperAdmin = currentUser?.role === "super_admin";

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleExportCsv = () => {
    if (auditLogs.length === 0) return;
    const headers = ["ID", "Action", "Description", "Performed By", "Created At"];
    const rows = auditLogs.map((l) => [
      `"${l.id}"`,
      `"${l.action}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${l.performedBy}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ktd_crm_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePurgeOldLogs = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn dọn dẹp các Audit Log đã cũ hơn 30 ngày khỏi hệ thống?")) return;
    try {
      setPurging(true);
      const current = useCrmStore.getState().currentUser;
      const res = await fetch("/api/crm/audit-logs?days=30", {
        method: "DELETE",
        headers: {
          "x-user-role": current?.role || "super_admin",
          "x-user-id": current?.id || "",
        },
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Đã dọn dẹp log cũ thành công.");
        fetchAuditLogs();
      }
    } catch (err) {
      console.error("Error purging logs:", err);
    } finally {
      setPurging(false);
    }
  };

  const filteredLogs = selectedFilter === "all"
    ? auditLogs
    : auditLogs.filter((log) => log.action === selectedFilter);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-900 border-zinc-800"
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-500 dark:from-zinc-600 dark:to-zinc-400 flex items-center justify-center text-white shadow-lg shrink-0">
            <ClockCounterClockwise size={30} weight="bold" />
          </div>
          <div>
            <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-zinc-50"}`}>
              System Audit Log
            </h2>
            <p className={`text-sm mt-1 font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
              Immutable record of all critical actions performed in the CRM. Max 1,000 auto-pruned logs.
            </p>
          </div>
        </div>

        {/* Audit Actions Bar: Export & Purge */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={auditLogs.length === 0}
            className="px-3.5 py-2.5 rounded-xl font-extrabold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Export Audit Logs to CSV"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>Export CSV</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={handlePurgeOldLogs}
              disabled={purging}
              className="px-3.5 py-2.5 rounded-xl font-extrabold text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              title="Purge logs older than 30 days"
            >
              {purging ? <Spinner size={16} className="animate-spin" /> : <Trash size={16} weight="bold" />}
              <span>Clear &gt;30d Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Log Timeline with Status Filter */}
      <div className={`p-6 rounded-3xl border transition-colors ${
        isLight ? "bg-white border-slate-200/60 shadow-sm shadow-slate-200/40" : "bg-zinc-900/80 border-zinc-800/60 shadow-sm shadow-black/20"
      }`}>
        {/* Timeline Header & Filter Bar */}
        <div className="space-y-4 mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800/50">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              Activity Timeline
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              isLight ? "bg-slate-100/70 text-slate-600" : "bg-zinc-800/60 text-zinc-300"
            }`}>
              {filteredLogs.length} / {auditLogs.length} records
            </span>
          </div>

          {/* Status Filter Pills Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold flex items-center gap-1 mr-1 ${isLight ? "text-slate-400" : "text-zinc-400"}`}>
              <Funnel size={14} weight="bold" /> Filter:
            </span>
            {FILTER_OPTIONS.map((opt) => {
              const isActive = selectedFilter === opt.key;
              const count = opt.key === "all"
                ? auditLogs.length
                : auditLogs.filter((l) => l.action === opt.key).length;

              return (
                <button
                  key={opt.key}
                  onClick={() => setSelectedFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-bold"
                      : isLight
                      ? "bg-slate-50/50 border-slate-200/60 text-slate-600 hover:bg-slate-100/70"
                      : "bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  {opt.label} <span className="opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Spinner size={32} className={`animate-spin ${isLight ? "text-slate-300" : "text-zinc-600"}`} />
            <p className={`text-sm font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              Không có nhật ký nào phù hợp với bộ lọc đã chọn.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute left-5 top-0 bottom-0 w-px ${isLight ? "bg-slate-100" : "bg-zinc-800/50"}`} />

            <div className="flex flex-col gap-0">
              {filteredLogs.map((log, idx) => {
                const config = ACTION_CONFIG[log.action];
                return (
                  <div key={log.id} className={`relative flex gap-4 pb-6 ${idx === filteredLogs.length - 1 ? "pb-0" : ""}`}>
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
                        <span className={`text-[10px] font-semibold tabular-nums ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
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

