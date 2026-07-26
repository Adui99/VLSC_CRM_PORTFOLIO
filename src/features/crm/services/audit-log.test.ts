import assert from "node:assert";
import { test, describe } from "node:test";

export function pruneAuditLogs<T>(logs: T[], maxLimit = 1000): T[] {
  if (logs.length <= maxLimit) return logs;
  return logs.slice(0, maxLimit);
}

describe("Audit Log Ring Buffer & Auto-Pruning Tests", () => {
  test("should maintain max limit of 1000 logs when capacity exceeded", () => {
    const mockLogs = Array.from({ length: 1200 }, (_, i) => ({
      id: `log-${i}`,
      action: "lead_status_changed",
      description: `Action ${i}`,
      performedBy: "admin@company.com",
      createdAt: new Date().toISOString(),
    }));

    const pruned = pruneAuditLogs(mockLogs, 1000);
    assert.strictEqual(pruned.length, 1000);
    assert.strictEqual(pruned[0].id, "log-0");
  });

  test("should keep all logs when total count is under max limit", () => {
    const mockLogs = Array.from({ length: 50 }, (_, i) => ({
      id: `log-${i}`,
      action: "hot_lead_detected",
      description: `Action ${i}`,
      performedBy: "admin@company.com",
      createdAt: new Date().toISOString(),
    }));

    const pruned = pruneAuditLogs(mockLogs, 1000);
    assert.strictEqual(pruned.length, 50);
  });
});
