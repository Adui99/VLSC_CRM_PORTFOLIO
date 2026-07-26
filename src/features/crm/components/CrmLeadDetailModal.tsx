"use client";

import { useState } from "react";
import { Lead, LeadStatus } from "@/features/crm/types/crm";
import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { X, Envelope, Phone, Buildings, Calendar, PaperPlaneRight, NotePencil, CurrencyDollar, Briefcase, User } from "@phosphor-icons/react";
import { isCorporateEmail } from "@/features/crm/utils/calculateLeadScore";

interface CrmLeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

export default function CrmLeadDetailModal({ lead, onClose }: CrmLeadDetailModalProps) {
  const { theme, updateLeadStatus, addLeadNote, permissions, currentUser, leads } = useCrmStore();
  const [noteInput, setNoteInput] = useState("");
  const isLight = theme === "light";

  // Keep localStatus in sync — starts from live lead data
  const liveLead = leads.find((l) => l.id === lead.id) || lead;
  const [localStatus, setLocalStatus] = useState<LeadStatus>(liveLead.status);

  const currentRole = currentUser?.role || 'sales_rep';
  const userPerms = permissions[currentRole];

  // Closed leads are locked for non-managers
  const isClosed = localStatus === 'closed_won' || localStatus === 'closed_lost';
  const canReopenClosed = currentRole === 'super_admin' || currentRole === 'crm_manager';
  const statusLocked = isClosed && !canReopenClosed;

  const statusOptions: { key: LeadStatus; label: string; color: string }[] = [
    { key: 'new', label: 'New Lead', color: 'purple' },
    { key: 'contacted', label: 'Contacted', color: 'blue' },
    { key: 'in_negotiation', label: 'In Negotiation', color: 'amber' },
    { key: 'closed_won', label: 'Closed Won', color: 'emerald' },
    { key: 'closed_lost', label: 'Closed Lost', color: 'red' },
  ];

  const statusBadgeStyles: Record<LeadStatus, string> = {
    new: "bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/40 font-black",
    contacted: "bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/40 font-black",
    in_negotiation: "bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-500/40 font-black",
    closed_won: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-black",
    closed_lost: "bg-red-500/15 text-red-800 dark:text-red-300 border-red-500/40 font-black",
  };

  const handleStatusChange = (status: LeadStatus) => {
    if (statusLocked) return;
    setLocalStatus(status);
    updateLeadStatus(lead.id, status);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addLeadNote(lead.id, noteInput);
    setNoteInput("");
  };

  // Filter out system audit trail notes so only human team notes display
  const humanNotes = liveLead.notes.filter(
    (n) => !n.content.startsWith("[System Audit Trail]") && n.author !== "Hệ Thống"
  );

  const isCorp = liveLead.emailType === "company" || isCorporateEmail(liveLead.email);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isLight ? "bg-slate-950/80" : "bg-black/90"
    }`}>
      <div className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all max-h-[90vh] overflow-y-auto ${
        isLight 
          ? "bg-white border-slate-300 text-slate-950" 
          : "bg-zinc-900 border-zinc-800 text-zinc-50"
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className={`text-2xl font-black tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                {liveLead.name}
              </h2>
              <span className={`text-xs font-black px-3 py-1 rounded-lg border ${statusBadgeStyles[localStatus]}`}>
                {statusOptions.find((s) => s.key === localStatus)?.label}
              </span>
              {liveLead.score !== undefined && (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-tight border shadow-sm ${
                  liveLead.scoreCategory === 'hot'
                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40"
                    : liveLead.scoreCategory === 'warm'
                    ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40"
                    : "bg-slate-500/15 text-slate-800 dark:text-zinc-300 border-slate-500/30"
                }`}>
                  {liveLead.scoreCategory === 'hot' && "🔥 "}
                  {liveLead.scoreCategory === 'warm' && "☀️ "}
                  {liveLead.scoreCategory === 'cold' && "❄️ "}
                  {liveLead.score}/100 | {liveLead.scoreCategory?.toUpperCase()}
                </span>
              )}
            </div>
            <p className={`text-xs font-extrabold mt-1.5 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              ID: <span className="font-mono text-slate-700 dark:text-zinc-300">{liveLead.id}</span> • Nguồn: <strong className={isLight ? "text-slate-900" : "text-zinc-200"}>{liveLead.source}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              isLight ? "text-slate-600 hover:text-slate-950 hover:bg-slate-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Lead Meta Information Grid (High Contrast Slate-950 Text) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {/* Email Box */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50/90 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className={`flex items-center justify-between text-xs font-extrabold mb-1.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
              <span className="flex items-center gap-1.5"><Envelope size={15} weight="bold" /> Email</span>
              {isCorp && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                  🏢 Công ty
                </span>
              )}
            </div>
            <a href={`mailto:${liveLead.email}`} className="text-sm font-black text-indigo-700 dark:text-indigo-400 hover:underline block truncate">
              {liveLead.email}
            </a>
          </div>

          {/* Phone Box */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50/90 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className={`flex items-center gap-1.5 text-xs font-extrabold mb-1.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
              <Phone size={15} weight="bold" /> Số điện thoại
            </div>
            <span className={`text-sm font-black ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
              {liveLead.phone || "Chưa cung cấp"}
            </span>
          </div>

          {/* Company & Size Box */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50/90 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className={`flex items-center gap-1.5 text-xs font-extrabold mb-1.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
              <Buildings size={15} weight="bold" /> Công ty / Tổ chức
            </div>
            <span className={`text-sm font-black block truncate ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
              {liveLead.company || "Cá nhân / Chưa xác định"}
              {liveLead.companySize && (
                <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 ml-1.5">
                  ({liveLead.companySize} nhân sự)
                </span>
              )}
            </span>
          </div>

          {/* Role / Position Box */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50/90 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className={`flex items-center gap-1.5 text-xs font-extrabold mb-1.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
              <User size={15} weight="bold" /> Chức vụ / Vai trò
            </div>
            <span className={`text-sm font-black ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
              {liveLead.role || "Chưa cập nhật"}
            </span>
          </div>

          {/* Estimated Deal Value Box */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50/90 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className={`flex items-center gap-1.5 text-xs font-extrabold mb-1.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
              <CurrencyDollar size={16} weight="bold" /> Giá trị Hợp đồng Tiềm năng
            </div>
            <span className="text-base font-black text-amber-700 dark:text-amber-400 tabular-nums">
              ${(liveLead.dealValue || 0).toLocaleString()}
            </span>
          </div>

          {/* Received On Date Box */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50/90 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className={`flex items-center gap-1.5 text-xs font-extrabold mb-1.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
              <Calendar size={15} weight="bold" /> Thời gian tiếp nhận
            </div>
            <span className={`text-sm font-black tabular-nums ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
              {new Date(liveLead.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Services Interested In */}
        {Array.isArray(liveLead.services) && liveLead.services.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              isLight ? "text-slate-800" : "text-zinc-300"
            }`}>
              <Briefcase size={15} weight="bold" /> Dịch vụ / Hạng mục quan tâm ({liveLead.services.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {liveLead.services.map((svc) => (
                <span
                  key={svc}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                    isLight
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-900"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                  }`}
                >
                  ✓ {svc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Message Content */}
        {liveLead.message && (
          <div className="mb-6">
            <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isLight ? "text-slate-800" : "text-zinc-300"}`}>
              Nội dung yêu cầu tư vấn (Inbound Message)
            </h3>
            <div className={`p-4 rounded-2xl border text-sm leading-relaxed font-extrabold ${
              isLight ? "bg-amber-500/10 border-amber-500/30 text-slate-950" : "bg-amber-500/10 border-amber-500/20 text-zinc-100"
            }`}>
              &quot;{liveLead.message}&quot;
            </div>
          </div>
        )}

        {/* Change Status Selector */}
        {userPerms.editLeadStatus && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-black uppercase tracking-wider ${isLight ? "text-slate-800" : "text-zinc-300"}`}>
                Cập nhật Trạng thái Pipeline
              </h3>
              {statusLocked && (
                <span className="text-[11px] font-extrabold text-amber-800 dark:text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-md border border-amber-500/30">
                  🔒 Khóa — Yêu cầu Quản lý phê duyệt
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(({ key, label }) => {
                const isActive = localStatus === key;
                const isDisabledOption = statusLocked && key !== localStatus;
                return (
                  <button
                    key={key}
                    disabled={isDisabledOption}
                    onClick={() => handleStatusChange(key)}
                    className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                      isDisabledOption
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      isActive
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 scale-105"
                        : isLight
                        ? "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200"
                        : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Team Activity Notes Section (Excludes Audit Log) */}
        <div>
          <h3 className={`text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
            isLight ? "text-slate-800" : "text-zinc-300"
          }`}>
            <NotePencil size={16} weight="bold" /> Ghi chú nội bộ Sales ({humanNotes.length})
          </h3>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Nhập ghi chú hoặc tóm tắt cuộc gọi..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 font-extrabold ${
                isLight ? "bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-400" : "bg-zinc-950 border-zinc-800 text-zinc-100"
              }`}
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl font-black text-sm bg-amber-500 text-slate-950 hover:bg-amber-600 cursor-pointer transition-all flex items-center gap-1 shadow-md shadow-amber-500/20 active:scale-[0.98]"
            >
              Lưu Ghi chú
              <PaperPlaneRight size={16} weight="bold" />
            </button>
          </form>

          {/* Notes List (Human Only) */}
          <div className="flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
            {humanNotes.length === 0 ? (
              <p className={`text-xs font-bold italic ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                Chưa có ghi chú nội bộ cho Lead này.
              </p>
            ) : (
              humanNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-black ${isLight ? "text-slate-900" : "text-zinc-200"}`}>
                      👤 {note.author}
                    </span>
                    <span className={`text-[10px] font-bold tabular-nums ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={`leading-relaxed font-extrabold ${isLight ? "text-slate-800" : "text-zinc-300"}`}>
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

