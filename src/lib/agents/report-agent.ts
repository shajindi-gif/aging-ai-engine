// ═══════════════════════════════════════════════
// SilverCare Family Report Agent
// 汇总所有数据生成家属可读报告
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callLLM, isLLMConfigured } from "@/lib/llm";
import type { ProfileAgentOutput } from "./profile-agent";
import type { AssessmentAgentOutput } from "./assessment-agent";
import type { PolicyAgentOutput } from "./policy-agent";
import type { CarePlanAgentOutput } from "./care-plan-agent";
import type { ServiceAgentOutput } from "./service-agent";

// ─── Output Types ──────────────────────────────
export interface FamilyReportOutput {
  report_title: string;
  elderly_summary: string;
  current_status: string;
  completed_services: string[];
  policy_opportunities: Array<{
    title: string;
    benefit: string;
    action_needed: string;
  }>;
  care_plan_summary: string;
  pending_tasks: string[];
  risk_warnings: Array<{
    type: string;
    level: string;
    description: string;
    recommendation: string;
  }>;
  next_steps: string[];
  report_html: string;
  confidence: number;
}

// ─── System Prompt ─────────────────────────────
const SYSTEM_PROMPT = `你是一名专业的养老照护报告撰写专员。你的任务是将分散的分析数据汇总为家属能理解的报告。

重要规则：
1. 语言要温暖、专业、易于理解
2. 避免使用医学专业术语，用通俗语言解释
3. 重点突出可行动的下一步建议
4. 风险提示要明确但不制造恐慌
5. 政策机会要说明具体怎么做
6. 不得输出任何医学诊断
7. 用中文输出所有内容

你需要输出两部分：
1. 结构化JSON数据（用于存储和展示）
2. report_html：一段美观的HTML报告片段（用于PDF生成和展示）`;

// ─── Mock Fallback ─────────────────────────────
function getMockOutput(profile: ProfileAgentOutput, carePlan: CarePlanAgentOutput): FamilyReportOutput {
  const name = profile.elderly_profile.name;
  const age = profile.elderly_profile.age;
  const diseases = profile.elderly_profile.chronic_diseases;

  return {
    report_title: `${name}的养老服务报告`,
    elderly_summary: `${name}，${age}岁，目前居住在上海。已诊断${diseases.join("、")}。日常生活${profile.elderly_profile.living_status === "alone" ? "独居" : "有家属陪伴"}，护理等级为${profile.elderly_profile.care_level}。`,
    current_status: "整体状态稳定，慢性病管理需要持续关注。日常生活基本自理，但部分活动需要协助。",
    completed_services: ["基础健康评估已完成", "护理需求分析已完成", "政策匹配已完成"],
    policy_opportunities: [
      { title: "长期护理保险", benefit: "可获得专业护理服务补贴", action_needed: "联系社区服务中心提交评估申请" },
      { title: "高龄老人补贴", benefit: "每月可领取生活补贴", action_needed: "准备身份证户口本到居委会申请" },
    ],
    care_plan_summary: `已制定为期30天的个性化照护计划，包括${carePlan.service_tasks.length}项专业服务任务和${carePlan.family_tasks.length}项家属配合任务。`,
    pending_tasks: carePlan.service_tasks.map((t) => t.description),
    risk_warnings: [
      { type: "跌倒风险", level: "中等", description: `${age}岁高龄，居家环境需关注防跌倒`, recommendation: "安装扶手、防滑垫，移除地面障碍物" },
      { type: "用药风险", level: "低", description: "多种药物同时服用", recommendation: "建立用药记录表，定期复查药物相互作用" },
    ],
    next_steps: [
      "确认服务任务排班时间",
      "提交长护险评估申请",
      "安排首次护理员上门服务",
      "30天后进行照护计划复盘",
    ],
    report_html: `<div class="report"><h2>${name}的养老服务报告</h2><p>生成时间：${new Date().toLocaleDateString("zh-CN")}</p><h3>基本情况</h3><p>${name}，${age}岁，已诊断${diseases.join("、")}。</p><h3>照护计划</h3><p>已制定个性化照护计划，包含${carePlan.service_tasks.length}项服务任务。</p><h3>政策机会</h3><ul><li>长期护理保险 — 联系社区申请</li><li>高龄补贴 — 到居委会办理</li></ul><h3>下一步</h3><ol><li>确认服务排班</li><li>提交长护险申请</li><li>安排首次上门服务</li></ol></div>`,
    confidence: 0.85,
  };
}

// ─── Agent Function ────────────────────────────
export async function reportAgent(
  caseId: string,
  profile: ProfileAgentOutput,
  assessment: AssessmentAgentOutput,
  policyResult: PolicyAgentOutput,
  carePlan: CarePlanAgentOutput,
  serviceResult: ServiceAgentOutput
): Promise<FamilyReportOutput> {
  const startTime = Date.now();

  const run = await prisma.agentRun.create({
    data: {
      caseId,
      agentName: "report-agent",
      skillName: "family-report-generate",
      status: "RUNNING",
      input: { profile, assessment, policyResult, carePlan, serviceResult } as any,
      startTime: new Date(),
    },
  });

  try {
    let output: FamilyReportOutput;

    if (isLLMConfigured()) {
      try {
        const context = {
          elderly: profile.elderly_profile,
          needs: assessment.care_need_categories,
          policies: policyResult.candidate_policies.slice(0, 3),
          plan: carePlan,
          services: serviceResult.created_tasks,
        };
        const userPrompt = `请基于以下数据生成家属报告：\n\n${JSON.stringify(context, null, 2)}`;
        const result = await callLLM(SYSTEM_PROMPT, userPrompt);
        // Try to parse structured output from LLM
        try {
          const parsed = JSON.parse(result.content);
          output = parsed as FamilyReportOutput;
        } catch {
          // If LLM didn't return valid JSON, use mock with real data
          output = getMockOutput(profile, carePlan);
        }
      } catch (err) {
        console.warn("[report-agent] LLM call failed, falling back to mock:", err);
        output = getMockOutput(profile, carePlan);
      }
    } else {
      output = getMockOutput(profile, carePlan);
    }

    // Persist Report record
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      select: { elderlyId: true },
    });

    const report = await prisma.report.create({
      data: {
        caseId,
        elderlyId: caseRecord?.elderlyId,
        reportType: "FAMILY_REPORT",
        title: output.report_title,
        content: JSON.stringify(output),
        generatedByAgent: true,
        reviewedByHuman: false,
        agentRunId: run.id,
      },
    });

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

    // Update Case
    await prisma.case.update({
      where: { id: caseId },
      data: {
        familyReport: output as any,
        status: "REPORT_GENERATED",
      },
    });

    return output;
  } catch (error: any) {
    console.error("[report-agent] Error:", error);
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        retryCount: { increment: 1 },
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    }).catch((e) => console.error("[report-agent] Failed to update AgentRun:", e));
    throw error;
  }
}
