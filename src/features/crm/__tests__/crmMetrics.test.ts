import assert from "node:assert/strict";
import { test, describe } from "node:test";
import { calculateCrmMetrics, getLeadServices } from "../utils/crmMetrics";
import { Lead } from "../types/crm";

describe("CRM Super Admin Executive Analytics Data Synchronization", () => {
  const mockLeads: Lead[] = [
    {
      id: "lead-1",
      name: "Acme Tech",
      email: "acme@tech.com",
      phone: "0901234567",
      source: "Landing Page Form",
      status: "closed_won",
      dealValue: 100000,
      score: 85,
      scoreCategory: "hot",
      createdAt: "2026-08-01",
      services: ["Thiết kế Website & WebGL"],
      notes: [],
    },
    {
      id: "lead-2",
      name: "Global Corp",
      email: "global@corp.com",
      phone: "0907654321",
      source: "Website Modal",
      status: "in_negotiation",
      dealValue: 50000,
      score: 60,
      scoreCategory: "warm",
      createdAt: "2026-08-02",
      message: "Tôi muốn thiết kế landing page và UI/UX",
      notes: [],
    },
    {
      id: "lead-3",
      name: "Cold Lead Inc",
      email: "cold@inc.com",
      phone: "0909998888",
      source: "Direct Referral",
      status: "new",
      dealValue: 10000,
      score: 30,
      scoreCategory: "cold",
      createdAt: "2026-08-03",
      notes: [],
    },
  ];

  test("calculates total pipeline deal value and total leads accurately", () => {
    const metrics = calculateCrmMetrics(mockLeads);
    assert.equal(metrics.totalLeads, 3);
    assert.equal(metrics.totalDealValue, 160000);
  });

  test("calculates closed won revenue and conversion rate correctly", () => {
    const metrics = calculateCrmMetrics(mockLeads);
    assert.equal(metrics.closedWonCount, 1);
    assert.equal(metrics.closedWonValue, 100000);
    assert.equal(metrics.conversionRate, 33); // 1 / 3 * 100 = 33%
  });

  test("calculates monthly target progress ($250,000 target)", () => {
    const metrics = calculateCrmMetrics(mockLeads);
    // 160,000 / 250,000 = 64%
    assert.equal(metrics.targetProgress, 64);
  });

  test("calculates lead score distribution (Hot, Warm, Cold)", () => {
    const metrics = calculateCrmMetrics(mockLeads);
    assert.equal(metrics.hotCount, 1);
    assert.equal(metrics.warmCount, 1);
    assert.equal(metrics.coldCount, 1);
    assert.equal(metrics.hotPct, 33);
    assert.equal(metrics.warmPct, 33);
    assert.equal(metrics.coldPct, 33);
    assert.equal(metrics.avgLeadScore, 58); // (85 + 60 + 30) / 3 = 58.33 -> 58
  });

  test("calculates digital conversion rate and 35% profit cash flow accurately", () => {
    const metrics = calculateCrmMetrics(mockLeads);
    assert.equal(metrics.digitalTotalCount, 2);
    assert.equal(metrics.digitalClosedWonCount, 1);
    assert.equal(metrics.digitalConversionRate, 50);

    assert.equal(metrics.realizedNetProfit, 35000);
    assert.equal(metrics.totalPipelineProfitPotential, 56000);
  });

  test("calculates Service Scope Breakdown with smart fallback matching", () => {
    const srv1 = getLeadServices(mockLeads[0]);
    assert.deepEqual(srv1, ["Thiết kế Website & WebGL"]);

    const srv2 = getLeadServices(mockLeads[1]);
    assert.ok(srv2.includes("Thiết kế Landing Page"));
    assert.ok(srv2.includes("Redesign & Tối ưu UI/UX"));

    const metrics = calculateCrmMetrics(mockLeads);
    assert.ok(metrics.serviceStats["Thiết kế Website & WebGL"].count >= 1);
    assert.ok(metrics.serviceStats["Thiết kế Website & WebGL"].value >= 100000);
    assert.ok(metrics.maxServiceValue >= 100000);
  });
});
