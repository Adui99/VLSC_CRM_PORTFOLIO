"use client";

import { useState } from "react";
import { Lead, LeadStatus } from "@/types/crm";
import { useCrmStore } from "@/store/useCrmStore";
import { X, Envelope, Phone, Buildings, Calendar, PaperPlaneRight, NotePencil } from "@phosphor-icons/react";

interface CrmLeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

export default function CrmLeadDetailModal({ lead, onClose }: CrmLeadDetailModalProps) {
  const { theme, updateLeadStatus, addLeadNote, permissions, currentUser, leads } = useCrmStore();
  const [noteInput, setNoteInput] = useState("");
  const isLight = theme === "light";

  // F6: Keep localStatus in sync — starts from live lead data
  const liveLead = leads.find((l) => l.id === lead.id) || lead;
  const [localStatus, setLocalStatus] = useState<LeadStatus>(liveLead.status);

  const currentRole = currentUser?.role || 'sales_rep';
  const userPerms = permissions[currentRole];

  // F4: closed leads are locked for non-managers
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
    new: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    contacted: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    in_negotiation: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    closed_won: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    closed_lost: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30",
  };

  const handleStatusChange = (status: LeadStatus) => {
    if (statusLocked) return;
    // F6: Update local highlight immediately
    setLocalStatus(status);
    // Then sync to store + DB
    updateLeadStatus(lead.id, status);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addLeadNote(lead.id, noteInput);
    setNoteInput("");
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isLight ? "bg-slate-900/60 backdrop-blur-md" : "bg-black/80 backdrop-blur-md"
    }`}>
      <div className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all max-h-[90vh] overflow-y-auto ${
        isLight 
          ? "bg-white border-slate-200 text-slate-900" 
          : "bg-zinc-900 border-zinc-800 text-zinc-100"
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-extrabold tracking-tight">{liveLead.name}</h2>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${statusBadgeStyles[localStatus]}`}>
                {statusOptions.find((s) => s.key === localStatus)?.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              ID: {liveLead.id} • Source: {liveLead.source}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Lead Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-xs font-semibold mb-1.5">
              <Envelope size={14} /> Email
            </div>
            {/* Fix 5: email keeps amber, other fields use slate-700 */}
            <a href={`mailto:${liveLead.email}`} className="text-sm font-extrabold text-amber-600 dark:text-amber-400 hover:underline">
              {liveLead.email}
            </a>
          </div>

          <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-xs font-semibold mb-1.5">
              <Phone size={14} /> Phone Number
            </div>
            {/* Fix 5: stronger text color */}
            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">{liveLead.phone || "N/A"}</span>
          </div>

          <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-xs font-semibold mb-1.5">
              <Buildings size={14} /> Company / Organization
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">{liveLead.company || "Individual / Unspecified"}</span>
          </div>

          <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-800/80"}`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-xs font-semibold mb-1.5">
              <Calendar size={14} /> Received On
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">
              {new Date(liveLead.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Message Content */}
        {liveLead.message && (
          <div className="mb-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-400 mb-2">
              Inbound Inquiry Message
            </h3>
            <div className={`p-4 rounded-2xl border text-sm leading-relaxed font-medium ${
              isLight ? "bg-amber-500/5 border-amber-500/20 text-slate-900" : "bg-amber-500/10 border-amber-500/20 text-zinc-200"
            }`}>
              "{liveLead.message}"
            </div>
          </div>
        )}

        {/* Change Status Selector — F4/F6 */}
        {userPerms.editLeadStatus && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-400">
                Update Pipeline Status
              </h3>
              {statusLocked && (
                <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                  🔒 Locked — Manager Approval Required
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                      isDisabledOption
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      isActive
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 scale-105"
                        : isLight
                        ? "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Team Activity & Notes Section */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
            <NotePencil size={16} /> Team Activity & Audit Notes ({liveLead.notes.length})
          </h3>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add internal note or call summary..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium ${
                isLight ? "bg-slate-50 border-slate-300 text-slate-950" : "bg-zinc-950 border-zinc-800 text-zinc-100"
              }`}
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl font-extrabold text-sm bg-amber-500 text-slate-950 hover:bg-amber-600 cursor-pointer transition-all flex items-center gap-1 shadow-md shadow-amber-500/20 active:scale-[0.98]"
            >
              Add Note
              <PaperPlaneRight size={16} weight="bold" />
            </button>
          </form>

          {/* Notes List */}
          <div className="flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
            {liveLead.notes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes added yet for this lead.</p>
            ) : (
              liveLead.notes.map((note) => {
                const isAuditNote = note.content.startsWith('[System Audit Trail]') || note.author === 'Hệ Thống';
                return (
                  <div
                    key={note.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isAuditNote
                        ? isLight
                          // Fix 5: darker amber bg + near-black text for audit notes — no more light-on-light
                          ? "bg-amber-50 border-amber-300 text-slate-800"
                          : "bg-amber-500/10 border-amber-500/30 text-zinc-200"
                        : isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-zinc-950 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-extrabold ${
                        isAuditNote
                          ? "text-amber-700 dark:text-amber-400"
                          : isLight ? "text-slate-800" : "text-zinc-200"
                      }`}>
                        {isAuditNote ? "🛡️ System Audit Log" : note.author}
                      </span>
                      <span className={`text-[10px] font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {/* Fix 5: audit note content uses dark text, not amber-on-amber */}
                    <p className={`leading-relaxed font-medium ${
                      isAuditNote
                        ? isLight ? "text-slate-700" : "text-amber-100"
                        : isLight ? "text-slate-700" : "text-zinc-300"
                    }`}>
                      {note.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
