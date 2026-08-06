"use client";

import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { 
  Target, 
  Compass, 
  ChartPieSlice, 
  SquaresFour, 
  Vault, 
  Lightning,
  Sparkle
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function CrmExecutiveAnalytics() {
  const { leads, theme } = useCrmStore();
  const isLight = theme === "light";

  const totalLeads = leads.length;
  const totalDealValue = leads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  const closedWonLeads = leads.filter((l) => l.status === "closed_won");
  const closedWonCount = closedWonLeads.length;
  const closedWonValue = closedWonLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  const targetMonthlyRevenue = 250000;
  const targetProgress = Math.min(100, Math.round((totalDealValue / targetMonthlyRevenue) * 100));

  // Dynamic Sales Cycle from real DB data
  let avgCycleDays = 0;
  if (closedWonLeads.length > 0) {
    const totalDays = closedWonLeads.reduce((sum, lead) => {
      const created = new Date(lead.createdAt).getTime();
      const now = new Date().getTime();
      const diffDays = Math.max(1, Math.round((now - created) / (1000 * 60 * 60 * 24)));
      return sum + diffDays;
    }, 0);
    avgCycleDays = Math.round((totalDays / closedWonLeads.length) * 10) / 10;
  }

  // Stage breakdown
  const negotiationCount = leads.filter(l => l.status === 'in_negotiation' || l.status === 'contacted').length;
  const negotiationValue = leads.filter(l => l.status === 'in_negotiation' || l.status === 'contacted').reduce((sum, l) => sum + (l.dealValue || 0), 0);

  // Channel sources calculation
  const sourceCounts: Record<string, { count: number; value: number }> = {};
  leads.forEach(l => {
    const src = l.source || 'Direct';
    if (!sourceCounts[src]) sourceCounts[src] = { count: 0, value: 0 };
    sourceCounts[src].count += 1;
    sourceCounts[src].value += l.dealValue || 0;
  });

  const avgDealSize = totalLeads > 0 ? Math.round(totalDealValue / totalLeads) : 0;

  // ----------------------------------------------------
  // DASHBOARD: Lead Score Distribution Math
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
  // DASHBOARD: Service Scope Matrix Math
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

  // ----------------------------------------------------
  // DASHBOARD 1 (TOP 1): Digital Conversion Rate & Profit Cash Flow Math
  // ----------------------------------------------------
  const digitalLeads = leads.filter((l) => 
    l.source?.toLowerCase().includes("landing") || 
    l.source?.toLowerCase().includes("website") || 
    l.source?.toLowerCase().includes("modal") ||
    l.source?.toLowerCase().includes("online")
  );
  const digitalTotalCount = digitalLeads.length;
  const digitalClosedWonLeads = digitalLeads.filter((l) => l.status === "closed_won");
  const digitalClosedWonCount = digitalClosedWonLeads.length;

  const digitalConversionRate = digitalTotalCount > 0 
    ? Math.round((digitalClosedWonCount / digitalTotalCount) * 100) 
    : 0;

  // Realized Cash Flow (Gross Revenue from Closed Won) & 35% Profit Margin
  const profitMarginPercent = 35;
  const realizedNetProfit = Math.round((closedWonValue * profitMarginPercent) / 100);
  const totalPipelineProfitPotential = Math.round((totalDealValue * profitMarginPercent) / 100);

  const cardStyle = `p-6 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isLight 
      ? "bg-white border-slate-200/60 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-slate-200/80 hover:border-amber-500/40 hover:-translate-y-0.5" 
      : "bg-zinc-900/80 border-zinc-800/60 shadow-sm shadow-black/20 hover:shadow-md hover:shadow-black/40 hover:border-amber-500/40 hover:-translate-y-0.5 text-zinc-100"
  }`;

  return (
    <div className="space-y-6 mb-8 max-w-7xl mx-auto">
      {/* Header Banner for Super Admin */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
        isLight ? "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-amber-500/20 shadow-xs" : "bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border-amber-500/20 shadow-xs"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950">
                👑 Super Admin Exclusive
              </span>
              <span className={`text-xs font-semibold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                Executive Data Intelligence
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-zinc-50"}`}>
              Executive Analytics & Financial Intelligence
            </h2>
            <p className={`text-xs sm:text-sm font-medium mt-1 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              Visualized metrics, lead distribution, digital conversion rates, and 35% profit margin cash flow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-3.5 rounded-2xl border text-right ${isLight ? "bg-white border-amber-500/20 shadow-xs" : "bg-zinc-950 border-amber-500/20"}`}>
              <span className={`text-[10px] font-bold uppercase block ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                Net Profit (Realized 35%)
              </span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                ${realizedNetProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🏆 TOP 1 DASHBOARD: DIGITAL CONVERSION RATE & PROFIT MATRIX */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileHover={{ y: -1.5 }}
        className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 ${
          isLight 
            ? "bg-gradient-to-br from-amber-500/5 via-white to-white border-amber-500/40 shadow-md" 
            : "bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/40 shadow-md"
        }`}
      >
        {/* Dashboard Top 1 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner border border-amber-500/30">
              <Vault size={26} weight="bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-black text-lg sm:text-xl tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Tỷ lệ Chuyển đổi Số & Dòng tiền Lợi nhuận (Realized Profit Matrix)
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                  35% Profit Margin
                </span>
              </div>
              <p className={`text-xs font-semibold mt-0.5 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                Mô hình hóa Tỷ lệ Chuyển đổi Lead Kỹ thuật số (Digital Conversion) và Dòng tiền Lợi nhuận ròng thực thu từ DB.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
              <Lightning size={16} weight="bold" />
              Digital Conversion: <strong className="text-sm font-black tabular-nums">{digitalConversionRate}%</strong>
            </span>
          </div>
        </div>

        {/* 4 Financial & Conversion Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Digital Conversion Rate Card */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-zinc-950 border-zinc-800"}`}>
            <span className={`text-[11px] font-extrabold uppercase block mb-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              Digital Conversion Rate
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {digitalConversionRate}%
              </span>
              <span className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                {digitalClosedWonCount} / {digitalTotalCount} Digital Leads
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${digitalConversionRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-emerald-500"
              />
            </div>
          </div>

          {/* Realized Cash Flow Card */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-zinc-950 border-zinc-800"}`}>
            <span className={`text-[11px] font-extrabold uppercase block mb-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              Dòng tiền Thực thu (Closed Won)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                ${closedWonValue.toLocaleString()}
              </span>
              <span className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                {closedWonCount} Hợp đồng
              </span>
            </div>
            <p className={`text-[10px] font-bold mt-2 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
              100% Cash Flow Realized
            </p>
          </div>

          {/* Realized Profit (35% Margin) Card */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-amber-50/80 border-amber-300" : "bg-amber-950/30 border-amber-800/60"}`}>
            <span className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-300 block mb-1">
              💰 Lợi nhuận Ròng Thực thu (Profit 35%)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                ${realizedNetProfit.toLocaleString()}
              </span>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                Net 35%
              </span>
            </div>
            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mt-2">
              Dựa trên Hợp đồng Closed Won
            </p>
          </div>

          {/* Total Pipeline Profit Potential Card */}
          <div className={`p-4 rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-zinc-950 border-zinc-800"}`}>
            <span className={`text-[11px] font-extrabold uppercase block mb-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              Lợi nhuận Tiềm năng Toàn Pipeline
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
                ${totalPipelineProfitPotential.toLocaleString()}
              </span>
              <span className={`text-xs font-bold ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                35% x ${totalDealValue.toLocaleString()}
              </span>
            </div>
            <p className={`text-[10px] font-bold mt-2 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
              Bao gồm cả Deal đang thương lượng
            </p>
          </div>
        </div>

        {/* Digital Funnel Explanation & Breakdown Footer */}
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isLight ? "bg-white border-slate-200 text-slate-700" : "bg-zinc-950 border-zinc-800 text-zinc-300"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkle size={18} className="text-amber-500 shrink-0" />
            <span>
              Tỷ lệ chuyển đổi số được tính từ <strong>{digitalTotalCount} Lead</strong> từ Landing Page & Website Contact Form, chốt được <strong>{digitalClosedWonCount} hợp đồng</strong> thành công.
            </span>
          </div>
          <span className="font-extrabold text-amber-600 dark:text-amber-400 shrink-0 tabular-nums">
            Tỷ lệ chuyển đổi: {digitalConversionRate}%
          </span>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* 🧩 ASYMMETRIC BENTO GRID (3 COLUMNS) FOR REMAINING 4 DASHBOARDS */}
      {/* ============================================================ */}
      
      {/* BENTO ROW 1: Revenue Forecast (Span 2) + Channel Performance (Span 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BENTO CARD 1 (Span 2 Cols): Revenue Target & Forecast Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -1.5 }}
          className={`${cardStyle} lg:col-span-2`}
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
                  Monthly Target Benchmark: <strong className="tabular-nums">${targetMonthlyRevenue.toLocaleString()}</strong>
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 tabular-nums">
              {targetProgress}% Achieved
            </span>
          </div>

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

        {/* BENTO CARD 2 (Span 1 Col): Channel Performance & Sales Velocity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          whileHover={{ y: -1.5 }}
          className={`${cardStyle} lg:col-span-1`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <Compass size={22} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Channel & Velocity
                </h3>
                <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Avg Deal: <strong className="text-amber-600 dark:text-amber-400 tabular-nums">${avgDealSize.toLocaleString()}</strong>
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 tabular-nums">
              Avg Cycle: {avgCycleDays > 0 ? `${avgCycleDays} Days` : 'N/A'}
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(sourceCounts).map(([sourceName, data]) => {
              const pct = totalLeads > 0 ? Math.round((data.count / totalLeads) * 100) : 0;
              return (
                <div key={sourceName} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={`truncate max-w-[140px] ${isLight ? "text-slate-700" : "text-zinc-300"}`}>{sourceName}</span>
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

      {/* BENTO ROW 2: Lead Score Donut (Span 1) + Service Interest Columns (Span 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BENTO CARD 3 (Span 1 Col): Lead Score Category Distribution (Donut Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ y: -1.5 }}
          className={`${cardStyle} lg:col-span-1`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
                <ChartPieSlice size={22} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Lead Score Quality Tier
                </h3>
                <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Donut Distribution
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2 py-1 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20 tabular-nums">
              🔥 {hotCount} HOT
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="54"
                  className={isLight ? "stroke-slate-100" : "stroke-zinc-800"}
                  strokeWidth="16"
                  fill="transparent"
                />
                {hotPct > 0 && (
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="54"
                    stroke="#f43f5e"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={`${(hotPct / 100) * 339.292} 339.292`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 339.292` }}
                    animate={{ strokeDasharray: `${(hotPct / 100) * 339.292} 339.292` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
                {warmPct > 0 && (
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="54"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={`${(warmPct / 100) * 339.292} 339.292`}
                    strokeDashoffset={`${-((hotPct / 100) * 339.292)}`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 339.292` }}
                    animate={{ strokeDasharray: `${(warmPct / 100) * 339.292} 339.292` }}
                    transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                  />
                )}
                {coldPct > 0 && (
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="54"
                    stroke="#0ea5e9"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={`${(coldPct / 100) * 339.292} 339.292`}
                    strokeDashoffset={`${-(((hotPct + warmPct) / 100) * 339.292)}`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 339.292` }}
                    animate={{ strokeDasharray: `${(coldPct / 100) * 339.292} 339.292` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  />
                )}
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-black tabular-nums tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  {avgLeadScore}
                </span>
                <span className={`text-[9px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  AVG SCORE
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                  <span className={isLight ? "text-slate-800" : "text-zinc-200"}>HOT (≥80 pts)</span>
                </div>
                <span className="text-rose-600 dark:text-rose-400 tabular-nums">
                  {hotCount} ({hotPct}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-extrabold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                  <span className={isLight ? "text-slate-800" : "text-zinc-200"}>WARM (50-79 pts)</span>
                </div>
                <span className="text-amber-600 dark:text-amber-400 tabular-nums">
                  {warmCount} ({warmPct}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-extrabold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm" />
                  <span className={isLight ? "text-slate-800" : "text-zinc-200"}>COLD (&lt;50 pts)</span>
                </div>
                <span className="text-sky-600 dark:text-sky-400 tabular-nums">
                  {coldCount} ({coldPct}%)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className={`p-2 rounded-xl border text-center ${isLight ? "bg-rose-50/60 border-rose-200/60" : "bg-rose-950/20 border-rose-800/40"}`}>
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 block">HOT</span>
              <span className="text-xs font-black text-rose-700 dark:text-rose-400 tabular-nums">${(hotValue/1000).toFixed(0)}k</span>
            </div>
            <div className={`p-2 rounded-xl border text-center ${isLight ? "bg-amber-50/60 border-amber-200/60" : "bg-amber-950/20 border-amber-800/40"}`}>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 block">WARM</span>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 tabular-nums">${(warmValue/1000).toFixed(0)}k</span>
            </div>
            <div className={`p-2 rounded-xl border text-center ${isLight ? "bg-sky-50/60 border-sky-200/60" : "bg-sky-950/20 border-sky-800/40"}`}>
              <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 block">COLD</span>
              <span className="text-xs font-black text-sky-700 dark:text-sky-400 tabular-nums">${(coldValue/1000).toFixed(0)}k</span>
            </div>
          </div>
        </motion.div>

        {/* BENTO CARD 4 (Span 2 Cols): Service Scope Matrix (Vertical Column Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          whileHover={{ y: -1.5 }}
          className={`${cardStyle} lg:col-span-2`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
                <SquaresFour size={22} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Service Interest & Pipeline Value
                </h3>
                <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Vertical Column Breakdown by Work Scope
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              5 Service Columns
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3 items-end h-36 sm:h-40 pt-2 pb-1 px-1">
            {knownServices.map((serviceName) => {
              const data = serviceStats[serviceName] || { count: 0, value: 0 };
              const style = serviceColors[serviceName] || serviceColors["Khác / Chưa chọn"];
              const heightPct = maxServiceValue > 0 && data.value > 0
                ? Math.max(16, Math.round((data.value / maxServiceValue) * 100)) 
                : 12;

              const shortNames: Record<string, string> = {
                "Thiết kế Website & WebGL": "Website",
                "Thiết kế Landing Page": "Landing",
                "Redesign & Tối ưu UI/UX": "UI/UX",
                "Bảo trì & Nâng cấp Hệ thống": "Bảo trì",
                "Tích hợp CRM & Automation": "CRM",
              };

              return (
                <div key={serviceName} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex-1 flex flex-col items-center justify-end">
                    <span className={`text-[10px] font-extrabold tabular-nums mb-1 transition-opacity ${
                      isLight ? "text-slate-600" : "text-zinc-400"
                    }`}>
                      ${(data.value / 1000).toFixed(0)}k
                    </span>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`w-full max-w-[32px] sm:max-w-[38px] rounded-t-xl ${style.bar} shadow-sm group-hover:brightness-110 transition-all cursor-pointer ${
                        data.value === 0 ? "opacity-40" : "opacity-100"
                      }`}
                      title={`${serviceName}: $${data.value.toLocaleString()} (${data.count} deals)`}
                    />
                  </div>

                  <div className="text-center mt-2.5 w-full">
                    <span className={`text-[11px] font-extrabold block truncate ${isLight ? "text-slate-800" : "text-zinc-200"}`}>
                      {shortNames[serviceName] || serviceName}
                    </span>
                    <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text} inline-block mt-1`}>
                      {data.count} deals
                    </span>
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
