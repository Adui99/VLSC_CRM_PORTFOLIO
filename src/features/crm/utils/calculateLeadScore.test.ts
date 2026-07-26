import assert from "node:assert";
import { test, describe } from "node:test";
import { calculateLeadScore, isCorporateEmail } from "./calculateLeadScore";

describe("calculateLeadScore Unit Tests", () => {
  test("should identify corporate email vs free email providers", () => {
    assert.strictEqual(isCorporateEmail("alex@acme-corp.com"), true);
    assert.strictEqual(isCorporateEmail("john@gmail.com"), false);
    assert.strictEqual(isCorporateEmail("user@yahoo.com"), false);
    assert.strictEqual(isCorporateEmail("ceo@tech-innovations.io"), true);
  });

  test("should score high B2B Decision Maker with corporate email & multi-services as HOT (>=80)", () => {
    const input = {
      name: "Alex Rivera",
      email: "alex@enterprise-corp.com",
      emailType: "company" as const,
      phone: "0901234567",
      company: "Enterprise Corp",
      companySize: "50+",
      role: "CEO/Director",
      services: ["Thiết kế Website & WebGL", "Tích hợp CRM & Automation", "Redesign & Tối ưu UI/UX"],
      message: "Cần tư vấn triển khai hệ thống CRM gấp cho doanh nghiệp",
    };

    const result = calculateLeadScore(input);
    assert.ok(result.score >= 80, `Expected score >= 80, got ${result.score}`);
    assert.strictEqual(result.category, "hot");
  });

  test("should award service bonus points when multiple works are selected", () => {
    const baseInput = {
      name: "Tran Van C",
      email: "tran@company.vn",
      emailType: "company" as const,
      phone: "0912345678",
      company: "Tran Co",
    };

    const result1Service = calculateLeadScore({ ...baseInput, services: ["Thiết kế Landing Page"] });
    const result3Services = calculateLeadScore({ 
      ...baseInput, 
      services: ["Thiết kế Website & WebGL", "Thiết kế Landing Page", "Bảo trì & Nâng cấp"] 
    });

    assert.ok(result3Services.score > result1Service.score, "Expected 3 services score to be higher than 1 service score");
  });

  test("should cap Gmail lead without full company details to COLD or WARM (<80)", () => {
    const input = {
      name: "Nguyen Van B",
      email: "testuser@gmail.com",
      emailType: "personal" as const,
      phone: "0988888888",
      company: "",
      message: "Xin chào",
    };

    const result = calculateLeadScore(input);
    assert.ok(result.score < 80, `Expected score < 80, got ${result.score}`);
    assert.notStrictEqual(result.category, "hot");
  });
});
