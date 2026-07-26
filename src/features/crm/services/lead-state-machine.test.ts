import assert from "node:assert";
import { test, describe } from "node:test";
import { validateLeadStatusTransition } from "./lead-state-machine";

describe("Lead State Machine Unit Tests (Data-Driven Workflow)", () => {

  test("Sales Rep can transition along standard sales funnel path (new -> contacted -> in_negotiation -> closed_won)", () => {
    // new -> contacted
    const step1 = validateLeadStatusTransition("new", "contacted", "sales_rep");
    assert.strictEqual(step1.allowed, true);

    // contacted -> in_negotiation
    const step2 = validateLeadStatusTransition("contacted", "in_negotiation", "sales_rep");
    assert.strictEqual(step2.allowed, true);

    // in_negotiation -> closed_won
    const step3 = validateLeadStatusTransition("in_negotiation", "closed_won", "sales_rep");
    assert.strictEqual(step3.allowed, true);
  });

  test("Sales Rep CANNOT jump directly from new -> closed_won", () => {
    const res = validateLeadStatusTransition("new", "closed_won", "sales_rep");
    assert.strictEqual(res.allowed, false);
    assert.ok(res.reason?.includes("Không thể chuyển trực tiếp"));
  });

  test("Sales Rep CANNOT re-open a locked deal (closed_won or closed_lost)", () => {
    const resWon = validateLeadStatusTransition("closed_won", "new", "sales_rep");
    assert.strictEqual(resWon.allowed, false);
    assert.ok(resWon.reason?.includes("Chỉ Quản lý hoặc Super Admin"));

    const resLost = validateLeadStatusTransition("closed_lost", "contacted", "sales_rep");
    assert.strictEqual(resLost.allowed, false);
    assert.ok(resLost.reason?.includes("Chỉ Quản lý hoặc Super Admin"));
  });

  test("CRM Manager & Super Admin CAN re-open locked deals", () => {
    const managerRes = validateLeadStatusTransition("closed_won", "in_negotiation", "crm_manager");
    assert.strictEqual(managerRes.allowed, true);

    const superAdminRes = validateLeadStatusTransition("closed_lost", "new", "super_admin");
    assert.strictEqual(superAdminRes.allowed, true);
  });

  test("Same status transition is always allowed", () => {
    const res = validateLeadStatusTransition("contacted", "contacted", "sales_rep");
    assert.strictEqual(res.allowed, true);
  });

  test("should reorder items within Kanban column array correctly", () => {
    const leads = [
      { id: "lead-1", name: "Lead 1" },
      { id: "lead-2", name: "Lead 2" },
      { id: "lead-3", name: "Lead 3" },
    ];

    const oldIndex = leads.findIndex((i) => i.id === "lead-3");
    const newIndex = leads.findIndex((i) => i.id === "lead-1");
    const reordered = [...leads];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    assert.strictEqual(reordered[0].id, "lead-3");
    assert.strictEqual(reordered[1].id, "lead-1");
    assert.strictEqual(reordered[2].id, "lead-2");
  });
});
