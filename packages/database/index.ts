// ═══════════════════════════════════════════════
// 衍策银龄 AI — 统一数据模型
// Aging AI Engine Unified Type System
// ═══════════════════════════════════════════════

// ─── 用户与组织 ───────────────────────────────
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "admin" | "operator" | "caregiver" | "family" | "viewer";
  organizationId: string;
  avatar?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: "nursing_home" | "community_station" | "care_company" | "hospital" | "government" | "enterprise";
  address: string;
  city: string;
  province: string;
  contactName: string;
  contactPhone: string;
  licenseNo?: string;
  createdAt: string;
}

// ─── 老人档案 ───────────────────────────────
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
  familyMembers: FamilyMember[];
  healthSummary: HealthSummary;
  careLevel: "independent" | "semi_dependent" | "dependent" | "critical";
  serviceType: "home" | "community" | "institution";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface FamilyMember {
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

// ─── 陪诊服务 ───────────────────────────────
export interface CareOrder {
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
  riskEvents: RiskEvent[];
  serviceReport?: ServiceReport;
  price: number;
  createdAt: string;
}

export interface RiskEvent {
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

// ─── 用药提醒 ───────────────────────────────
export interface MedicationReminder {
  id: string;
  elderlyId: string;
  medication: Medication;
  reminderTime: string[];
  active: boolean;
  lastTakenAt?: string;
  missedCount: number;
}

// ─── 复诊提醒 ───────────────────────────────
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

// ─── 政策数据库 ───────────────────────────────
export interface Policy {
  id: string;
  title: string;
  category: "subsidy" | "insurance" | "service" | "housing" | "medical" | "employment" | "tax" | "other";
  level: "national" | "provincial" | "municipal" | "district";
  province: string;
  city?: string;
  department: string;
  effectiveDate: string;
  expiryDate?: string;
  status: "active" | "expired" | "upcoming";
  summary: string;
  eligibility: string[];
  benefits: string;
  requiredDocuments: string[];
  applicationProcess: string[];
  applicationUrl?: string;
  contactPhone?: string;
  tags: string[];
  updatedAt: string;
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

// ─── 养老机构 ───────────────────────────────
export interface Institution {
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

// ─── 销售线索 ───────────────────────────────
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

// ─── Agent 系统 ───────────────────────────────
export interface AgentTask {
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

// ─── Dashboard 统计 ───────────────────────────────
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

// ─── 合规 ───────────────────────────────
export const MEDICAL_DISCLAIMER = "本系统仅用于健康信息整理、服务记录和风险提示，不替代医生诊断、治疗建议或医疗决策。具体诊疗请咨询执业医生。";
export const POLICY_DISCLAIMER = "政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。";
