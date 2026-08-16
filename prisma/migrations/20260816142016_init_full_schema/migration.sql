-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR', 'CAREGIVER', 'FAMILY', 'VIEWER');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('NURSING_HOME', 'COMMUNITY_STATION', 'CARE_COMPANY', 'HOSPITAL', 'GOVERNMENT', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "CareLevel" AS ENUM ('INDEPENDENT', 'SEMI_DEPENDENT', 'DEPENDENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ElderlyServiceType" AS ENUM ('HOME', 'COMMUNITY', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "RiskFlagType" AS ENUM ('FALL', 'MEDICATION', 'VITAL', 'BEHAVIOR', 'NUTRITION', 'OTHER');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CareOrderType" AS ENUM ('ESCORT', 'NURSING', 'REHABILITATION', 'COMPANION', 'BATHING', 'MEAL', 'CLEANING', 'MEDICATION_REMINDER', 'FOLLOWUP', 'POST_SURGERY');

-- CreateEnum
CREATE TYPE "CareOrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RiskEventSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ServiceTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('FUNCTIONAL', 'COGNITIVE', 'ADL', 'MEDICAL', 'COMPREHENSIVE');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "CarePlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PolicyCategory" AS ENUM ('SUBSIDY', 'INSURANCE', 'SERVICE', 'HOUSING', 'MEDICAL', 'EMPLOYMENT', 'TAX', 'LONG_TERM_CARE', 'SMART_AGING', 'TRAINING', 'OTHER');

-- CreateEnum
CREATE TYPE "PolicyLevel" AS ENUM ('NATIONAL', 'PROVINCIAL', 'MUNICIPAL', 'DISTRICT');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('NURSING_HOME', 'COMMUNITY_DAY_CARE', 'HOME_CARE_AGENCY', 'REHABILITATION_CENTER', 'HOSPICE', 'ASSISTED_LIVING', 'ESCORT_COMPANY', 'RENOVATION_VENDOR', 'DAY_CARE_CENTER');

-- CreateEnum
CREATE TYPE "PriceUnit" AS ENUM ('MONTH', 'DAY');

-- CreateEnum
CREATE TYPE "DigitalMaturityLevel" AS ENUM ('L1', 'L2', 'L3', 'L4', 'L5');

-- CreateEnum
CREATE TYPE "SalesLeadSource" AS ENUM ('POLICY_SCAN', 'WEB_CRAWL', 'REFERRAL', 'EXHIBITION', 'COLD_CALL');

-- CreateEnum
CREATE TYPE "SalesLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "SalesLeadPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'PROFILE_READY', 'ASSESSMENT_COMPLETED', 'POLICY_MATCHED', 'PLAN_GENERATED', 'PAYMENT_REQUIRED', 'PAID', 'TASK_CREATED', 'SERVICE_COMPLETED', 'REPORT_GENERATED', 'PENDING_REVIEW', 'APPROVED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AgentRunStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('SUBSCRIPTION', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('ALIPAY', 'WECHAT_PAY', 'MOCK');

-- CreateEnum
CREATE TYPE "PaymentTxStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "EntitlementStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('FAMILY_REPORT', 'CARE_PLAN', 'POLICY_MATCH', 'ASSESSMENT', 'SERVICE_SUMMARY', 'RISK_ASSESSMENT');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "phone" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'FAMILY',
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "licenseNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElderlyProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "birthDate" TIMESTAMP(3) NOT NULL,
    "idCard" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "careLevel" "CareLevel" NOT NULL DEFAULT 'INDEPENDENT',
    "serviceType" "ElderlyServiceType" NOT NULL DEFAULT 'HOME',
    "livingStatus" TEXT,
    "incomeLevel" TEXT,
    "disabilityLevel" TEXT,
    "tags" TEXT[],
    "organizationId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElderlyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "elderlyId" TEXT NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthSummary" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "chronicDiseases" TEXT[],
    "allergies" TEXT[],
    "bloodType" TEXT,
    "disabilityLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "prescribingDoctor" TEXT,
    "elderlyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hospital" TEXT NOT NULL,
    "department" TEXT,
    "diagnosis" TEXT,
    "doctor" TEXT,
    "notes" TEXT,
    "elderlyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFlag" (
    "id" TEXT NOT NULL,
    "type" "RiskFlagType" NOT NULL,
    "level" "RiskLevel" NOT NULL,
    "description" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "elderlyId" TEXT NOT NULL,

    CONSTRAINT "RiskFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChronicMetric" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "metricDate" TIMESTAMP(3) NOT NULL,
    "systolicBP" INTEGER,
    "diastolicBP" INTEGER,
    "bloodSugar" DOUBLE PRECISION,
    "heartRate" INTEGER,
    "weight" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChronicMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareOrder" (
    "id" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "elderlyName" TEXT NOT NULL,
    "type" "CareOrderType" NOT NULL,
    "status" "CareOrderStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "caregiverId" TEXT,
    "caregiverName" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "familyNotified" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "RiskEventSeverity" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handledBy" TEXT,
    "handledAt" TIMESTAMP(3),
    "resolution" TEXT,

    CONSTRAINT "RiskEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceReport" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "healthObservations" TEXT[],
    "recommendations" TEXT[],
    "photos" TEXT[],
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedBy" TEXT,

    CONSTRAINT "ServiceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTask" (
    "id" TEXT NOT NULL,
    "careOrderId" TEXT NOT NULL,
    "carePlanId" TEXT,
    "taskType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedTo" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "ServiceTaskStatus" NOT NULL DEFAULT 'PENDING',
    "result" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRecord" (
    "id" TEXT NOT NULL,
    "careOrderId" TEXT NOT NULL,
    "elderlyId" TEXT,
    "providerId" TEXT,
    "recordType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "riskLevel" TEXT,
    "familyVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "phone" TEXT,
    "certification" TEXT,
    "specialties" TEXT[],
    "rating" DOUBLE PRECISION,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationReminder" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "reminderTime" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastTakenAt" TIMESTAMP(3),
    "missedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpReminder" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "department" TEXT,
    "doctor" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "assessmentType" "AssessmentType" NOT NULL,
    "score" DOUBLE PRECISION,
    "findings" JSONB,
    "recommendations" TEXT[],
    "assessorId" TEXT,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'COMPLETED',
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextDueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlan" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "assessmentId" TEXT,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "goals" TEXT[],
    "interventions" JSONB,
    "todayActions" TEXT[],
    "weekPlan" JSONB,
    "monthPlan" JSONB,
    "frequency" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "CarePlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" TEXT,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "PolicyCategory" NOT NULL,
    "level" "PolicyLevel" NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT,
    "department" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" "PolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "summary" TEXT NOT NULL,
    "fullText" TEXT,
    "eligibility" TEXT[],
    "benefits" TEXT,
    "requiredDocuments" TEXT[],
    "applicationProcess" TEXT[],
    "applicationUrl" TEXT,
    "contactPhone" TEXT,
    "tags" TEXT[],
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolicyChunk" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER,
    "metadata" JSONB,
    "embedding" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PolicyChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InstitutionType" NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "address" TEXT NOT NULL,
    "beds" INTEGER NOT NULL DEFAULT 0,
    "occupancyRate" DOUBLE PRECISION,
    "priceMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceMax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceUnit" "PriceUnit" NOT NULL DEFAULT 'MONTH',
    "services" TEXT[],
    "rating" DOUBLE PRECISION,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "licenseNo" TEXT,
    "establishedYear" INTEGER,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalMaturity" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "level" "DigitalMaturityLevel" NOT NULL,
    "informationSystem" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataManagement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "serviceDigitization" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staffTechAdoption" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "familyEngagement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommendations" TEXT[],
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DigitalMaturity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesLead" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactRole" TEXT,
    "source" "SalesLeadSource" NOT NULL,
    "status" "SalesLeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "SalesLeadPriority" NOT NULL DEFAULT 'MEDIUM',
    "estimatedValue" DOUBLE PRECISION,
    "productInterest" TEXT[],
    "score" DOUBLE PRECISION,
    "reason" TEXT,
    "notes" TEXT,
    "lastContactAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "elderlyId" TEXT,
    "title" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'NEW',
    "elderlyProfile" JSONB,
    "assessment" JSONB,
    "policyMatches" JSONB,
    "evidence" JSONB,
    "carePlan" JSONB,
    "familyReport" JSONB,
    "riskFlags" JSONB,
    "paymentStatus" TEXT DEFAULT 'unpaid',
    "approvalStatus" TEXT DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "userId" TEXT,
    "agentName" TEXT NOT NULL,
    "skillName" TEXT,
    "toolName" TEXT,
    "model" TEXT,
    "promptVersion" TEXT,
    "skillVersion" TEXT,
    "inputHash" TEXT,
    "input" JSONB,
    "output" JSONB,
    "retrievedSources" TEXT[],
    "confidence" DOUBLE PRECISION,
    "status" "AgentRunStatus" NOT NULL DEFAULT 'PENDING',
    "latencyMs" INTEGER,
    "tokenUsage" JSONB,
    "estimatedCost" DOUBLE PRECISION,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "fallbackUsed" BOOLEAN NOT NULL DEFAULT false,
    "humanReviewed" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "previousValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "OrderType" NOT NULL DEFAULT 'ONE_TIME',
    "productName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "items" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerTransactionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "status" "PaymentTxStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "orderId" TEXT,
    "featureKey" TEXT NOT NULL,
    "status" "EntitlementStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "planTier" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "monthlyPrice" DOUBLE PRECISION NOT NULL,
    "features" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "elderlyId" TEXT,
    "reportType" "ReportType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "generatedByAgent" BOOLEAN NOT NULL DEFAULT false,
    "reviewedByHuman" BOOLEAN NOT NULL DEFAULT false,
    "agentRunId" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "period" TEXT,
    "features" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Organization_type_idx" ON "Organization"("type");

-- CreateIndex
CREATE INDEX "Organization_province_city_idx" ON "Organization"("province", "city");

-- CreateIndex
CREATE INDEX "ElderlyProfile_organizationId_idx" ON "ElderlyProfile"("organizationId");

-- CreateIndex
CREATE INDEX "ElderlyProfile_userId_idx" ON "ElderlyProfile"("userId");

-- CreateIndex
CREATE INDEX "ElderlyProfile_careLevel_idx" ON "ElderlyProfile"("careLevel");

-- CreateIndex
CREATE INDEX "ElderlyProfile_province_city_idx" ON "ElderlyProfile"("province", "city");

-- CreateIndex
CREATE INDEX "ElderlyProfile_name_idx" ON "ElderlyProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_elderlyId_key" ON "EmergencyContact"("elderlyId");

-- CreateIndex
CREATE INDEX "FamilyMember_elderlyId_idx" ON "FamilyMember"("elderlyId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthSummary_elderlyId_key" ON "HealthSummary"("elderlyId");

-- CreateIndex
CREATE INDEX "Medication_elderlyId_idx" ON "Medication"("elderlyId");

-- CreateIndex
CREATE INDEX "VisitRecord_elderlyId_idx" ON "VisitRecord"("elderlyId");

-- CreateIndex
CREATE INDEX "VisitRecord_date_idx" ON "VisitRecord"("date");

-- CreateIndex
CREATE INDEX "RiskFlag_elderlyId_idx" ON "RiskFlag"("elderlyId");

-- CreateIndex
CREATE INDEX "RiskFlag_type_level_idx" ON "RiskFlag"("type", "level");

-- CreateIndex
CREATE INDEX "RiskFlag_resolvedAt_idx" ON "RiskFlag"("resolvedAt");

-- CreateIndex
CREATE INDEX "ChronicMetric_elderlyId_idx" ON "ChronicMetric"("elderlyId");

-- CreateIndex
CREATE INDEX "ChronicMetric_metricDate_idx" ON "ChronicMetric"("metricDate");

-- CreateIndex
CREATE UNIQUE INDEX "CareOrder_orderNo_key" ON "CareOrder"("orderNo");

-- CreateIndex
CREATE INDEX "CareOrder_elderlyId_idx" ON "CareOrder"("elderlyId");

-- CreateIndex
CREATE INDEX "CareOrder_organizationId_idx" ON "CareOrder"("organizationId");

-- CreateIndex
CREATE INDEX "CareOrder_status_idx" ON "CareOrder"("status");

-- CreateIndex
CREATE INDEX "CareOrder_scheduledAt_idx" ON "CareOrder"("scheduledAt");

-- CreateIndex
CREATE INDEX "CareOrder_orderNo_idx" ON "CareOrder"("orderNo");

-- CreateIndex
CREATE INDEX "RiskEvent_orderId_idx" ON "RiskEvent"("orderId");

-- CreateIndex
CREATE INDEX "RiskEvent_severity_idx" ON "RiskEvent"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceReport_orderId_key" ON "ServiceReport"("orderId");

-- CreateIndex
CREATE INDEX "ServiceTask_careOrderId_idx" ON "ServiceTask"("careOrderId");

-- CreateIndex
CREATE INDEX "ServiceTask_carePlanId_idx" ON "ServiceTask"("carePlanId");

-- CreateIndex
CREATE INDEX "ServiceTask_status_idx" ON "ServiceTask"("status");

-- CreateIndex
CREATE INDEX "ServiceRecord_careOrderId_idx" ON "ServiceRecord"("careOrderId");

-- CreateIndex
CREATE INDEX "ServiceRecord_elderlyId_idx" ON "ServiceRecord"("elderlyId");

-- CreateIndex
CREATE INDEX "MedicationReminder_elderlyId_idx" ON "MedicationReminder"("elderlyId");

-- CreateIndex
CREATE INDEX "MedicationReminder_active_idx" ON "MedicationReminder"("active");

-- CreateIndex
CREATE INDEX "FollowUpReminder_elderlyId_idx" ON "FollowUpReminder"("elderlyId");

-- CreateIndex
CREATE INDEX "FollowUpReminder_scheduledDate_idx" ON "FollowUpReminder"("scheduledDate");

-- CreateIndex
CREATE INDEX "FollowUpReminder_completed_idx" ON "FollowUpReminder"("completed");

-- CreateIndex
CREATE INDEX "Assessment_elderlyId_idx" ON "Assessment"("elderlyId");

-- CreateIndex
CREATE INDEX "Assessment_assessmentType_idx" ON "Assessment"("assessmentType");

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CarePlan_assessmentId_key" ON "CarePlan"("assessmentId");

-- CreateIndex
CREATE INDEX "CarePlan_elderlyId_idx" ON "CarePlan"("elderlyId");

-- CreateIndex
CREATE INDEX "CarePlan_organizationId_idx" ON "CarePlan"("organizationId");

-- CreateIndex
CREATE INDEX "CarePlan_status_idx" ON "CarePlan"("status");

-- CreateIndex
CREATE INDEX "Policy_category_idx" ON "Policy"("category");

-- CreateIndex
CREATE INDEX "Policy_level_idx" ON "Policy"("level");

-- CreateIndex
CREATE INDEX "Policy_province_city_idx" ON "Policy"("province", "city");

-- CreateIndex
CREATE INDEX "Policy_status_idx" ON "Policy"("status");

-- CreateIndex
CREATE INDEX "Policy_tags_idx" ON "Policy"("tags");

-- CreateIndex
CREATE INDEX "PolicyChunk_policyId_idx" ON "PolicyChunk"("policyId");

-- CreateIndex
CREATE INDEX "PolicyChunk_chunkIndex_idx" ON "PolicyChunk"("chunkIndex");

-- CreateIndex
CREATE INDEX "Institution_type_idx" ON "Institution"("type");

-- CreateIndex
CREATE INDEX "Institution_province_city_district_idx" ON "Institution"("province", "city", "district");

-- CreateIndex
CREATE INDEX "Institution_rating_idx" ON "Institution"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalMaturity_institutionId_key" ON "DigitalMaturity"("institutionId");

-- CreateIndex
CREATE INDEX "SalesLead_institutionId_idx" ON "SalesLead"("institutionId");

-- CreateIndex
CREATE INDEX "SalesLead_status_idx" ON "SalesLead"("status");

-- CreateIndex
CREATE INDEX "SalesLead_priority_idx" ON "SalesLead"("priority");

-- CreateIndex
CREATE INDEX "SalesLead_source_idx" ON "SalesLead"("source");

-- CreateIndex
CREATE INDEX "SalesLead_assignedTo_idx" ON "SalesLead"("assignedTo");

-- CreateIndex
CREATE INDEX "SalesLead_nextFollowUpAt_idx" ON "SalesLead"("nextFollowUpAt");

-- CreateIndex
CREATE INDEX "Case_userId_idx" ON "Case"("userId");

-- CreateIndex
CREATE INDEX "Case_elderlyId_idx" ON "Case"("elderlyId");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "AgentRun_caseId_idx" ON "AgentRun"("caseId");

-- CreateIndex
CREATE INDEX "AgentRun_userId_idx" ON "AgentRun"("userId");

-- CreateIndex
CREATE INDEX "AgentRun_agentName_idx" ON "AgentRun"("agentName");

-- CreateIndex
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status");

-- CreateIndex
CREATE INDEX "AgentRun_startTime_idx" ON "AgentRun"("startTime");

-- CreateIndex
CREATE INDEX "AuditEvent_userId_idx" ON "AuditEvent"("userId");

-- CreateIndex
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent"("action");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNo_key" ON "Order"("orderNo");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_orderNo_idx" ON "Order"("orderNo");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerTransactionId_key" ON "Payment"("providerTransactionId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_providerTransactionId_idx" ON "Payment"("providerTransactionId");

-- CreateIndex
CREATE INDEX "Entitlement_userId_idx" ON "Entitlement"("userId");

-- CreateIndex
CREATE INDEX "Entitlement_featureKey_idx" ON "Entitlement"("featureKey");

-- CreateIndex
CREATE INDEX "Entitlement_status_idx" ON "Entitlement"("status");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Report_caseId_idx" ON "Report"("caseId");

-- CreateIndex
CREATE INDEX "Report_elderlyId_idx" ON "Report"("elderlyId");

-- CreateIndex
CREATE INDEX "Report_reportType_idx" ON "Report"("reportType");

-- CreateIndex
CREATE UNIQUE INDEX "PricingPlan_tier_key" ON "PricingPlan"("tier");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElderlyProfile" ADD CONSTRAINT "ElderlyProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElderlyProfile" ADD CONSTRAINT "ElderlyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthSummary" ADD CONSTRAINT "HealthSummary_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitRecord" ADD CONSTRAINT "VisitRecord_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFlag" ADD CONSTRAINT "RiskFlag_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChronicMetric" ADD CONSTRAINT "ChronicMetric_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareOrder" ADD CONSTRAINT "CareOrder_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareOrder" ADD CONSTRAINT "CareOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskEvent" ADD CONSTRAINT "RiskEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CareOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReport" ADD CONSTRAINT "ServiceReport_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CareOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTask" ADD CONSTRAINT "ServiceTask_careOrderId_fkey" FOREIGN KEY ("careOrderId") REFERENCES "CareOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTask" ADD CONSTRAINT "ServiceTask_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_careOrderId_fkey" FOREIGN KEY ("careOrderId") REFERENCES "CareOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationReminder" ADD CONSTRAINT "MedicationReminder_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpReminder" ADD CONSTRAINT "FollowUpReminder_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlan" ADD CONSTRAINT "CarePlan_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlan" ADD CONSTRAINT "CarePlan_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlan" ADD CONSTRAINT "CarePlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyChunk" ADD CONSTRAINT "PolicyChunk_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalMaturity" ADD CONSTRAINT "DigitalMaturity_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesLead" ADD CONSTRAINT "SalesLead_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "ElderlyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
