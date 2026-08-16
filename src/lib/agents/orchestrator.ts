// ═══════════════════════════════════════════════
// SilverCare Orchestrator
// 统一调度 7 个 Agent 完成养老服务闭环
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { profileAgent, type ProfileAgentOutput } from "./profile-agent";
import { assessmentAgent, type AssessmentAgentOutput } from "./assessment-agent";
import { policyAgent, type PolicyAgentOutput } from "./policy-agent";
import { carePlanAgent, type CarePlanAgentOutput } from "./care-plan-agent";
import { serviceAgent, type ServiceAgentOutput } from "./service-agent";
import { reportAgent, type FamilyReportOutput } from "./report-agent";
import { safetyAgent, type SafetyAgentOutput } from "./safety-agent";

// ─── Orchestrator Result ───────────────────────
export interface OrchestrationResult {
  caseId: string;
  status: "COMPLETED" | "FAILED" | "NEEDS_REVIEW";
  profile: ProfileAgentOutput;
  assessment: AssessmentAgentOutput;
  policyMatches: PolicyAgentOutput;
  carePlan: CarePlanAgentOutput;
  serviceTasks: ServiceAgentOutput;
  familyReport: FamilyReportOutput;
  safetyReview: SafetyAgentOutput;
  executionLog: Array<{
    step: string;
    agent: string;
    status: string;
    latencyMs: number;
    error?: string;
  }>;
  totalLatencyMs: number;
}

// ─── Main Orchestrator Function ────────────────
export async function runSilverCareOrchestrator(
  userId: string,
  elderlyId: string,
  options?: {
    existingCaseId?: string;
    skipSteps?: string[];
  }
): Promise<OrchestrationResult> {
  const totalStart = Date.now();
  const executionLog: OrchestrationResult["executionLog"] = [];
  const skip = new Set(options?.skipSteps ?? []);

  // 1. Create or reuse Case
  let caseId = options?.existingCaseId;
  if (!caseId) {
    const elderly = await prisma.elderlyProfile.findUnique({
      where: { id: elderlyId },
      select: { name: true },
    });
    const caseRecord = await prisma.case.create({
      data: {
        userId,
        elderlyId,
        title: `${elderly?.name ?? "老人"}的养老服务案例`,
        status: "NEW",
      },
    });
    caseId = caseRecord.id;
  }

  // Track step execution
  async function runStep<T>(
    step: string,
    agent: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const stepStart = Date.now();
    try {
      const result = await fn();
      executionLog.push({
        step,
        agent,
        status: "COMPLETED",
        latencyMs: Date.now() - stepStart,
      });
      return result;
    } catch (error: any) {
      executionLog.push({
        step,
        agent,
        status: "FAILED",
        latencyMs: Date.now() - stepStart,
        error: error.message,
      });
      throw error;
    }
  }

  try {
    // ─── Step 1: Profile Analysis ──────────────
    let profile: ProfileAgentOutput;
    if (!skip.has("profile")) {
      profile = await runStep("老人画像分析", "profile-agent", () =>
        profileAgent(caseId!, elderlyId)
      );
    } else {
      // Load from existing case
      const existing = await prisma.case.findUnique({ where: { id: caseId }, select: { elderlyProfile: true } });
      profile = (existing?.elderlyProfile as any) ?? { elderly_profile: { name: "未知", age: 0, gender: "unknown", living_status: "unknown", care_level: "independent", location: "未知", chronic_diseases: [], current_medications: [], recent_visits: [], family_members: [] }, missing_fields: [], major_needs: [], risk_flags: [], evidence: [], confidence: 0 };
    }

    // ─── Step 2: Care Assessment ───────────────
    let assessment: AssessmentAgentOutput;
    if (!skip.has("assessment")) {
      assessment = await runStep("护理需求评估", "assessment-agent", () =>
        assessmentAgent(caseId!, elderlyId, profile)
      );
    } else {
      const existing = await prisma.case.findUnique({ where: { id: caseId }, select: { assessment: true } });
      assessment = (existing?.assessment as any) ?? { care_need_categories: [], urgency: "routine", assistance_needed: { daily_living: false, medical_care: false, mobility_support: false, cognitive_support: false, emotional_support: false }, recommended_next_actions: [], adl_score: 0, summary: "跳过评估", confidence: 0 };
    }

    // ─── Step 3: Policy Matching ───────────────
    let policyMatches: PolicyAgentOutput;
    if (!skip.has("policy")) {
      policyMatches = await runStep("政策匹配", "policy-agent", () =>
        policyAgent(caseId!, profile, assessment)
      );
    } else {
      const existing = await prisma.case.findUnique({ where: { id: caseId }, select: { policyMatches: true } });
      policyMatches = (existing?.policyMatches as any) ?? { candidate_policies: [], total_matched: 0, search_strategy: "skipped", missing_materials: [], policy_disclaimer: "已跳过政策匹配", confidence: 0 };
    }

    // ─── Step 4: Care Plan ─────────────────────
    let carePlan: CarePlanAgentOutput;
    if (!skip.has("carePlan")) {
      carePlan = await runStep("照护计划生成", "care-plan-agent", () =>
        carePlanAgent(caseId!, profile, assessment, policyMatches)
      );
    } else {
      carePlan = {
        plan_title: "已跳过照护计划",
        goals: [], today_actions: [], week_plan: [], month_plan: [],
        service_tasks: [], family_tasks: [],
        followup_plan: { next_review_date: "", review_items: [], escalation_triggers: [] },
        policy_applications: [], confidence: 0,
      };
    }

    // ─── Step 5: Service Coordination ──────────
    let serviceTasks: ServiceAgentOutput;
    if (!skip.has("service")) {
      serviceTasks = await runStep("服务任务创建", "service-agent", () =>
        serviceAgent(caseId!, carePlan)
      );
    } else {
      serviceTasks = {
        created_tasks: [], total_tasks_created: 0,
        pending_confirmation: [], summary: "已跳过服务创建", confidence: 0,
      };
    }

    // ─── Step 6: Family Report ─────────────────
    let familyReport: FamilyReportOutput;
    if (!skip.has("report")) {
      familyReport = await runStep("家属报告生成", "report-agent", () =>
        reportAgent(caseId!, profile, assessment, policyMatches, carePlan, serviceTasks)
      );
    } else {
      familyReport = {
        report_title: "已跳过报告", elderly_summary: "", current_status: "",
        completed_services: [], policy_opportunities: [], care_plan_summary: "",
        pending_tasks: [], risk_warnings: [], next_steps: [],
        report_html: "<p>已跳过报告生成</p>", confidence: 0,
      };
    }

    // ─── Step 7: Safety Review ─────────────────
    let safetyReview: SafetyAgentOutput;
    if (!skip.has("safety")) {
      safetyReview = await runStep("安全审计", "safety-agent", () =>
        safetyAgent(caseId!, profile, assessment, policyMatches, carePlan, familyReport)
      );
    } else {
      safetyReview = {
        overall_safe: true, risk_level: "L0", checks: [],
        medical_boundary_violations: [], unsupported_claims: [],
        hallucination_risks: [], missing_data_warnings: [],
        requires_human_review: false, human_review_reasons: [],
        recommendations: [], confidence: 0,
      };
    }

    // ─── Final: Determine Status ───────────────
    const hasFailed = executionLog.some((l) => l.status === "FAILED");
    let status: OrchestrationResult["status"];
    if (hasFailed) {
      status = "FAILED";
      await prisma.case.update({ where: { id: caseId }, data: { status: "FAILED" } });
    } else if (safetyReview.requires_human_review) {
      status = "NEEDS_REVIEW";
    } else {
      status = "COMPLETED";
    }

    return {
      caseId,
      status,
      profile,
      assessment,
      policyMatches,
      carePlan,
      serviceTasks,
      familyReport,
      safetyReview,
      executionLog,
      totalLatencyMs: Date.now() - totalStart,
    };
  } catch (error: any) {
    console.error("[orchestrator] Fatal error:", error);
    await prisma.case.update({
      where: { id: caseId },
      data: { status: "FAILED" },
    }).catch((e) => console.error("[orchestrator] Failed to update case:", e));

    return {
      caseId,
      status: "FAILED",
      profile: {} as ProfileAgentOutput,
      assessment: {} as AssessmentAgentOutput,
      policyMatches: {} as PolicyAgentOutput,
      carePlan: {} as CarePlanAgentOutput,
      serviceTasks: {} as ServiceAgentOutput,
      familyReport: {} as FamilyReportOutput,
      safetyReview: {} as SafetyAgentOutput,
      executionLog,
      totalLatencyMs: Date.now() - totalStart,
    };
  }
}
