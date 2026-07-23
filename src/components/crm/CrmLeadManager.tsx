"use client";

import { useState } from "react";
import { useCrmStore } from "@/store/useCrmStore";
import { Lead, LeadStatus } from "@/types/crm";
import { 
  MagnifyingGlass, 
  DownloadSimple, 
  Kanban, 
  Table as TableIcon, 
  Trash, 
  Eye, 
  PlusCircle,
  FunnelX,
  DotsSixVertical,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CrmLeadDetailModal from "./CrmLeadDetailModal";

export default function CrmLeadManager() {
  const { leads, theme, deleteLead, permissions, currentUser, addLead, inspectingLead, setInspectingLead, updateLeadStatus } = useCrmStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [activeDragLead, setActiveDragLead] = useState<Lead | null>(null);
  // F4: confirm dialog when dragging into closed status
  const [pendingClosedDrag, setPendingClosedDrag] = useState<{ leadId: string; targetStatus: 'closed_won' | 'closed_lost' } | null>(null);

  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    dealValue: 10000,
    source: "Manual Staff Entry",
    message: ""
  });

  const isLight = theme === "light";
  const currentRole = currentUser?.role || 'sales_rep';
  const userPerms = permissions[currentRole];

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // CSV Export
  const exportToCSV = () => {
    if (!userPerms.exportLeads) return;
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Status", "Deal Value ($)", "Source", "Created Date"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone || ''}"`,
      `"${l.company || ''}"`,
      l.status,
      l.dealValue,
      `"${l.source}"`,
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vlsc_crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.email) return;
    addLead({
      name: newLeadForm.name,
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      company: newLeadForm.company,
      dealValue: Number(newLeadForm.dealValue) || 5000,
      source: newLeadForm.source,
      message: newLeadForm.message,
      status: 'new'
    });
    setShowAddLeadModal(false);
    setNewLeadForm({ name: "", email: "", phone: "", company: "", dealValue: 10000, source: "Manual Staff Entry", message: "" });
  };

  const statusBadgeStyle: Record<LeadStatus, string> = {
    new: isLight ? "bg-purple-100/90 text-purple-900 border-purple-300 font-bold" : "bg-purple-500/15 text-purple-300 border-purple-500/30",
    contacted: isLight ? "bg-blue-100/90 text-blue-900 border-blue-300 font-bold" : "bg-blue-500/15 text-blue-300 border-blue-500/30",
    in_negotiation: isLight ? "bg-amber-100/90 text-amber-950 border-amber-400 font-bold" : "bg-amber-500/15 text-amber-300 border-amber-500/30",
    closed_won: isLight ? "bg-emerald-100/90 text-emerald-900 border-emerald-300 font-bold" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    closed_lost: isLight ? "bg-red-100/90 text-red-900 border-red-300 font-bold" : "bg-red-500/15 text-red-300 border-red-500/30",
  };

  const statusLabels: Record<LeadStatus, string> = {
    new: "New Lead",
    contacted: "Contacted",
    in_negotiation: "In Negotiation",
    closed_won: "Closed Won",
    closed_lost: "Closed Lost",
  };

  const statusDotColor: Record<LeadStatus, string> = {
    new: "bg-purple-500",
    contacted: "bg-blue-500",
    in_negotiation: "bg-amber-500",
    closed_won: "bg-emerald-500",
    closed_lost: "bg-red-500",
  };

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find((l) => l.id === event.active.id);
    // F4: Prevent dragging already-closed leads
    if (lead && (lead.status === 'closed_won' || lead.status === 'closed_lost')) {
      return;
    }
    setActiveDragLead(lead || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragLead(null);
    if (!over) return;
    const targetStatus = over.id as LeadStatus;
    const draggedLead = leads.find((l) => l.id === active.id);
    if (!draggedLead || draggedLead.status === targetStatus) return;
    // F4: dragging into closed requires confirm
    if (targetStatus === 'closed_won' || targetStatus === 'closed_lost') {
      setPendingClosedDrag({ leadId: draggedLead.id, targetStatus });
      return;
    }
    updateLeadStatus(draggedLead.id, targetStatus);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
        isLight ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/90 border-zinc-800/90"
      }`}>
        
        {/* Search & Filter */}
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, email..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 ${
                isLight ? "bg-slate-50 border-slate-300 text-slate-900 font-medium" : "bg-zinc-950 border-zinc-800 text-zinc-100"
              }`}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer ${
                isLight ? "bg-slate-50 border-slate-300 text-slate-900" : "bg-zinc-950 border-zinc-800 text-zinc-200"
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_negotiation">In Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Table / Kanban Toggle */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isLight ? "bg-slate-100 border-slate-300/80" : "bg-zinc-950 border-zinc-800"
          }`}>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-amber-600 dark:text-amber-400 font-extrabold"
                  : "text-slate-600 dark:text-zinc-400"
              }`}
            >
              <TableIcon size={16} /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-amber-600 dark:text-amber-400 font-extrabold"
                  : "text-slate-600 dark:text-zinc-400"
              }`}
            >
              <Kanban size={16} /> Kanban
            </button>
          </div>

          {/* Export CSV */}
          {userPerms.exportLeads && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={exportToCSV}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight 
                  ? "bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900 hover:border-amber-500/40" 
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100 hover:border-amber-500/40"
              }`}
              title="Export filtered list to CSV"
            >
              <DownloadSimple size={16} weight="bold" /> Export CSV
            </motion.button>
          )}

          {/* Add Manual Lead */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <PlusCircle size={18} weight="bold" /> Add Lead
          </motion.button>
        </div>

      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className={`rounded-2xl border overflow-hidden transition-colors ${
          isLight ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/90 border-zinc-800/90"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs font-extrabold uppercase tracking-wider ${
                  isLight ? "bg-slate-50 border-slate-200/80 text-slate-700" : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
                }`}>
                  <th className="py-3.5 px-4">Contact & Company</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Deal Value</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Date Received</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-sm">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 px-4">
                      <div className="max-w-xs mx-auto text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                          <FunnelX size={28} weight="bold" />
                        </div>
                        <div>
                          <h4 className={`font-black text-base ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                            No matching leads found
                          </h4>
                          <p className={`text-xs font-semibold mt-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                            We couldn't find any leads matching your current search query or status filter.
                          </p>
                        </div>
                        {(searchQuery || selectedStatus !== "all") && (
                          <button
                            onClick={() => { setSearchQuery(""); setSelectedStatus("all"); }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 cursor-pointer transition-colors"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`group transition-colors ${
                        isLight ? "hover:bg-slate-50/90" : "hover:bg-zinc-800/40"
                      }`}
                    >
                      {/* Name & Company */}
                      <td className="py-4 px-4">
                        <div className={`font-extrabold text-base ${isLight ? "text-slate-950" : "text-zinc-100"}`}>
                          {lead.name}
                        </div>
                        <div className={`text-xs font-semibold ${isLight ? "text-slate-600" : "text-zinc-400"} flex items-center gap-2 mt-0.5`}>
                          <span>{lead.email}</span>
                          {lead.company && <span className="font-extrabold">• {lead.company}</span>}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${statusBadgeStyle[lead.status]}`}>
                          {lead.status === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                          {lead.status === 'in_negotiation' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                          {statusLabels[lead.status]}
                        </span>
                      </td>

                      {/* Deal Value */}
                      <td className={`py-4 px-4 font-black text-amber-600 dark:text-amber-400 tabular-nums`}>
                        ${lead.dealValue.toLocaleString()}
                      </td>

                      {/* Source */}
                      <td className={`py-4 px-4 text-xs font-semibold ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                        {lead.source}
                      </td>

                      {/* Date */}
                      <td className={`py-4 px-4 text-xs font-semibold tabular-nums ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={18} weight="bold" />
                          </motion.button>
                          
                          {userPerms.deleteLeads && (
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={() => deleteLead(lead.id)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash size={18} weight="bold" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN VIEW — with Drag & Drop */
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(['new', 'contacted', 'in_negotiation', 'closed_won', 'closed_lost'] as LeadStatus[]).map((statusKey) => {
              const columnLeads = filteredLeads.filter((l) => l.status === statusKey);
              const totalColValue = columnLeads.reduce((sum, l) => sum + l.dealValue, 0);

              return (
                <KanbanColumn
                  key={statusKey}
                  statusKey={statusKey}
                  label={statusLabels[statusKey]}
                  dotColor={statusDotColor[statusKey]}
                  leads={columnLeads}
                  totalValue={totalColValue}
                  isLight={isLight}
                  onCardClick={setSelectedLead}
                />
              );
            })}
          </div>

          {/* Drag Overlay — ghost card while dragging */}
          <DragOverlay>
            {activeDragLead ? (
              <div className={`p-4 rounded-xl border shadow-2xl opacity-90 w-56 ${
                isLight
                  ? "bg-white border-amber-400 shadow-amber-500/20"
                  : "bg-zinc-900 border-amber-500 shadow-amber-500/20"
              }`}>
                <div className={`font-extrabold text-sm mb-1 ${isLight ? "text-slate-900" : "text-zinc-50"}`}>
                  {activeDragLead.name}
                </div>
                <div className={`text-xs font-medium truncate ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                  {activeDragLead.company || activeDragLead.email}
                </div>
                <div className="mt-2 text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                  ${activeDragLead.dealValue.toLocaleString()}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Lead Details Modal */}
      {(selectedLead || inspectingLead) && (
        <CrmLeadDetailModal
          lead={selectedLead || inspectingLead!}
          onClose={() => {
            setSelectedLead(null);
            setInspectingLead(null);
          }}
        />
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isLight ? "bg-slate-900/60 backdrop-blur-md" : "bg-black/80 backdrop-blur-md"
        }`}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-zinc-50"
            }`}
          >
            <h3 className="text-xl font-extrabold tracking-tight mb-4">Add Manual Lead</h3>
            <form onSubmit={handleManualAddLead} className="space-y-3.5">
              <div>
                <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Contact Name</label>
                <input
                  required
                  type="text"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 mt-1 ${
                    isLight ? "bg-white border-slate-300 text-slate-900 font-medium" : "bg-zinc-950 border-zinc-700 text-zinc-100"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Email Address</label>
                <input
                  required
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 mt-1 ${
                    isLight ? "bg-white border-slate-300 text-slate-900 font-medium" : "bg-zinc-950 border-zinc-700 text-zinc-100"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Company</label>
                <input
                  type="text"
                  value={newLeadForm.company}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 mt-1 ${
                    isLight ? "bg-white border-slate-300 text-slate-900 font-medium" : "bg-zinc-950 border-zinc-700 text-zinc-100"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Deal Value ($)</label>
                <input
                  type="number"
                  value={newLeadForm.dealValue}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, dealValue: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 mt-1 ${
                    isLight ? "bg-white border-slate-300 text-slate-900 font-medium" : "bg-zinc-950 border-zinc-700 text-zinc-100"
                  }`}
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-600 cursor-pointer transition-all shadow-md shadow-amber-500/20 active:scale-[0.98]"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}

// ─── Sub-components for Kanban D&D ─────────────────────────────────────────

interface KanbanColumnProps {
  statusKey: LeadStatus;
  label: string;
  dotColor: string;
  leads: Lead[];
  totalValue: number;
  isLight: boolean;
  onCardClick: (lead: Lead) => void;
}

function KanbanColumn({ statusKey, label, dotColor, leads, totalValue, isLight, onCardClick, isLocked }: KanbanColumnProps & { isLocked?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: statusKey });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-2xl border flex flex-col min-h-[500px] transition-all duration-200 ${
        isLocked
          ? isLight
            ? "bg-slate-200/60 border-slate-300/60 opacity-80"
            : "bg-zinc-900/40 border-zinc-700/40 opacity-80"
          : isOver
          ? isLight
            ? "bg-amber-50/80 border-amber-400/60"
            : "bg-amber-500/5 border-amber-500/40"
          : isLight
          ? "bg-slate-100/80 border-slate-300/80"
          : "bg-zinc-950/60 border-zinc-800"
      }`}
    >
      {/* Column Header — clear label + count */}
      <div className="mb-3 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
          <span className={`font-extrabold text-sm tracking-tight flex-1 ${isLight ? "text-slate-800" : "text-zinc-100"}`}>
            {label}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full tabular-nums ${
            isLight ? "bg-slate-800 text-white" : "bg-zinc-700 text-zinc-100"
          }`}>
            {leads.length}
          </span>
        </div>
        <div className="flex items-center justify-between pl-4">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            ${totalValue.toLocaleString()}
          </span>
          {isLocked && (
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-500">🔒 Locked</span>
          )}
        </div>
      </div>

      {/* Cards */}
      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 flex-1">
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} isLight={isLight} onClick={onCardClick} isDraggable={!isLocked} />
          ))}
          {leads.length === 0 && !isLocked && (
            <div className={`flex-1 min-h-[60px] rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-semibold ${
              isLight ? "border-slate-300 text-slate-400" : "border-zinc-700 text-zinc-600"
            }`}>
              Drop here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

interface KanbanCardProps {
  lead: Lead;
  isLight: boolean;
  onClick: (lead: Lead) => void;
}

function KanbanCard({ lead, isLight, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-xl border transition-all duration-200 group ${
        isLight
          ? "bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-500/50"
          : "bg-zinc-900/90 border-zinc-800/90 hover:border-amber-500/50"
      }`}
    >
      {/* Drag handle + name row */}
      <div className="flex items-start gap-2 mb-1">
        <button
          {...attributes}
          {...listeners}
          className={`mt-0.5 cursor-grab active:cursor-grabbing flex-shrink-0 transition-opacity opacity-0 group-hover:opacity-100 ${
            isLight ? "text-slate-400" : "text-zinc-600"
          }`}
          title="Drag to move"
        >
          <DotsSixVertical size={14} weight="bold" />
        </button>
        <div
          className={`font-extrabold text-sm cursor-pointer flex-1 ${isLight ? "text-slate-900" : "text-zinc-50"}`}
          onClick={() => onClick(lead)}
        >
          {lead.name}
        </div>
      </div>

      <div
        className={`text-xs font-medium mb-2 truncate pl-5 cursor-pointer ${isLight ? "text-slate-600" : "text-zinc-400"}`}
        onClick={() => onClick(lead)}
      >
        {lead.company || lead.email}
      </div>

      <div
        className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/80 pl-5 cursor-pointer"
        onClick={() => onClick(lead)}
      >
        <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
          ${lead.dealValue.toLocaleString()}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-semibold tabular-nums">
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
