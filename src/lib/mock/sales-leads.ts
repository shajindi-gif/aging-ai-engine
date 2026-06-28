import type { Lead } from "@/lib/types";

const lTypes: Lead["leadType"][] = ["policy_scan","web_crawl","referral","exhibition","cold_call"];
const fStatuses: Lead["followUpStatus"][] = ["new","contacted","qualified","proposal","negotiation","won","lost"];
const products = ["陪诊护理CRM","政策数据库订阅","销售线索库","养老SaaS平台","智慧养老解决方案","适老化改造方案","AI Agent工作台","机构运营管理"];
const reasons = ["官网浏览过政策页面","近期搜索过智慧养老","老客户推荐","展会交换名片","行业数据库匹配","电话沟通有意向","政府采购项目","养老机构联盟推荐"];

export const mockLeads: Lead[] = Array.from({ length: 80 }, (_, i) => ({
  id: `LD-${String(i + 1).padStart(3, "0")}`,
  institutionId: `INS-${String((i % 80) + 1).padStart(3, "0")}`,
  leadType: lTypes[i % 5],
  score: 20 + ((i * 11 + 5) % 80),
  reason: reasons[i % reasons.length],
  suggestedProduct: products[i % products.length],
  followUpStatus: fStatuses[i % 7],
  createdAt: `2025-${String((i % 6) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T08:00:00Z`,
  updatedAt: `2025-${String((i % 6) + 1).padStart(2, "0")}-${String(Math.min((i % 28) + 5, 28)).padStart(2, "0")}T10:00:00Z`,
}));
