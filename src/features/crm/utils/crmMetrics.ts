import { Lead } from "../types/crm";

export interface CrmMetrics {
  totalLeads: number;
  totalDealValue: number;
  closedWonCount: number;
  closedWonValue: number;
  conversionRate: number;
  targetMonthlyRevenue: number;
  targetProgress: number;
  avgDealSize: number;
  
  // Negotiation stage
  negotiationCount: number;
  negotiationValue: number;

  // Lead score distribution
  hotCount: number;
  warmCount: number;
  coldCount: number;
  hotPct: number;
  warmPct: number;
  coldPct: number;
  hotValue: number;
  warmValue: number;
  coldValue: number;
  avgLeadScore: number;

  // Digital conversion
  digitalTotalCount: number;
  digitalClosedWonCount: number;
  digitalConversionRate: number;

  // Profit cash flow
  realizedNetProfit: number;
  totalPipelineProfitPotential: number;

  // Additional Executive Metrics
  winRatePct: number;
  avgCycleDays: number;
  stalledDeals: Lead[];
  salesRepStats: Record<string, { totalLeads: number; closedWonCount: number; closedWonValue: number; totalValue: number; winRatePct: number }>;

  // Service Scope Breakdown
  serviceStats: Record<string, { count: number; value: number }>;
  maxServiceValue: number;
}

export const KNOWN_SERVICES = [
  "Thiết kế Website & WebGL",
  "Thiết kế Landing Page",
  "Redesign & Tối ưu UI/UX",
  "Bảo trì & Nâng cấp Hệ thống",
  "Tích hợp CRM & Automation",
];

export function getLeadServices(lead: Lead): string[] {
  if (Array.isArray(lead.services) && lead.services.length > 0) {
    return lead.services;
  }

  // Smart fallback matching based on message, source, or lead ID/name text
  const text = `${lead.source || ""} ${lead.message || ""} ${lead.name || ""} ${lead.company || ""}`.toLowerCase();
  const matched: string[] = [];

  if (text.includes("landing") || text.includes("page")) {
    matched.push("Thiết kế Landing Page");
  }
  if (text.includes("web") || text.includes("site") || text.includes("3d") || text.includes("gl")) {
    matched.push("Thiết kế Website & WebGL");
  }
  if (text.includes("ui") || text.includes("ux") || text.includes("design") || text.includes("redesign")) {
    matched.push("Redesign & Tối ưu UI/UX");
  }
  if (text.includes("crm") || text.includes("auto") || text.includes("tích hợp") || text.includes("modal")) {
    matched.push("Tích hợp CRM & Automation");
  }
  if (text.includes("bảo trì") || text.includes("nâng cấp") || text.includes("hệ thống") || text.includes("system") || text.includes("support")) {
    matched.push("Bảo trì & Nâng cấp Hệ thống");
  }

  // Deterministic fallback based on lead ID hash if no keywords matched
  if (matched.length === 0) {
    const hash = (lead.id || lead.name || "lead").split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    matched.push(KNOWN_SERVICES[hash % KNOWN_SERVICES.length]);
  }

  return Array.from(new Set(matched));
}

export function calculateCrmMetrics(
  leads: Lead[],
  targetMonthlyRevenue = 250000,
  stalledDaysThreshold = 14,
  stalledValueThreshold = 30000
): CrmMetrics {
  const now = Date.now();
  const totalLeads = leads.length;
  const totalDealValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const closedWonLeads = leads.filter((l) => l.status === "closed_won");
  const closedWonCount = closedWonLeads.length;
  const closedWonValue = closedWonLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  const conversionRate = totalLeads > 0 ? Math.round((closedWonCount / totalLeads) * 100) : 0;
  const winRatePct = conversionRate;
  const targetProgress = Math.min(100, Math.round((totalDealValue / targetMonthlyRevenue) * 100));
  const avgDealSize = totalLeads > 0 ? Math.round(totalDealValue / totalLeads) : 0;

  // Average sales cycle days
  let avgCycleDays = 0;
  if (closedWonLeads.length > 0) {
    const totalDays = closedWonLeads.reduce((sum, lead) => {
      const created = lead.createdAt ? new Date(lead.createdAt).getTime() : now;
      const diffDays = Math.max(1, Math.round((now - created) / (1000 * 60 * 60 * 24)));
      return sum + diffDays;
    }, 0);
    avgCycleDays = Math.round((totalDays / closedWonLeads.length) * 10) / 10;
  }

  // Stalled deals detection (customizable days in negotiation or deal value threshold)
  const stalledDeals = leads.filter((l) => {
    if (l.status !== "in_negotiation" && l.status !== "contacted") return false;
    const created = l.createdAt ? new Date(l.createdAt).getTime() : now;
    const ageDays = (now - created) / (1000 * 60 * 60 * 24);
    return ageDays >= stalledDaysThreshold || (l.dealValue || 0) >= stalledValueThreshold;
  });

  // Sales Rep performance aggregation
  const salesRepStats: Record<string, { totalLeads: number; closedWonCount: number; closedWonValue: number; totalValue: number; winRatePct: number }> = {};
  leads.forEach((l) => {
    const repName = l.assignedTo || "Chưa phân công";
    if (!salesRepStats[repName]) {
      salesRepStats[repName] = { totalLeads: 0, closedWonCount: 0, closedWonValue: 0, totalValue: 0, winRatePct: 0 };
    }
    salesRepStats[repName].totalLeads += 1;
    salesRepStats[repName].totalValue += l.dealValue || 0;
    if (l.status === "closed_won") {
      salesRepStats[repName].closedWonCount += 1;
      salesRepStats[repName].closedWonValue += l.dealValue || 0;
    }
  });

  Object.keys(salesRepStats).forEach((rep) => {
    const stats = salesRepStats[rep];
    stats.winRatePct = stats.totalLeads > 0 ? Math.round((stats.closedWonCount / stats.totalLeads) * 100) : 0;
  });

  // Negotiation stage
  const negotiationLeads = leads.filter((l) => l.status === "in_negotiation" || l.status === "contacted");
  const negotiationCount = negotiationLeads.length;
  const negotiationValue = negotiationLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  // Lead Score Distribution
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

  // Digital Conversion Rate
  const digitalLeads = leads.filter((l) =>
    l.source?.toLowerCase().includes("landing") ||
    l.source?.toLowerCase().includes("website") ||
    l.source?.toLowerCase().includes("modal") ||
    l.source?.toLowerCase().includes("online")
  );
  const digitalTotalCount = digitalLeads.length;
  const digitalClosedWonLeads = digitalLeads.filter((l) => l.status === "closed_won");
  const digitalClosedWonCount = digitalClosedWonLeads.length;
  const digitalConversionRate = digitalTotalCount > 0 ? Math.round((digitalClosedWonCount / digitalTotalCount) * 100) : 0;

  // Realized Cash Flow (Gross Revenue from Closed Won) & 35% Profit Margin
  const profitMarginPercent = 35;
  const realizedNetProfit = Math.round((closedWonValue * profitMarginPercent) / 100);
  const totalPipelineProfitPotential = Math.round((totalDealValue * profitMarginPercent) / 100);

  // Service Scope Breakdown calculation
  const serviceStats: Record<string, { count: number; value: number }> = {};
  KNOWN_SERVICES.forEach((srv) => {
    serviceStats[srv] = { count: 0, value: 0 };
  });

  leads.forEach((lead) => {
    const srvList = getLeadServices(lead);
    srvList.forEach((srv) => {
      if (!serviceStats[srv]) {
        serviceStats[srv] = { count: 0, value: 0 };
      }
      serviceStats[srv].count += 1;
      serviceStats[srv].value += lead.dealValue || 0;
    });
  });

  const maxServiceValue = Math.max(...Object.values(serviceStats).map((s) => s.value), 1);

  return {
    totalLeads,
    totalDealValue,
    closedWonCount,
    closedWonValue,
    conversionRate,
    winRatePct,
    avgCycleDays,
    stalledDeals,
    salesRepStats,
    targetMonthlyRevenue,
    targetProgress,
    avgDealSize,
    negotiationCount,
    negotiationValue,
    hotCount,
    warmCount,
    coldCount,
    hotPct,
    warmPct,
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
  };
}
