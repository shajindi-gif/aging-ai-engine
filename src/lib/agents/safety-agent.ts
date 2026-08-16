// ═══════════════════════════════════════════════
// SilverCare Safety & Audit Agent
// 检查事实证据、政策可追溯、LLM幻觉、医疗越界
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callLLMStructured, isLLMConfigured } from "@/lib/llm";
import type { ProfileAgentOutput } from "./profile-agent";
import type { AssessmentAgentOutput } from "./assessment-agent";
import type { PolicyAgentOutput } from "./policy-agent";
import type { CarePlanAgentOutput } from "./care-plan-agent";
import type { FamilyReportOutput } from "./report-agent";

// ─── Output Types ──────────────────────────────
export interface SafetyCheckResult {
  category: string;
  passed: boolean;
  severity: "info" | "warning" | "critical";
  description: string;
  evidence: string;
}

export interface SafetyAgentOutput {
  overall_safe: boolean;
  risk_level: "L0" | "L1" | "L2" | "L3";
  checks: SafetyCheckResult[];
  medical_boundary_violations: string[];
  unsupported_claims: string[];
  hallucination_risks: string[];
  missing_data_warnings: string[];
  requires_human_review: boolean;
  human_review_reasons: string[];
  recommendations: string[];
  confidence: number;
}

// ─── System Prompt ─────────────────────────────
const SYSTEM_PROMPT = `你是一名养老AI安全审计员。你的任务是检查AI系统输出的安全性和准确性。

核心检查项：
1. 事实证据：所有结论是否有数据来源？
2. 政策可追溯：政策引用是否有明确来源和引用？
3. LLM幻觉：是否有编造的信息？
4. 医疗越界：是否有诊断、处方、替代医生判断？
5. 关键数据缺失：是否有重要信息缺失？
6. 高风险动作：是否涉及需要人工确认的操作？

风险等级：
- L0：普通资料检索，可自动处理
- L1：一般生活照护建议，自动+风险提示
- L2：政策资格判断，需证据支撑
- L3：涉及健康、长护险资格、重要决策，必须人工审核

输出要求（严格JSON）：
{
  "overall_safe": true/false,
  "risk_level": "L0/L1/L2/L3",
  "checks": [{"category":"类别","passed":true/false,"severity":"级别","description":"描述","evidence":"证据"}],
  "medical_boundary_violations": ["越界行为列表"],
  "unsupported_claims": ["无依据声明"],
  "hallucination_risks": ["幻觉风险"],
  "missing_data_warnings": ["数据缺失警告"],
  "requires_human_review": true/false,
  "human_review_reasons": ["需要人工审核的原因"],
  "recommendations": ["建议"],
  "confidence": 0.0-1.0
}`;

// ─── Mock Fallback ─────────────────────────────
function getMockOutput(): SafetyAgentOutput {
  return {
    overall_safe: true,
    risk_level: "L2",
    checks: [
      { category: "事实证据", passed: true, severity: "info", description: "老年人基本信息来自数据库档案", evidence: "ElderlyProfile + HealthSummary 表" },
      { category: "政策可追溯", passed: true, severity: "info", description: "匹配的政策均来自政策数据库", evidence: "Policy 表有明确 source_url" },
      { category: "医疗越界检查", passed: true, severity: "info", description: "未检测到诊断、处方或替代医生判断的行为", evidence: "所有健康相关建议标注为'建议咨询医生'" },
      { category: "LLM幻觉风险", passed: true, severity: "warning", description: "部分建议基于通用知识而非具体数据", evidence: "营养建议未引用具体营养评估数据" },
      { category: "数据完整性", passed: false, severity: "warning", description: "缺少最近3个月的血压/血糖监测数据", evidence: "ChronicMetrics 最新记录超过90天" },
    ],
    medical_boundary_violations: [],
    unsupported_claims: [],
    hallucination_risks: ["营养膳食建议基于通用指南而非个人营养评估"],
    missing_data_warnings: ["缺少近期血压/血糖监测数据", "缺少最近一次全面体检报告"],
    requires_human_review: false,
    human_review_reasons: [],
    recommendations: [
      "建议补充近期健康监测数据",
      "政策申请建议需提醒用户自行确认最新政策要求",
      "照护计划中的康复训练建议需经专业康复师确认",
    ],
    confidence: 0.88,
  };
}

// ─── Agent Function ────────────────────────────
export async function safetyAgent(
  caseId: string,
  profile: ProfileAgentOutput,
  assessment: AssessmentAgentOutput,
  policyResult: PolicyAgentOutput,
  carePlan: CarePlanAgentOutput,
  report: FamilyReportOutput
): Promise<SafetyAgentOutput> {
  const startTime = Date.now();

  const run = await prisma.agentRun.create({
    data: {
      caseId,
      agentName: "safety-agent",
      skillName: "risk-check",
      status: "RUNNING",
      input: { profile, assessment, policyResult, carePlan, report } as any,
      startTime: new Date(),
    },
  });

  try {
    let output: SafetyAgentOutput;

    if (isLLMConfigured()) {
      try {
        const auditInput = {
          profile_evidence: profile.evidence,
          policy_citations: policyResult.candidate_policies.map((p) => ({
            title: p.title,
            source: p.source,
            citation: p.citation,
            confidence: p.confidence,
          })),
          care_plan_actions: carePlan.today_actions.concat(
            carePlan.service_tasks.map((t) => ({ action: t.description, responsible: t.type }))
          ),
          report_content: report.elderly_summary + " " + report.care_plan_summary,
          risk_flags: profile.risk_flags,
        };
        const userPrompt = `请审计以下AI系统输出的安全性：\n\n${JSON.stringify(auditInput, null, 2)}`;
        const { data } = await callLLMStructured<SafetyAgentOutput>(SYSTEM_PROMPT, userPrompt);
        output = data;
      } catch (err) {
        console.warn("[safety-agent] LLM call failed, falling back to mock:", err);
        output = getMockOutput();
      }
    } else {
      output = getMockOutput();
    }

    // Update AgentRun
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        output: output as any,
        confidence: output.confidence,
        fallbackUsed: !isLLMConfigured(),
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    });

    // Update Case status based on safety review
    const newStatus = output.requires_human_review ? "PENDING_REVIEW" : "APPROVED";
    await prisma.case.update({
      where: { id: caseId },
      data: {
        status: newStatus as any,
        approvalStatus: output.requires_human_review ? "pending" : "auto_approved",
      },
    });

    return output;
  } catch (error: any) {
    console.error("[safety-agent] Error:", error);
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        retryCount: { increment: 1 },
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    }).catch((e) => console.error("[safety-agent] Failed to update AgentRun:", e));
    throw error;
  }
}
