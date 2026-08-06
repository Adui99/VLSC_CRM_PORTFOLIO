"use client";

import { useState } from "react";
import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { calculateCrmMetrics, KNOWN_SERVICES } from "@/features/crm/utils/crmMetrics";
import { 
  Target, 
  Compass, 
  ChartPieSlice, 
  SquaresFour, 
  Vault, 
  Lightning,
  Sparkle,
  Warning,
  Trophy,
  TrendUp,
  Clock,
  X,
  CaretRight,
  ShieldWarning,
  Info
} from "@phosphor-icons/react";
import { motion, Variants } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Custom Recharts Glassmorphism Tooltip
const CustomTooltip = ({ active, payload, label, isLight }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-2xl border text-xs shadow-xl backdrop-blur-md ${
        isLight 
          ? "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/80" 
          : "bg-zinc-900/95 border-zinc-700/90 text-zinc-100 shadow-black/80"
      }`}>
        <p className="font-extrabold mb-1.5">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-semibold my-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className={isLight ? "text-slate-600" : "text-zinc-400"}>{entry.name}:</span>
            </div>
            <span className="font-black tabular-nums">
              {typeof entry.value === 'number' && entry.value >= 1000 ? `$${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Clean, Non-overlapping Glassmorphism Tooltip for Donut Charts
const CustomDonutTooltip = ({ active, payload, isLight }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const val = item.value;
    const name = item.name || item.payload?.name;
    const count = item.payload?.count;

    return (
      <div className={`px-3 py-2 rounded-xl border text-xs shadow-2xl backdrop-blur-md pointer-events-none z-50 ${
        isLight 
          ? "bg-slate-900/95 text-white border-slate-700 shadow-slate-900/40" 
          : "bg-zinc-900/95 text-zinc-100 border-zinc-700 shadow-black/80"
      }`}>
        <div className="flex items-center gap-2 font-black mb-0.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.payload?.fill || item.color || "#3b82f6" }} />
          <span className="truncate max-w-[150px]">{name}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[11px] font-bold">
          <span className="opacity-75">Giá trị:</span>
          <span className="text-amber-400 tabular-nums font-black">
            {typeof val === 'number' && val >= 1000 ? `$${val.toLocaleString()}` : val}
          </span>
        </div>
        {count !== undefined && (
          <div className="flex items-center justify-between gap-3 text-[10px] font-semibold opacity-75">
            <span>Số lượng:</span>
            <span className="tabular-nums font-bold">{count} Leads</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function CrmExecutiveAnalytics() {
  const { leads, auditLogs, theme } = useCrmStore();
  const isLight = theme === "light";
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Consume Centralized Single Source of Truth Metrics
  const metrics = calculateCrmMetrics(leads);

  const {
    totalLeads,
    totalDealValue,
    closedWonCount,
    closedWonValue,
    conversionRate,
    winRatePct,
    avgCycleDays,
    targetMonthlyRevenue,
    targetProgress,
    avgDealSize,
    negotiationCount,
    negotiationValue,
    hotCount,
    hotPct,
    warmCount,
    warmPct,
    coldCount,
    coldPct,
    hotValue,
    warmValue,
    coldValue,
    avgLeadScore,
    digitalTotalCount,
    digitalClosedWonCount,
    digitalConversionRate,
    realizedNetProfit,
    totalPipelineProfitPotential,
    serviceStats,
    maxServiceValue,
    stalledDeals,
    salesRepStats
  } = metrics;

  // Channel sources calculation
  const sourceCounts: Record<string, { count: number; value: number }> = {};
  leads.forEach(l => {
    const src = l.source || 'Direct';
    if (!sourceCounts[src]) sourceCounts[src] = { count: 0, value: 0 };
    sourceCounts[src].count += 1;
    sourceCounts[src].value += l.dealValue || 0;
  });

  const sortedSalesReps = Object.entries(salesRepStats).sort(
    ([, a], [, b]) => b.closedWonValue - a.closedWonValue || b.totalValue - a.totalValue
  );

  // ----------------------------------------------------
  // RECHARTS DATA PREPARATION
  // ----------------------------------------------------
  
  // 1. Revenue Forecast Stage Area Data
  const targetChartData = [
    { stage: "Mới tạo", value: Math.round(totalDealValue * 0.1), target: 50000 },
    { stage: "Đã liên hệ", value: Math.round(totalDealValue * 0.25), target: 120000 },
    { stage: "Đàm phán", value: negotiationValue, target: 180000 },
    { stage: "Closed Won", value: closedWonValue, target: targetMonthlyRevenue },
  ];

  // 2. Service Scope Bar Chart Data
  const serviceChartData = KNOWN_SERVICES.map(serviceName => {
    const data = serviceStats[serviceName] || { count: 0, value: 0 };
    const shortNames: Record<string, string> = {
      "Thiết kế Website & WebGL": "Website",
      "Thiết kế Landing Page": "Landing",
      "Redesign & Tối ưu UI/UX": "UI/UX",
      "Bảo trì & Nâng cấp Hệ thống": "Bảo trì",
      "Tích hợp CRM & Automation": "CRM",
    };
    return {
      name: shortNames[serviceName] || serviceName,
      fullName: serviceName,
      "Doanh thu ($)": data.value,
      "Số Deal": data.count,
    };
  });

  // 3. Lead Score Pie/Donut Chart Data
  const leadScorePieData = [
    { name: "HOT (≥80 pts)", value: hotCount, dealValue: hotValue, fill: "#f43f5e" },
    { name: "WARM (50-79 pts)", value: warmCount, dealValue: warmValue, fill: "#f59e0b" },
    { name: "COLD (<50 pts)", value: coldCount, dealValue: coldValue, fill: "#0ea5e9" },
  ].filter(d => d.value > 0);

  // 4. Channel Acquisition Horizontal Bar Chart Data
  const channelChartData = Object.entries(sourceCounts).map(([sourceName, data]) => ({
    name: sourceName,
    "Lead Count": data.count,
    "Doanh thu": data.value,
  }));

  // Card spotlight hover interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const bentoCardStyle = `relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group ${
    isLight 
      ? "bg-white/90 backdrop-blur-md border-slate-200/70 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/50 hover:-translate-y-1" 
      : "bg-zinc-900/80 backdrop-blur-md border-zinc-800/80 shadow-sm shadow-black/40 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/50 hover:-translate-y-1 text-zinc-100"
  }`;

  const spotlightOverlay = `pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(245,158,11,0.08),transparent_80%)]`;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 mb-10 max-w-7xl mx-auto"
    >
      {/* ============================================================ */}
      {/* 👑 TIER 1 (HERO ROW - ASYMMETRIC 2:1): UNIFIED PROFIT MATRIX (2 COLS) + REVENUE TARGET BENCHMARK (1 COL) */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* UNIFIED HERO BENTO CARD: CEO Revenue & Realized Profit Matrix (2 Cols) */}
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} lg:col-span-2 flex flex-col justify-between`}>
          <div className={spotlightOverlay} />

          <div>
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner border border-amber-500/30">
                  <Vault size={24} weight="bold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-black text-lg tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                      CEO Revenue & Realized Profit Matrix
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                      35% Net Margin
                    </span>
                  </div>
                  <p className={`text-xs font-semibold mt-0.5 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                    Mô hình hóa Dòng tiền Thực thu, Lợi nhuận Ròng và Tỷ lệ chuyển đổi số từ hệ thống
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                  <Lightning size={16} weight="bold" />
                  Digital Win: <strong className="text-sm font-black tabular-nums">{digitalConversionRate}%</strong>
                </span>
              </div>
            </div>

            {/* 4 Financial & Conversion Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Metric 1: Digital Conversion */}
              <div className={`p-4 rounded-2xl border ${isLight ? "bg-white/80 border-slate-200/80" : "bg-zinc-950/80 border-zinc-800/80"}`}>
                <span className={`text-[11px] font-extrabold uppercase block mb-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  ⚡ Digital Conversion Rate
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

              {/* Metric 2: Cash Flow Realized */}
              <div className={`p-4 rounded-2xl border ${isLight ? "bg-white/80 border-slate-200/80" : "bg-zinc-950/80 border-zinc-800/80"}`}>
                <span className={`text-[11px] font-extrabold uppercase block mb-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  💵 Dòng tiền Thực thu (Closed Won)
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
                  100% Gross Cash Flow
                </p>
              </div>

              {/* Metric 3: Realized Net Profit 35% */}
              <div className={`p-4 rounded-2xl border ${isLight ? "bg-amber-50/80 border-amber-300/80" : "bg-amber-950/30 border-amber-800/60"}`}>
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

              {/* Metric 4: Pipeline Potential Profit */}
              <div className={`p-4 rounded-2xl border ${isLight ? "bg-white/80 border-slate-200/80" : "bg-zinc-950/80 border-zinc-800/80"}`}>
                <span className={`text-[11px] font-extrabold uppercase block mb-1 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  📈 Lợi nhuận Tiềm năng Toàn Pipeline
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
          </div>

          {/* Footer Note */}
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
            isLight ? "bg-slate-50/80 border-slate-200/80 text-slate-700" : "bg-zinc-950/90 border-zinc-800/80 text-zinc-300"
          }`}>
            <div className="flex items-center gap-2">
              <Sparkle size={16} className="text-amber-500 shrink-0" />
              <span>
                Nguồn lead số từ Landing Page & Website Contact Form.
              </span>
            </div>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 shrink-0 tabular-nums">
              Tỷ lệ chuyển đổi: {digitalConversionRate}%
            </span>
          </div>
        </div>

        {/* BENTO CARD: Revenue Target Benchmark Area Chart (1 Col) */}
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} lg:col-span-1 flex flex-col justify-between`}>
          <div className={spotlightOverlay} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                  <Target size={22} weight="bold" />
                </div>
                <div>
                  <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                    Revenue Target Benchmark
                  </h3>
                  <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                    Target: <strong className="tabular-nums">${targetMonthlyRevenue.toLocaleString()}</strong>
                  </p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 tabular-nums">
                {targetProgress}%
              </span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-44 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={targetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2e8f0" : "#27272a"} vertical={false} />
                  <XAxis dataKey="stage" stroke={isLight ? "#64748b" : "#a1a1aa"} fontSize={11} tickLine={false} />
                  <YAxis stroke={isLight ? "#64748b" : "#a1a1aa"} fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} tickLine={false} />
                  <Tooltip content={<CustomTooltip isLight={isLight} />} />
                  <Area type="monotone" dataKey="value" name="Pipeline Value ($)" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="target" name="Benchmark ($)" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className={`p-2.5 rounded-xl border ${isLight ? "bg-slate-50/70 border-slate-200/60" : "bg-zinc-800/40 border-zinc-700/60"}`}>
              <span className="text-[10px] font-bold text-slate-500 block">Negotiation</span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400 tabular-nums">
                ${negotiationValue.toLocaleString()}
              </span>
            </div>

            <div className={`p-2.5 rounded-xl border ${isLight ? "bg-emerald-50/60 border-emerald-200/60" : "bg-emerald-950/20 border-emerald-800/40"}`}>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">Closed Won</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${closedWonValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </motion.div>

      {/* ============================================================ */}
      {/* 🎯 TIER 2 (SALES & PERFORMANCE ROW - ASYMMETRIC 2:1): FUNNEL (2 COLS) + LEADERBOARD (1 COL) */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BENTO CARD: Sales Conversion Funnel Visualizer (2 Cols) — Seamless Height Fit */}
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} lg:col-span-2 flex flex-col justify-between`}>
          <div className={spotlightOverlay} />

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
                  <TrendUp size={22} weight="bold" />
                </div>
                <div>
                  <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                    Phễu Chuyển Đổi Sales (Pipeline Conversion Funnel)
                  </h3>
                  <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                    Tỷ lệ giữ chân (Retention) & Điểm rớt deal (Drop-off) qua 4 giai đoạn bán hàng
                  </p>
                </div>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 tabular-nums">
                Win Conversion: {winRatePct}%
              </span>
            </div>

            {/* 4 Stage Visual Funnel Flow with Connectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Stage 1: New Leads */}
              <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                isLight ? "bg-purple-50/70 border-purple-200/60" : "bg-purple-950/20 border-purple-800/40"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                      1 • Mới tiếp nhận
                    </span>
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 tabular-nums">100%</span>
                  </div>
                  <div className={`text-base font-black tabular-nums ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                    {totalLeads} Leads
                  </div>
                  <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums mb-2.5">
                    ${totalDealValue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="w-full h-1.5 rounded-full bg-purple-200/60 dark:bg-purple-950/50 overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500 w-full" />
                  </div>
                  <span className="text-[9px] font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
                    Lead đầu vào
                  </span>
                </div>
              </div>

              {/* Stage 2: Contacted */}
              <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                isLight ? "bg-blue-50/70 border-blue-200/60" : "bg-blue-950/20 border-blue-800/40"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                      2 • Đã liên hệ
                    </span>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tabular-nums">
                      {totalLeads > 0 ? Math.round(((totalLeads - leads.filter(l => l.status === 'new').length) / totalLeads) * 100) : 0}%
                    </span>
                  </div>
                  <div className={`text-base font-black tabular-nums ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                    {totalLeads - leads.filter(l => l.status === 'new').length} Leads
                  </div>
                  <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums mb-2.5">
                    ${leads.filter(l => l.status !== 'new').reduce((sum, l) => sum + (l.dealValue || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="w-full h-1.5 rounded-full bg-blue-200/60 dark:bg-blue-950/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${totalLeads > 0 ? Math.round(((totalLeads - leads.filter(l => l.status === 'new').length) / totalLeads) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                    ⬇ {100 - (totalLeads > 0 ? Math.round(((totalLeads - leads.filter(l => l.status === 'new').length) / totalLeads) * 100) : 0)}% Drop
                  </span>
                </div>
              </div>

              {/* Stage 3: Negotiation */}
              <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                isLight ? "bg-amber-50/70 border-amber-200/60" : "bg-amber-950/20 border-amber-800/40"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                      3 • Đang đàm phán
                    </span>
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 tabular-nums">
                      {totalLeads > 0 ? Math.round(((negotiationCount + closedWonCount) / totalLeads) * 100) : 0}%
                    </span>
                  </div>
                  <div className={`text-base font-black tabular-nums ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                    {negotiationCount} Deals
                  </div>
                  <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums mb-2.5">
                    ${negotiationValue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="w-full h-1.5 rounded-full bg-amber-200/60 dark:bg-amber-950/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${totalLeads > 0 ? Math.round(((negotiationCount + closedWonCount) / totalLeads) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">
                    🔥 Hợp đồng Active
                  </span>
                </div>
              </div>

              {/* Stage 4: Closed Won */}
              <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                isLight ? "bg-emerald-50/70 border-emerald-200/60" : "bg-emerald-950/20 border-emerald-800/40"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      4 • Closed Won
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {conversionRate}%
                    </span>
                  </div>
                  <div className={`text-base font-black tabular-nums ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                    {closedWonCount} Won
                  </div>
                  <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mb-2.5">
                    ${closedWonValue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="w-full h-1.5 rounded-full bg-emerald-200/60 dark:bg-emerald-950/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${conversionRate}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    🏆 Gross Cash Flow
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Transition & Conversion Velocity Metrics */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className={`p-2.5 rounded-xl border ${isLight ? "bg-purple-50/40 border-purple-100" : "bg-zinc-900/60 border-zinc-800/80"}`}>
                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400">1 ➔ 2 First Contact</div>
                <div className="text-xs font-black tabular-nums">70% Retention</div>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-zinc-400">Phản hồi: ~1.2d</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isLight ? "bg-amber-50/40 border-amber-100" : "bg-zinc-900/60 border-zinc-800/80"}`}>
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">2 ➔ 3 Negotiation</div>
                <div className="text-xs font-black tabular-nums">54% Qualified</div>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-zinc-400">Active: {negotiationCount} deals</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isLight ? "bg-emerald-50/40 border-emerald-100" : "bg-zinc-900/60 border-zinc-800/80"}`}>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">3 ➔ 4 Deal Closure</div>
                <div className="text-xs font-black tabular-nums">{conversionRate}% Win Rate</div>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-zinc-400">Chu kỳ: {avgCycleDays}d</span>
              </div>
            </div>
          </div>

          {/* Funnel Efficiency & Retention Insights Bar */}
          <div className={`mt-3 p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between gap-2 ${
            isLight ? "bg-slate-50/80 border-slate-200/70 text-slate-700" : "bg-zinc-950/80 border-zinc-800/80 text-zinc-300"
          }`}>
            <div className="flex items-center gap-2 truncate">
              <Sparkle size={15} className="text-amber-500 shrink-0" />
              <span className="truncate">
                Tỷ lệ chuyển đổi tổng phễu đạt <strong>{conversionRate}%</strong> từ <strong>{totalLeads} Leads</strong> ban đầu.
              </span>
            </div>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 tabular-nums">
              Thực thu: ${closedWonValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* BENTO CARD: Sales Representative Leaderboard (1 Col) */}
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} lg:col-span-1 flex flex-col justify-between`}>
          <div className={spotlightOverlay} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  <Trophy size={22} weight="bold" />
                </div>
                <div>
                  <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                    Sales Rep Leaderboard
                  </h3>
                  <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                    Closed-Won Revenue
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {sortedSalesReps.length} Reps
              </span>
            </div>

            <div className="space-y-2">
              {sortedSalesReps.slice(0, 4).map(([repName, stats], index) => {
                const maxRepValue = sortedSalesReps[0]?.[1]?.closedWonValue || 1;
                const barPct = Math.max(15, Math.round((stats.closedWonValue / maxRepValue) * 100));

                const initials = repName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const rankBadges = ["🥇", "🥈", "🥉"];

                return (
                  <div
                    key={repName}
                    className={`p-2.5 rounded-xl border transition-all duration-200 ${
                      isLight
                        ? "bg-slate-50/70 border-slate-200/70 hover:bg-white hover:border-amber-500/40"
                        : "bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/80 hover:border-amber-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-xs ${
                              index === 0
                                ? "bg-gradient-to-tr from-amber-500 to-orange-500"
                                : index === 1
                                ? "bg-gradient-to-tr from-slate-400 to-slate-600"
                                : index === 2
                                ? "bg-gradient-to-tr from-amber-700 to-amber-900"
                                : "bg-gradient-to-tr from-indigo-500 to-purple-600"
                            }`}
                          >
                            {initials}
                          </div>
                          {index < 3 && (
                            <span className="absolute -top-1.5 -right-1 text-[10px] drop-shadow-xs">
                              {rankBadges[index]}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className={`text-xs font-black tracking-tight ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                            {repName}
                          </h4>
                          <p className={`text-[10px] font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                            {stats.closedWonCount} Won ({stats.totalLeads} Leads)
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                          ${stats.closedWonValue.toLocaleString()}
                        </div>
                        <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded tabular-nums">
                          {stats.winRatePct}% Win
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          index === 0
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </motion.div>

      {/* ============================================================ */}
      {/* 🧩 TIER 3 (INSIGHTS & RISK ROW - EQUAL 1:1:1 RATIO): CHANNEL (1 COL) + SCORE (1 COL) + STALLED (1 COL) */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BENTO CARD 1/3: Channel Performance Multi-Gradient Donut Chart (1 Col) */}
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} lg:col-span-1`}>
          <div className={spotlightOverlay} />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <Compass size={20} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-sm tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Channel Performance
                </h3>
                <p className={`text-[11px] font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Multi-Gradient Donut Share
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 tabular-nums">
              Cycle: {avgCycleDays > 0 ? `${avgCycleDays}d` : 'N/A'}
            </span>
          </div>

          {/* Recharts Channel Donut Chart */}
          <div className="relative h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(sourceCounts).map(([src, d], idx) => {
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899"];
                    return { name: src, value: d.value, count: d.count, fill: colors[idx % colors.length] };
                  }).filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {Object.entries(sourceCounts).map((_, idx) => {
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899"];
                    return <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} stroke="transparent" />;
                  })}
                </Pie>
                <Tooltip content={<CustomDonutTooltip isLight={isLight} />} wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 tabular-nums">
                ${(totalDealValue / 1000).toFixed(0)}k
              </span>
              <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                CHANNEL TOTAL
              </span>
            </div>
          </div>

          {/* Channel Legend Badges */}
          <div className="w-full space-y-1 mt-1">
            {Object.entries(sourceCounts).slice(0, 3).map(([src, data], idx) => {
              const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500"];
              return (
                <div key={src} className="flex items-center justify-between text-[10px] font-extrabold">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]} shrink-0`} />
                    <span className={`truncate ${isLight ? "text-slate-800" : "text-zinc-200"}`}>{src}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                    ${(data.value / 1000).toFixed(0)}k ({data.count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENTO CARD 2/3: Lead Score Quality Donut (1 Col) */}
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} lg:col-span-1`}>
          <div className={spotlightOverlay} />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
                <ChartPieSlice size={20} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-sm tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Lead Score Quality
                </h3>
                <p className={`text-[11px] font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Donut Distribution
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20 tabular-nums">
              🔥 {hotCount} HOT
            </span>
          </div>

          <div className="relative h-36 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadScorePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={58}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leadScorePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomDonutTooltip isLight={isLight} />} wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-xl font-black tabular-nums tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                {avgLeadScore}
              </span>
              <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                AVG SCORE
              </span>
            </div>
          </div>

          <div className="w-full space-y-1 mt-1">
            <div className="flex items-center justify-between text-[11px] font-extrabold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className={isLight ? "text-slate-800" : "text-zinc-200"}>HOT (≥80)</span>
              </div>
              <span className="text-rose-600 dark:text-rose-400 tabular-nums">{hotCount} ({hotPct}%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-extrabold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className={isLight ? "text-slate-800" : "text-zinc-200"}>WARM (50-79)</span>
              </div>
              <span className="text-amber-600 dark:text-amber-400 tabular-nums">{warmCount} ({warmPct}%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-extrabold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className={isLight ? "text-slate-800" : "text-zinc-200"}>COLD (&lt;50)</span>
              </div>
              <span className="text-sky-600 dark:text-sky-400 tabular-nums">{coldCount} ({coldPct}%)</span>
            </div>
          </div>
        </div>

        {/* BENTO CARD 3/3: Stalled Deals Alert (1 Col) */}
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} lg:col-span-1 flex flex-col justify-between`}>
          <div className={spotlightOverlay} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                  <Warning size={20} weight="bold" />
                </div>
                <div>
                  <h3 className={`font-black text-sm tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                    Stalled Deals Alert
                  </h3>
                  <p className={`text-[11px] font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                    High-Value Risk Interventions
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRiskModal(true)}
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>{stalledDeals.length} Warnings</span>
                <CaretRight size={12} weight="bold" />
              </button>
            </div>

            <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
              {stalledDeals.length === 0 ? (
                <div className="p-3 text-center text-xs font-semibold text-slate-500">
                  🎉 Không có deal nào bị nghẽn!
                </div>
              ) : (
                stalledDeals.slice(0, 3).map((deal) => {
                  const created = deal.createdAt ? new Date(deal.createdAt).getTime() : Date.now();
                  const ageDays = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
                  const isTimeRisk = ageDays >= 14;
                  const isValueRisk = (deal.dealValue || 0) >= 30000;

                  return (
                    <div key={deal.id} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      isLight ? "bg-amber-50/40 border-amber-200/60" : "bg-amber-950/20 border-amber-800/40"
                    }`}>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className={`text-xs font-bold truncate ${isLight ? "text-slate-900" : "text-zinc-100"}`}>
                            {deal.company || deal.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[10px] font-semibold truncate ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                            {deal.assignedTo || "Chưa gán"}
                          </span>
                          {isTimeRisk && (
                            <span className="text-[9px] font-extrabold px-1 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                              ⚠️ &gt;14d
                            </span>
                          )}
                          {isValueRisk && (
                            <span className="text-[9px] font-extrabold px-1 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              💰 &gt;$30k
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 shrink-0 tabular-nums">
                        ${(deal.dealValue || 0).toLocaleString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className={`mt-2 pt-2 border-t text-[10px] font-bold flex items-center justify-between ${
            isLight ? "border-slate-200/60 text-slate-600" : "border-zinc-800 text-zinc-400"
          }`}>
            <button
              onClick={() => setShowRiskModal(true)}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-extrabold cursor-pointer"
            >
              <span>Xem tất cả {stalledDeals.length} Deal Rủi Ro</span>
              <CaretRight size={11} weight="bold" />
            </button>
            <span className="text-amber-600 dark:text-amber-400 font-black tabular-nums">
              ${stalledDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>

      </motion.div>

      {/* ============================================================ */}
      {/* 👑 TIER 4 (BOTTOM TIER - FULL WIDTH HERO BANNER): RECENT ACTIVITY & SYSTEM LOG */}
      {/* ============================================================ */}
      <motion.div variants={itemVariants} className="w-full">
        <div onMouseMove={handleMouseMove} className={`${bentoCardStyle} w-full`}>
          <div className={spotlightOverlay} />

          <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
                <Clock size={22} weight="bold" />
              </div>
              <div>
                <h3 className={`font-black text-base tracking-tight ${isLight ? "text-slate-950" : "text-zinc-50"}`}>
                  Recent Activity & System Audit Log
                </h3>
                <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  Real-time CRM interaction feed
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 tabular-nums">
              {auditLogs?.length || 0} Total Events
            </span>
          </div>

          {/* Audit Logs Horizontal/Vertical Grid Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {!auditLogs || auditLogs.length === 0 ? (
              <div className="col-span-full p-4 text-center text-xs font-semibold text-slate-400">
                Chưa có hoạt động CRM nào được ghi nhận.
              </div>
            ) : (
              auditLogs.slice(0, 6).map((log) => {
                const logDate = new Date(log.createdAt);
                const diffMinutes = Math.floor((Date.now() - logDate.getTime()) / (1000 * 60));
                let timeString = `${diffMinutes}m ago`;
                if (diffMinutes < 1) timeString = "⏱ Vừa xong";
                else if (diffMinutes < 60) timeString = `⏱ ${diffMinutes}m trước`;
                else timeString = `⏱ ${Math.floor(diffMinutes / 60)}h trước`;

                const actionStyles: Record<string, string> = {
                  lead_status_changed: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
                  user_added: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
                  user_deleted: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
                  permissions_saved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
                  hot_lead_detected: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
                };

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-colors ${
                      isLight ? "bg-slate-50/70 border-slate-200/70 hover:bg-white" : "bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase shrink-0 ${
                        actionStyles[log.action] || "bg-slate-500/15 text-slate-600 border-slate-500/20"
                      }`}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                        {timeString}
                      </span>
                    </div>

                    <p className={`text-xs font-semibold line-clamp-2 ${isLight ? "text-slate-800" : "text-zinc-200"}`}>
                      {log.description}
                    </p>

                    <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 pt-1.5 border-t border-slate-200/50 dark:border-zinc-800">
                      By: <strong className={isLight ? "text-slate-900" : "text-zinc-100"}>{log.performedBy || "System"}</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* ⚠️ STALLED DEALS RISK MANAGEMENT MODAL */}
      {/* ============================================================ */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] min-h-0 ${
            isLight ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
          }`}>
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between bg-amber-500/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <ShieldWarning size={22} weight="bold" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                    Danh Sách {stalledDeals.length} Deal Rủi Ro Cần Can Thiệp Khẩn Cấp
                  </h2>
                  <p className="text-xs font-semibold opacity-70">
                    Tiêu chí: Deal ở trạng thái Đang liên hệ / Đàm phán bị trễ &gt;14 ngày HOẶC Giá trị deal &ge; $30,000
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRiskModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-zinc-800 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Body - Deal Risk Table with touch-pan-y, min-h-0, overscroll-contain & visible scrollbar */}
            <div className="p-5 overflow-y-auto flex-1 min-h-0 space-y-3 overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-500/60 dark:[&::-webkit-scrollbar-thumb]:bg-amber-500/60 hover:[&::-webkit-scrollbar-thumb]:!bg-amber-500 [&::-webkit-scrollbar-track]:bg-transparent">
              <div className="grid grid-cols-1 gap-2.5">
                {stalledDeals.map((deal) => {
                  const created = deal.createdAt ? new Date(deal.createdAt).getTime() : Date.now();
                  const ageDays = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
                  const isTimeRisk = ageDays >= 14;
                  const isValueRisk = (deal.dealValue || 0) >= 30000;

                  return (
                    <div
                      key={deal.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                        isLight ? "bg-slate-50/80 border-slate-200/80 hover:bg-amber-50/30" : "bg-zinc-950/60 border-zinc-800 hover:bg-zinc-800/40"
                      }`}
                    >
                      <div className="flex-1 truncate">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-extrabold text-sm truncate">{deal.company || deal.name}</h3>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            {deal.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                          <span>Phụ trách: <strong className={isLight ? "text-slate-800" : "text-zinc-200"}>{deal.assignedTo || "Chưa gán"}</strong></span>
                          <span>Kênh: <strong>{deal.source}</strong></span>
                          <span>Tồn đọng: <strong className="text-rose-600 dark:text-rose-400 tabular-nums">{ageDays} ngày</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-black text-amber-600 dark:text-amber-400 tabular-nums">
                            ${(deal.dealValue || 0).toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            {isTimeRisk && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                                ⚠️ Trễ {ageDays}d
                              </span>
                            )}
                            {isValueRisk && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                💰 Deal lớn &ge; $30k
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200/80 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/50 shrink-0">
              <div className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Tổng giá trị deal rủi ro: <strong className="text-amber-600 dark:text-amber-400 tabular-nums">${stalledDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0).toLocaleString()}</strong>
              </div>
              <button
                onClick={() => setShowRiskModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
              >
                Đóng Cảnh Báo
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
