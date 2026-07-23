"use client";

import { useCrmStore } from "@/store/useCrmStore";
import { Users, CurrencyDollar, TrendUp, Sparkle, Target, Funnel, ChartBar, Compass } from "@phosphor-icons/react";
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

  const cardStyle = `p-6 rounded-2xl border transition-all duration-200 ${
    isLight 
      ? "bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:shadow-slate-200/50 hover:border-amber-500/40" 
      : "bg-zinc-900/90 border-zinc-800/90 shadow-sm hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/5"
  }`;

  return (
    <div className="space-y-6 mb-8">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Leads */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
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
            <span className={`text-3xl font-extrabold tracking-tight tabular-nums ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
              {totalLeads}
            </span>
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendUp size={12} weight="bold" /> +14% mo
            </span>
          </div>
        </motion.div>

        {/* Total Pipeline Value (Highlight Card with Standardized Container) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
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
            <span className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>Est. Deals</span>
          </div>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
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
            <span className={`text-3xl font-extrabold tracking-tight tabular-nums ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
              {conversionRate}%
            </span>
            <span className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>{closedWonCount} Won</span>
          </div>
        </motion.div>

        {/* New Inbound Leads */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
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
            <span className="text-3xl font-extrabold tracking-tight tabular-nums text-purple-700 dark:text-purple-400">
              {newLeadsCount}
            </span>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-md">
              Requires Contact
            </span>
          </div>
        </motion.div>
      </div>

      {/* 2 EXECUTIVE BUSINESS OWNER DASHBOARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DASHBOARD 1: Revenue Forecast & Pipeline Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className={cardStyle}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <Target size={22} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Revenue Target & Forecast
                </h3>
                <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Monthly Target: <strong className="tabular-nums">${targetMonthlyRevenue.toLocaleString()}</strong>
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 tabular-nums">
              {targetProgress}% Achieved
            </span>
          </div>

          {/* Target Progress Bar with Animation */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className={isLight ? "text-slate-600" : "text-zinc-400"}>Current Pipeline</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold tabular-nums">
                ${totalDealValue.toLocaleString()} / ${targetMonthlyRevenue.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${targetProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-amber-500 shadow-sm"
              />
            </div>
          </div>

          {/* Stage Value Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border transition-colors ${isLight ? "bg-slate-50/70 border-slate-200/60" : "bg-zinc-800/50 border-zinc-700/60"}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-zinc-400">
                <span>In Negotiation</span>
                <span className="text-amber-600 font-extrabold tabular-nums">{negotiationCount} deals</span>
              </div>
              <div className={`text-lg font-black mt-1 tabular-nums ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                ${negotiationValue.toLocaleString()}
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-colors ${isLight ? "bg-emerald-50/60 border-emerald-200/60" : "bg-emerald-950/20 border-emerald-800/40"}`}>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>Closed Won</span>
                <span className="font-extrabold tabular-nums">{closedWonCount} deals</span>
              </div>
              <div className="text-lg font-black mt-1 tabular-nums text-emerald-700 dark:text-emerald-400">
                ${closedWonValue.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* DASHBOARD 2: Lead Acquisition Sources & Sales Velocity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={cardStyle}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <Compass size={22} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Channel Performance & Velocity
                </h3>
                <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Avg Deal Size: <strong className="text-amber-600 dark:text-amber-400 tabular-nums">${avgDealSize.toLocaleString()}</strong>
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Avg Cycle: 8.5 Days
            </span>
          </div>

          {/* Channel Performance Breakdown */}
          <div className="space-y-3">
            {Object.entries(sourceCounts).map(([sourceName, data]) => {
              const pct = totalLeads > 0 ? Math.round((data.count / totalLeads) * 100) : 0;
              return (
                <div key={sourceName} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={isLight ? "text-slate-700" : "text-zinc-300"}>{sourceName}</span>
                    <span className="text-slate-600 dark:text-zinc-400 font-extrabold tabular-nums">
                      {data.count} leads (${data.value.toLocaleString()})
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-amber-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

