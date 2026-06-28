// ═══════════════════════════════════════════════
// 衍策银龄 AI SDK — 类型定义 v2
// Standalone types — no Next.js dependency
// ═══════════════════════════════════════════════

// ─── Unified API Response ───────────────────────────
export interface ApiResponseMeta {
  project: string;
  source: string;
  generatedAt: string;
  humanReviewRequired: boolean;
  disclaimer?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
  meta: Omit<ApiResponseMeta, "humanReviewRequired">;
}

// ─── 政策 ─────────────────────────────────────────
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

// ─── 老人档案 ───────────────────────────────────────
export interface Elder {
  id: string;
  name: string;
  gender: "male" | "female";
  birthDate: string;
  phone?: string;
  address: string;
  city: string;
  province: string;
  emergencyContact: { name: string; phone: string; relationship: string };
  familyMembers: Array<{ id: string; name: string; relationship: string; phone: string; isPrimary: boolean }>;
  healthSummary: {
    chronicDiseases: string[];
    allergies: string[];
    bloodType?: string;
    disabilityLevel?: string;
    currentMedications: Array<{ name: string; dosage: string; frequency: string; startDate: string; prescribingDoctor?: string }>;
    recentVisits: Array<{ id: string; date: string; hospital: string; department: string; diagnosis: string; doctor: string }>;
    riskFlags: Array<{ id: string; type: string; level: string; description: string; detectedAt: string }>;
  };
  careLevel: "independent" | "semi_dependent" | "dependent" | "critical";
  serviceType: "home" | "community" | "institution";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── 护理订单 ───────────────────────────────────────
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
  riskEvents: Array<{ id: string; orderId: string; type: string; description: string; severity: string; occurredAt: string; resolution?: string }>;
  serviceReport?: { id: string; orderId: string; summary: string; healthObservations: string[]; recommendations: string[]; submittedAt: string; submittedBy: string };
  price: number;
  createdAt: string;
}

// ─── 护理记录 ───────────────────────────────────────
export interface CareRecord {
  id: string;
  careOrderId: string;
  elderlyId: string;
  elderlyName: string;
  recordType: string;
  summary: string;
  healthObservations: string[];
  recommendations: string[];
  submittedAt: string;
  submittedBy: string;
}

// ─── 养老机构 ───────────────────────────────────────
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
  digitalMaturity: { score: number; level: string; dimensions: Record<string, number>; recommendations: string[] };
  contactName: string;
  contactPhone: string;
  website?: string;
  licenseNo: string;
  establishedYear: number;
  tags: string[];
  updatedAt: string;
}

// ─── 销售线索 ───────────────────────────────────────
export interface Lead {
  id: string;
  institutionId: string;
  institutionName: string;
  contactName: string;
  contactPhone: string;
  contactRole: string;
  source: string;
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

// ─── Agent outputs ──────────────────────────────────
export interface PolicyMatchAgentResult {
  matchedPolicies: Array<{ policyId: string; policyTitle: string; matchScore: number; eligibilityReason: string[]; estimatedBenefit: string }>;
  matchScore: number;
  eligibilityReason: string;
  missingMaterials: string[];
  nextSteps: string[];
  responsibleDepartment: string;
  disclaimer: string;
  confidence: number;
  sources: string[];
  humanReviewRequired: boolean;
}

export interface ElderReportAgentResult {
  healthSummary: string;
  recentCareRecords: Array<{ date: string; type: string; summary: string }>;
  medicationReminders: Array<{ medication: string; dosage: string; frequency: string; nextDue: string }>;
  followUpTasks: Array<{ task: string; dueDate: string; priority: string }>;
  riskAlerts: Array<{ type: string; level: string; description: string }>;
  familyFriendlySummary: string;
  humanReviewRequired: boolean;
  medicalDisclaimer: string;
  confidence: number;
  sources: string[];
}

export interface InstitutionProfileAgentResult {
  institutionSummary: string;
  institutionType: string;
  serviceTags: string[];
  digitalMaturityScore: number;
  purchaseIntentScore: number;
  suggestedProducts: Array<{ name: string; reason: string; estimatedPrice: number }>;
  salesApproach: string;
  nextContactPlan: { method: string; timing: string; talkingPoints: string[] };
  confidence: number;
  sources: string[];
}

export interface RiskAlertAgentResult {
  riskLevel: string;
  riskType: string;
  evidence: Array<{ source: string; finding: string; severity: string; detectedAt: string }>;
  suggestedAction: string;
  familyNotificationDraft: string;
  humanReviewRequired: boolean;
  medicalDisclaimer: string;
  confidence: number;
  sources: string[];
}

export interface CareSummaryAgentResult {
  serviceSummary: string;
  completedTasks: Array<{ task: string; completedAt: string; notes: string }>;
  abnormalEvents: Array<{ event: string; severity: string; resolution: string }>;
  familyMessage: string;
  nextServiceSuggestion: { type: string; reason: string; suggestedDate: string };
  humanReviewRequired: boolean;
  confidence: number;
  sources: string[];
}

export interface SalesFollowupAgentResult {
  leadSummary: string;
  painPoints: Array<{ point: string; urgency: string; evidence: string }>;
  recommendedOffer: { productName: string; price: number; discount: string; bundle: string[] };
  firstMessageDraft: string;
  followupSteps: Array<{ step: number; action: string; timing: string; channel: string }>;
  confidence: number;
  sources: string[];
}

// ─── Filters ────────────────────────────────────────
export interface PolicyFilters { region?: string; policyType?: string; keyword?: string }
export interface ElderFilters { careLevel?: string; livingStatus?: string; region?: string }
export interface CareOrderFilters { status?: string; serviceType?: string; elderId?: string }
export interface CareRecordFilters { elderId?: string; recordType?: string; careOrderId?: string }
export interface InstitutionFilters { region?: string; institutionType?: string }
export interface LeadFilters { followUpStatus?: string; leadType?: string }

// ─── SDK Client Options ─────────────────────────────
export interface AgingAIClientOptions {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}
