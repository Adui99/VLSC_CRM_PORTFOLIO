"use client";

import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { Users, CurrencyDollar, TrendUp, Sparkle, Target, Compass, Fire, ChartPieSlice, SquaresFour, SunDim, Snowflake } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function CrmKpiStats() {
  const { leads, theme } = useCrmStore();

  const isLight = theme === "light";

  const totalLeads = leads.length;
  const totalDealValue = leads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  const closedWonLeads = leads.filter((l) => l.status === "closed_won");
  const closedWonCount = closedWonLeads.length;
  const closedWonValue = closedWonLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((closedWonCount / totalLeads) * 100) : 0;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  const targetMonthlyRevenue = 250000;
  const targetProgress = Math.min(100, Math.round((totalDealValue / targetMonthlyRevenue) * 100));

  // Pipeline stage breakdown calculation
  const negotiationCount = leads.filter(l => l.status === 'in_negotiation' || l.status === 'contacted').length;
  const negotiationValue = leads.filter(l => l.status === 'in_negotiation' || l.status === 'contacted').reduce((sum, l) => sum + (l.dealValue || 0), 0);
  
  // Source performance calculation
  const sourceCounts: Record<string, { count: number; value: number }> = {};
  leads.forEach(l => {
    const src = l.source || 'Direct';
    if (!sourceCounts[src]) sourceCounts[src] = { count: 0, value: 0 };
    sourceCounts[src].count += 1;
    sourceCounts[src].value += l.dealValue || 0;
  });

  const avgDealSize = totalLeads > 0 ? Math.round(totalDealValue / totalLeads) : 0;

  // ----------------------------------------------------
  // DASHBOARD 3: Lead Score Category Distribution Math
  // ----------------------------------------------------
  const hotLeads = leads.filter((l) => l.scoreCategory === "hot" || (l.score !== undefined && l.score >= 80));
  const warmLeads = leads.filter((l) => l.scoreCategory === "warm" || (l.score !== undefined && l.score >= 50 && l.score < 80));
  const coldLeads = leads.filter((l) => l.scoreCategory === "cold" || (l.score !== undefined && l.score < 50));

  const hotCount = hotLeads.length;
  const warmCount = warmLeads.length;
  const coldCount = coldLeads.length;

  const hotValue = hotLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const warmValue = warmLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const coldValue = coldLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  const hotPct = totalLeads > 0 ? Math.round((hotCount / totalLeads) * 100) : 0;
  const warmPct = totalLeads > 0 ? Math.round((warmCount / totalLeads) * 100) : 0;
  const coldPct = totalLeads > 0 ? Math.round((coldCount / totalLeads) * 100) : 0;

  const totalScoreSum = leads.reduce((sum, l) => sum + (l.score || 0), 0);
  const avgLeadScore = totalLeads > 0 ? Math.round(totalScoreSum / totalLeads) : 0;

  // ----------------------------------------------------
  // DASHBOARD 4: Service Interest & Pipeline Value Math
  // ----------------------------------------------------
  const knownServices = [
    "Thiết kế Website & WebGL",
    "Thiết kế Landing Page",
    "Redesign & Tối ưu UI/UX",
    "Bảo trì & Nâng cấp Hệ thống",
    "Tích hợp CRM & Automation",
  ];

  const serviceColors: Record<string, { bar: string; text: string; bg: string }> = {
    "Thiết kế Website & WebGL": { bar: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" },
    "Thiết kế Landing Page": { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    "Redesign & Tối ưu UI/UX": { bar: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
    "Bảo trì & Nâng cấp Hệ thống": { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    "Tích hợp CRM & Automation": { bar: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
    "Khác / Chưa chọn": { bar: "bg-slate-400", text: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10" },
  };

  const serviceStats: Record<string, { count: number; value: number }> = {};
  knownServices.forEach((srv) => {
    serviceStats[srv] = { count: 0, value: 0 };
  });

  leads.forEach((lead) => {
    const services = Array.isArray(lead.services) && lead.services.length > 0 ? lead.services : ["Khác / Chưa chọn"];
    services.forEach((srv) => {
      if (!serviceStats[srv]) {
        serviceStats[srv] = { count: 0, value: 0 };
      }
      serviceStats[srv].count += 1;
      serviceStats[srv].value += lead.dealValue || 0;
    });
  });

  const maxServiceValue = Math.max(...Object.values(serviceStats).map((s) => s.value), 1);

  const cardStyle = `p-6 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isLight 
      ? "bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:shadow-slate-200/50 hover:border-slate-300" 
      : "bg-zinc-900/90 border-zinc-800/90 shadow-sm hover:border-zinc-700"
  }`;

  return (
    <div className="space-y-6 mb-8">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Leads (Blue Palette) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -1.5 }}
          className={cardStyle}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              Total Pipeline Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Users size={22} weight="bold" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black tracking-tight tabular-nums text-blue-600 dark:text-blue-400">
              {totalLeads}
            </span>
            <span className="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendUp size={12} weight="bold" /> +14% mo
            </span>
          </div>
        </motion.div>

        {/* Total Pipeline Value (Amber Palette) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -1.5 }}
          className={cardStyle}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              Total Pipeline Value
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <CurrencyDollar size={24} weight="bold" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black tracking-tight tabular-nums text-amber-600 dark:text-amber-400">
              ${totalDealValue.toLocaleString()}
            </span>
            <span className="text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
              Est. Deals
            </span>
          </div>
        </motion.div>

        {/* Conversion Rate (Emerald Palette) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -1.5 }}
          className={cardStyle}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              Win Conversion Rate
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <TrendUp size={22} weight="bold" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">
              {conversionRate}%
            </span>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              {closedWonCount} Won
            </span>
          </div>
        </motion.div>

        {/* New Inbound Leads (Purple Palette) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -1.5 }}
          className={cardStyle}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              New Actionable Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
              <Sparkle size={22} weight="bold" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black tracking-tight tabular-nums text-purple-600 dark:text-purple-400">
              {newLeadsCount}
            </span>
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-md">
              Requires Contact
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



