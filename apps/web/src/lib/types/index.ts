// ═══════════════════════════════════════════════
// 衍策银龄 AI — 统一数据模型 v2
// Aging AI Engine Unified Type System
// 18 Core Entities + Legacy Types
// ═══════════════════════════════════════════════

// ─── 1. Organization 机构/组织 ───────────────────────────────
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

// ─── 2. User 用户 ───────────────────────────────
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

// ─── 3. Elder 老人档案 ───────────────────────────────
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
  familyMemberIds: string[];
  consentStatus: "granted" | "pending" | "revoked";
  createdAt: string;
  updatedAt: string;
}

// ─── 4. FamilyMember 家属 ───────────────────────────────
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

// ─── 5. CareProvider 护理员 ───────────────────────────────
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

// ─── 6. CareOrder 服务工单 ───────────────────────────────
export interface CareOrder {
  id: string;
  organizationId: string;
  elderId: string;
  careProviderId: string;
  serviceType: "escort" | "nursing" | "rehabilitation" | "companion" | "bathing" | "meal" | "cleaning" | "medication_reminder" | "followup" | "post_surgery";
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  scheduledStartAt: string;
  scheduledEndAt: string;
  price: number;
  paymentStatus: "unpaid" | "paid" | "refunded";
  familyNotificationStatus: "pending" | "sent" | "read";
  createdAt: string;
  updatedAt: string;
}

// ─── 7. CareRecord 服务记录 ───────────────────────────────
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

// ─── 8. MedicalVisit 就诊记录 ───────────────────────────────
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

// ─── 9. MedicationReminder 用药提醒 ───────────────────────────────
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

// ─── 10. ChronicMetric 慢病指标 ───────────────────────────────
export interface ChronicMetric {
  id: string;
  elderId: string;
  metricType: "blood_pressure" | "blood_sugar" | "heart_rate" | "weight" | "oxygen" | "temperature";
  value: string;
  unit: string;
  measuredAt: string;
  abnormalFlag: boolean;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 11. Policy 政策 ───────────────────────────────
export interface Policy {
  id: string;
  title: string;
  region: string;
  department: string;
  level: "national" | "provincial" | "municipal" | "district";
  policyType: "subsidy" | "insurance" | "service" | "housing" | "medical" | "training" | "smart_aging";
  subsidyType: "cash" | "service" | "equipment" | "training" | "operation";
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

// ─── 12. PolicyEligibilityRule 政策匹配规则 ───────────────────────────────
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

// ─── 13. SubsidyApplication 补贴申请 ───────────────────────────────
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

// ─── 14. Institution 养老机构 ───────────────────────────────
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
  purchaseIntentScore: number;
  createdAt: string;
  updatedAt: string;
}

// ─── 15. Lead 销售线索 ───────────────────────────────
export interface Lead {
  id: string;
  institutionId: string;
  leadType: "policy_scan" | "web_crawl" | "referral" | "exhibition" | "cold_call";
  score: number;
  reason: string;
  suggestedProduct: string;
  followUpStatus: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  createdAt: string;
  updatedAt: string;
}

// ─── 16. AgentTask AI任务 ───────────────────────────────
export interface AgentTask {
  id: string;
  organizationId: string;
  agentType: "policy_match" | "elder_report" | "institution_profile" | "risk_alert" | "care_summary" | "sales_followup";
  inputJson: string;
  outputJson: string;
  status: "pending" | "running" | "completed" | "failed" | "review";
  confidenceScore: number;
  humanReviewRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── 17. RiskEvent 风险事件 ───────────────────────────────
export interface RiskEvent {
  id: string;
  elderId: string;
  careOrderId: string;
  riskType: "fall" | "medication" | "vital" | "behavior" | "nutrition" | "wandering" | "infection" | "other";
  riskLevel: "low" | "medium" | "high" | "critical";
  description: string;
  actionTaken: string;
  familyNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── 18. Report 报告 ───────────────────────────────
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

// ─── Dashboard 统计 ───────────────────────────────
export interface DashboardStats {
  totalElders: number;
  activeOrders: number;
  pendingOrders: number;
  completedThisMonth: number;
  riskAlerts: number;
  policyMatches: number;
  revenueThisMonth: number;
  caregiverCount: number;
  totalInstitutions: number;
  activeLeads: number;
  wonLeadsThisQuarter: number;
  avgDigitalMaturityScore: number;
  avgSatisfactionRating: number;
  chronicMetricsRecordedToday: number;
  agentTasksCompletedToday: number;
  subsidyApplicationsPending: number;
}

// ═══════════════════════════════════════════════
// Legacy Types (backward compatibility)
// ═══════════════════════════════════════════════

export interface ElderlyProfile {
  id: string;
  name: string;
  gender: "male" | "female";
  birthDate: string;
  idCard?: string;
  phone?: string;
  address: string;
  city: string;
  province: string;
  emergencyContact: EmergencyContact;
  familyMembers: LegacyFamilyMember[];
  healthSummary: HealthSummary;
  careLevel: "independent" | "semi_dependent" | "dependent" | "critical";
  serviceType: "home" | "community" | "institution";
  livingStatus?: "alone" | "with_spouse" | "with_children" | "institution";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface LegacyFamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface HealthSummary {
  chronicDiseases: string[];
  allergies: string[];
  currentMedications: Medication[];
  recentVisits: VisitRecord[];
  riskFlags: RiskFlag[];
  bloodType?: string;
  disabilityLevel?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribingDoctor?: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  hospital: string;
  department: string;
  diagnosis: string;
  doctor: string;
  notes?: string;
}

export interface RiskFlag {
  id: string;
  type: "fall" | "medication" | "vital" | "behavior" | "nutrition" | "other";
  level: "low" | "medium" | "high" | "critical";
  description: string;
  detectedAt: string;
  resolvedAt?: string;
}

export interface LegacyCareOrder {
  id: string;
  orderNo: string;
  elderlyId: string;
  elderlyName: string;
  type: "escort" | "nursing" | "rehabilitation" | "companion" | "bathing" | "meal" | "cleaning";
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  scheduledAt: string;
  completedAt?: string;
  caregiverId?: string;
  caregiverName?: string;
  location: string;
  notes?: string;
  familyNotified: boolean;
  riskEvents: LegacyRiskEvent[];
  serviceReport?: ServiceReport;
  price: number;
  createdAt: string;
}

export interface LegacyRiskEvent {
  id: string;
  orderId: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  occurredAt: string;
  handledBy?: string;
  handledAt?: string;
  resolution?: string;
}

export interface ServiceReport {
  id: string;
  orderId: string;
  summary: string;
  healthObservations: string[];
  recommendations: string[];
  photos?: string[];
  submittedAt: string;
  submittedBy: string;
}

export interface FollowUpReminder {
  id: string;
  elderlyId: string;
  hospital: string;
  department: string;
  doctor: string;
  scheduledDate: string;
  reason: string;
  notified: boolean;
  completed: boolean;
}

export interface SubsidyMatchRequest {
  elderlyId?: string;
  province: string;
  city?: string;
  age: number;
  careLevel: string;
  income?: string;
  disabilityLevel?: string;
  householdType?: string;
  specialConditions?: string[];
}

export interface SubsidyMatchResult {
  policy: Policy;
  matchScore: number;
  matchReasons: string[];
  missingConditions: string[];
  estimatedAmount?: string;
  applicationPath: string[];
  confidence: number;
}

export interface LegacyInstitution {
  id: string;
  name: string;
  type: "nursing_home" | "community_day_care" | "home_care_agency" | "rehabilitation_center" | "hospice" | "assisted_living";
  province: string;
  city: string;
  district: string;
  address: string;
  beds: number;
  occupancyRate?: number;
  priceRange: { min: number; max: number; unit: "month" | "day" };
  services: string[];
  rating?: number;
  digitalMaturity: DigitalMaturity;
  contactName: string;
  contactPhone: string;
  website?: string;
  licenseNo: string;
  establishedYear: number;
  tags: string[];
  updatedAt: string;
}

export interface DigitalMaturity {
  score: number;
  level: "L1" | "L2" | "L3" | "L4" | "L5";
  dimensions: {
    informationSystem: number;
    dataManagement: number;
    serviceDigitization: number;
    staffTechAdoption: number;
    familyEngagement: number;
  };
  recommendations: string[];
}

export interface SalesLead {
  id: string;
  institutionId: string;
  institutionName: string;
  contactName: string;
  contactPhone: string;
  contactRole: string;
  source: "policy_scan" | "web_crawl" | "referral" | "exhibition" | "cold_call";
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  priority: "high" | "medium" | "low";
  estimatedValue?: number;
  productInterest: string[];
  notes: string;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  assignedTo?: string;
  createdAt: string;
}

export interface LegacyAgentTask {
  id: string;
  type: "policy_match" | "health_summary" | "service_report" | "risk_assessment" | "institution_recommend" | "subsidy_check" | "family_report";
  status: "pending" | "running" | "completed" | "failed" | "review";
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  confidence: number;
  sources: string[];
  requiresHumanReview: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AgentResponse {
  taskId: string;
  result: unknown;
  confidence: number;
  sources: string[];
  disclaimer?: string;
  requiresHumanReview: boolean;
}

// ─── 合规声明 ───────────────────────────────
export const MEDICAL_DISCLAIMER = "本系统仅用于健康信息整理、服务记录和风险提示，不替代医生诊断、治疗建议或医疗决策。具体诊疗请咨询执业医生。";
export const POLICY_DISCLAIMER = "政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。";
