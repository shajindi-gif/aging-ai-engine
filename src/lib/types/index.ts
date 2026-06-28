// ═══════════════════════════════════════════════
// 衍策银龄 AI — 统一数据模型 v2
// Aging AI Engine — 18 Entities
// ═══════════════════════════════════════════════

// ─── 1. Organization ────────────────────────
export interface Organization {
  id: string;
  name: string;
  type: "nursing_home" | "community_station" | "care_company" | "hospital" | "government" | "enterprise";
  region: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  subscriptionPlan: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 2. User ────────────────────────────────
export interface User {
  id: string;
  organizationId: string;
  name: string;
  role: "admin" | "operator" | "caregiver" | "family" | "viewer";
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 3. Elder ───────────────────────────────
export interface Elder {
  id: string;
  organizationId: string;
  name: string;
  gender: "male" | "female";
  birthYear: number;
  age: number;
  region: string;
  address: string;
  livingStatus: "alone" | "with_spouse" | "with_children" | "institution";
  careLevel: "independent" | "semi_dependent" | "dependent" | "critical";
  chronicDiseases: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContact?: { name: string; phone: string; relationship: string };
  phone?: string;
  familyMemberIds: string[];
  consentStatus: "granted" | "pending" | "revoked";
  createdAt: string;
  updatedAt: string;
}

// ─── 4. FamilyMember ────────────────────────
export interface FamilyMember {
  id: string;
  elderId: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  city: string;
  notificationPreference: "sms" | "wechat" | "app" | "none";
  createdAt: string;
  updatedAt: string;
}

// ─── 5. CareProvider ────────────────────────
export interface CareProvider {
  id: string;
  organizationId: string;
  name: string;
  role: "escort" | "nurse" | "rehab" | "companion" | "manager";
  skillTags: string[];
  phone: string;
  availabilityStatus: "available" | "busy" | "off_duty";
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// ─── 6. CareOrder ───────────────────────────
export interface CareOrder {
  id: string;
  organizationId: string;
  elderId: string;
  careProviderId: string;
  serviceType: "escort" | "nursing" | "rehabilitation" | "companion" | "bathing" | "meal" | "cleaning" | "medication_reminder" | "followup" | "post_surgery";
  type?: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  scheduledStartAt: string;
  scheduledEndAt: string;
  scheduledAt?: string;
  price: number;
  paymentStatus: "unpaid" | "paid" | "refunded";
  familyNotificationStatus: "pending" | "sent" | "read";
  familyNotified?: boolean;
  riskEvents?: any[];
  caregiverName?: string;
  location?: string;
  notes?: string;
  orderNo?: string;
  elderlyName?: string;
  elderlyId?: string;
  completedAt?: string;
  serviceReport?: any;
  createdAt: string;
  updatedAt: string;
}

// ─── 7. CareRecord ──────────────────────────
export interface CareRecord {
  id: string;
  careOrderId: string;
  elderId: string;
  careProviderId: string;
  recordType: "vital_check" | "medication" | "meal" | "bathing" | "exercise" | "companionship" | "transport" | "cleaning" | "observation";
  content: string;
  riskLevel: "none" | "low" | "medium" | "high";
  familyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── 8. MedicalVisit ────────────────────────
export interface MedicalVisit {
  id: string;
  elderId: string;
  hospitalName: string;
  departmentName: string;
  doctorName: string;
  visitDate: string;
  diagnosisText: string;
  prescriptionText: string;
  examItems: string[];
  followUpDate: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 9. MedicationReminder ──────────────────
export interface MedicationReminder {
  id: string;
  elderId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  reminderTime: string[];
  status: "active" | "paused" | "completed";
  createdAt: string;
  updatedAt: string;
}

// ─── 10. ChronicMetric ──────────────────────
export interface ChronicMetric {
  id: string;
  elderId: string;
  metricType: "blood_pressure" | "blood_sugar" | "heart_rate" | "weight" | "oxygen" | "temperature";
  value: number;
  unit: string;
  measuredAt: string;
  abnormalFlag: boolean;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 11. Policy ─────────────────────────────
export interface Policy {
  id: string;
  title: string;
  region: string;
  department: string;
  level: "national" | "provincial" | "municipal" | "district";
  policyType: "subsidy" | "insurance" | "service" | "housing" | "medical" | "training" | "smart_aging";
  subsidyType: "cash" | "service" | "equipment" | "training" | "operation";
  category?: string;
  province?: string;
  city?: string;
  eligibility?: string[];
  benefits?: string;
  requiredDocuments?: string[];
  applicationProcess?: string[];
  applicationUrl?: string;
  contactPhone?: string;
  targetAudience: string;
  eligibilityText: string;
  materialsText: string;
  processText: string;
  sourceUrl: string;
  publishDate: string;
  effectiveDate: string;
  expireDate: string;
  summary: string;
  tags: string[];
  status: "active" | "expired" | "upcoming";
  createdAt: string;
  updatedAt: string;
}

// ─── 12. PolicyEligibilityRule ──────────────
export interface PolicyEligibilityRule {
  id: string;
  policyId: string;
  ruleType: "age" | "income" | "disability" | "living_status" | "household";
  field: string;
  operator: "gte" | "lte" | "eq" | "in" | "not_in";
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 13. SubsidyApplication ─────────────────
export interface SubsidyApplication {
  id: string;
  organizationId: string;
  elderId: string;
  policyId: string;
  applicantType: "self" | "family" | "institution" | "community";
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  matchedScore: number;
  missingMaterials: string[];
  nextSteps: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── 14. Institution ────────────────────────
export interface Institution {
  id: string;
  name: string;
  region: string;
  address: string;
  institutionType: "nursing_home" | "nursing_facility" | "rehab_center" | "community_station" | "day_care" | "escort_company" | "home_care_team" | "renovation_vendor";
  bedCount: number;
  serviceTags: string[];
  operatorName: string;
  contactName: string;
  contactPhone: string;
  sourceUrl: string;
  digitalMaturityScore: number;
  digitalMaturity?: any;
  purchaseIntentScore: number;
  beds?: number;
  occupancyRate?: number;
  priceRange?: any;
  services?: string[];
  rating?: number;
  licenseNo?: string;
  establishedYear?: number;
  website?: string;
  district?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 15. Lead ───────────────────────────────
export interface Lead {
  id: string;
  institutionId: string;
  leadType: "policy_scan" | "web_crawl" | "referral" | "exhibition" | "cold_call";
  score: number;
  reason: string;
  suggestedProduct: string;
  followUpStatus: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  status?: string;
  priority?: string;
  estimatedValue?: number;
  institutionName?: string;
  contactName?: string;
  contactPhone?: string;
  contactRole?: string;
  productInterest?: string[];
  notes?: string;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  assignedTo?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 16. AgentTask ──────────────────────────
export interface AgentTask {
  id: string;
  organizationId: string;
  agentType: "policy_match" | "elder_report" | "institution_profile" | "risk_alert" | "care_summary" | "sales_followup";
  type?: string;
  inputJson: string;
  outputJson: string;
  status: "pending" | "running" | "completed" | "failed" | "review";
  confidenceScore: number;
  confidence?: number;
  humanReviewRequired: boolean;
  sources?: string[];
  requiresHumanReview?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  completedAt?: string;
  output?: any;
  input?: any;
  createdAt: string;
  updatedAt: string;
}

// ─── 17. RiskEvent ──────────────────────────
export interface RiskEvent {
  id: string;
  elderId: string;
  careOrderId: string;
  riskType: "fall" | "medication" | "vital" | "behavior" | "nutrition" | "wandering" | "infection" | "other";
  riskLevel: "low" | "medium" | "high" | "critical";
  level?: string;
  description: string;
  detectedAt?: string;
  resolvedAt?: string;
  actionTaken: string;
  familyNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── 18. Report ─────────────────────────────
export interface Report {
  id: string;
  organizationId: string;
  elderId: string;
  reportType: "weekly_family" | "monthly_ops" | "risk_assessment" | "health_summary" | "service_quality";
  title: string;
  content: string;
  generatedByAgent: boolean;
  reviewedByHuman: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Compliance Constants ───────────────────
export const MEDICAL_DISCLAIMER = "本系统仅用于健康信息整理、服务记录和风险提示，不替代医生诊断、治疗建议或医疗决策。具体诊疗请咨询执业医生。";
export const POLICY_DISCLAIMER = "政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。";

// ─── Dashboard Stats ────────────────────────
export interface DashboardStats {
  totalElderly: number;
  activeOrders: number;
  pendingOrders: number;
  completedThisMonth: number;
  riskAlerts: number;
  policyMatches: number;
  revenueThisMonth: number;
  caregiverCount: number;
}


// ─── Backward Compatibility Types ──────────
// Used by existing dashboard pages (v1)
export interface ElderlyProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  address: string;
  phone: string;
  emergencyContact: { name: string; phone: string; relationship: string };
  birthDate?: string;
  province?: string;
  city?: string;
  familyMembers?: Array<{ id: string; name: string; relation: string; relationship?: string; phone: string; isPrimary?: boolean }>;
  healthSummary: {
    chronicDiseases: string[];
    allergies: string[];
    bloodType?: string;
    disabilityLevel?: string;
    currentMedications: Array<{ name: string; dosage: string; frequency: string; notes?: string; startDate?: string; endDate?: string; prescribingDoctor?: string; id?: string }>;
    recentVisits: Array<{ date: string; hospital: string; department: string; diagnosis: string; doctor: string; id?: string; notes?: string }>;
    riskFlags: Array<{ type: string; level: string; description: string; date: string; id?: string; detectedAt?: string; resolvedAt?: string }>;
  };
  careLevel: string;
  serviceType: string;
  tags: string[];
  lastVisit: string;
  createdAt: string;
}

// ─── Additional Backward Compatibility ──────
export type SalesLead = Lead;
export type EmergencyContact = { name: string; phone: string; relationship: string };
export type FamilyMemberCompat = FamilyMember;
export type VisitRecord = MedicalVisit;
export type RiskFlag = RiskEvent;
