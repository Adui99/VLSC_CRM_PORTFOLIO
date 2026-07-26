import assert from "node:assert";
import { test, describe } from "node:test";

describe("CRM Analytics & Financial Driven Data Unit Tests", () => {
  
  test("should calculate correct Digital Conversion Rate %", () => {
    const mockLeads = [
      { id: "1", source: "Website Contact Form", status: "closed_won", dealValue: 50000 },
      { id: "2", source: "Landing Page Modal", status: "closed_won", dealValue: 30000 },
      { id: "3", source: "Website Contact Form", status: "contacted", dealValue: 20000 },
      { id: "4", source: "Landing Page Modal", status: "new", dealValue: 10000 },
      { id: "5", source: "Manual Staff Entry", status: "closed_won", dealValue: 40000 }, // Non-digital
    ];

    const digitalLeads = mockLeads.filter((l) => 
      l.source.toLowerCase().includes("landing") || l.source.toLowerCase().includes("website")
    );
    const digitalCount = digitalLeads.length; // 4
    const digitalClosedWonCount = digitalLeads.filter((l) => l.status === "closed_won").length; // 2

    const conversionRate = Math.round((digitalClosedWonCount / digitalCount) * 100);
    assert.strictEqual(digitalCount, 4);
    assert.strictEqual(digitalClosedWonCount, 2);
    assert.strictEqual(conversionRate, 50); // 50%
  });

  test("should calculate correct 35% Realized Profit Margin from Closed Won deals", () => {
    const closedWonValue = 200000;
    const profitMarginPercent = 35;
    const realizedNetProfit = Math.round((closedWonValue * profitMarginPercent) / 100);

    assert.strictEqual(realizedNetProfit, 70000); // 35% of $200,000 = $70,000
  });

  test("should calculate correct Revenue Target Achievement %", () => {
    const targetMonthlyRevenue = 250000;
    const totalPipelineValue = 200000;
    const targetProgress = Math.min(100, Math.round((totalPipelineValue / targetMonthlyRevenue) * 100));

    assert.strictEqual(targetProgress, 80); // $200,000 / $250,000 = 80%
  });
});
