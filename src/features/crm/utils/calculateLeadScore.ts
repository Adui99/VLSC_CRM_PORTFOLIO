import { EmailType, ScoreCategory } from "@/features/crm/types/crm";

export interface LeadScoreInput {
  name: string;
  email: string;
  emailType?: EmailType;
  phone?: string;
  company?: string;
  companySize?: string;
  role?: string;
  services?: string[];
  message?: string;
}

export interface LeadScoreResult {
  score: number;
  category: ScoreCategory;
}

export const WORK_SERVICES_OPTIONS = [
  "Thiết kế Website & WebGL",
  "Thiết kế Landing Page",
  "Redesign & Tối ưu UI/UX",
  "Bảo trì & Nâng cấp Hệ thống",
  "Tích hợp CRM & Automation",
];

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.com.vn",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "protonmail.com",
  "yandex.com",
  "mail.com",
]);

export function isCorporateEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return !FREE_EMAIL_DOMAINS.has(domain);
}

const URGENT_KEYWORDS = [
  "gấp", "gap", "triển khai", "trien khai", "báo giá", "bao gia",
  "hệ thống", "he thong", "demo", "tư vấn", "tu van", "crm",
  "budget", "bảng giá", "bang gia", "urgent", "asap", "quote", "price"
];

export function calculateLeadScore(input: LeadScoreInput): LeadScoreResult {
  let score = 0;

  // 1. Profile / Basic Info (Name)
  if (input.name && input.name.trim().length > 0) {
    score += 5;
  }

  // 2. Email Fit & Email Type Selection
  const isCorpDomain = isCorporateEmail(input.email);
  if (input.emailType === "company" && isCorpDomain) {
    score += 15;
  } else if (input.emailType === "company" || isCorpDomain) {
    score += 10;
  } else {
    score += 5;
  }

  // 3. Phone Contactability
  if (input.phone && input.phone.trim().length >= 8) {
    score += 15;
  }

  // 4. Company Fit (B2B Priority)
  const hasCompany = Boolean(input.company && input.company.trim().length > 0);
  if (hasCompany) {
    score += 15;
  }

  // 5. Company Size Fit
  if (input.companySize === "50+") {
    score += 15;
  } else if (input.companySize === "11-50") {
    score += 10;
  } else if (input.companySize === "1-10") {
    score += 5;
  }

  // 6. Role / Decision Maker
  if (input.role) {
    const roleLower = input.role.toLowerCase();
    if (roleLower.includes("ceo") || roleLower.includes("director") || roleLower.includes("founder") || roleLower.includes("giám đốc") || roleLower.includes("owner")) {
      score += 20;
    } else if (roleLower.includes("manager") || roleLower.includes("leader") || roleLower.includes("trưởng phòng")) {
      score += 15;
    } else {
      score += 5;
    }
  }

  // 7. Multi-select Services (Work Scope) Bonus
  if (Array.isArray(input.services) && input.services.length > 0) {
    const count = input.services.length;
    if (count >= 4) {
      score += 15;
    } else if (count >= 2) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // 8. Message Intent & Urgency
  if (input.message) {
    const msgLower = input.message.toLowerCase();
    const hasUrgentKeyword = URGENT_KEYWORDS.some((kw) => msgLower.includes(kw));
    if (hasUrgentKeyword) {
      score += 15;
    } else if (msgLower.trim().length > 15) {
      score += 5;
    }
  }

  // Cap at 100
  score = Math.min(100, score);

  // Safety rule: Personal email without company name cannot be HOT (capped at 75)
  if (!isCorpDomain && input.emailType === "personal" && !hasCompany && score >= 80) {
    score = 75;
  }

  let category: ScoreCategory = "cold";
  if (score >= 80) {
    category = "hot";
  } else if (score >= 50) {
    category = "warm";
  }

  return { score, category };
}
