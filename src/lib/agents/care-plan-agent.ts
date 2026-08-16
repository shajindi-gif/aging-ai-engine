// ═══════════════════════════════════════════════
// SilverCare Care Plan Agent
// 基于画像+评估+政策匹配，生成结构化照护计划
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callLLMStructured, isLLMConfigured } from "@/lib/llm";
import type { ProfileAgentOutput } from "./profile-agent";
import type { AssessmentAgentOutput } from "./assessment-agent";
import type { PolicyAgentOutput } from "./policy-agent";

// ─── Output Types ──────────────────────────────
export interface CarePlanAgentOutput {
  plan_title: string;
  goals: string[];
  today_actions: Array<{
    action: string;
    responsible: string;
    notes?: string;
  }>;
  week_plan: Array<{
    day: string;
    actions: string[];
  }>;
  month_plan: Array<{
    week: number;
    focus: string;
    milestones: string[];
  }>;
  service_tasks: Array<{
    type: string;
    description: string;
    frequency: string;
    priority: "low" | "medium" | "high";
    estimated_duration: string;
  }>;
  family_tasks: Array<{
    task: string;
    frequency: string;
    responsible: string;
  }>;
  followup_plan: {
    next_review_date: string;
    review_items: string[];
    escalation_triggers: string[];
  };
  policy_applications: Array<{
    policy_title: string;
    action_required: string;
    deadline?: string;
  }>;
  confidence: number;
}

// ─── System Prompt ─────────────────────────────
const SYSTEM_PROMPT = `你是一名专业的养老照护规划师。你的任务是基于老年人的画像、需求评估和政策匹配结果，制定个性化的照护计划。

重要规则：
1. 计划必须具体可执行，不能是笼统的建议
2. 区分今日行动、7日计划、30日计划
3. 每个服务任务必须有明确的类型、频次和优先级
4. 家属任务要考虑实际可行性
5. 随访计划要有明确的复查节点和升级触发条件
6. 不得输出任何医学诊断或处方
7. 如果政策匹配结果中有可申请的项目，要纳入行动计划
8. 用中文输出所有内容

输出要求（严格JSON格式）：
{
  "plan_title": "照护计划标题",
  "goals": ["短期和长期目标列表"],
  "today_actions": [{"action":"具体行动","responsible":"负责人","notes":"备注"}],
  "week_plan": [{"day":"周一","actions":["行动列表"]}],
  "month_plan": [{"week":1,"focus":"本周重点","milestones":["里程碑"]}],
  "service_tasks": [{"type":"类型","description":"描述","frequency":"频次","priority":"优先级","estimated_duration":"预估时长"}],
  "family_tasks": [{"task":"任务","frequency":"频次","responsible":"负责人"}],
  "followup_plan": {"next_review_date":"复查日期","review_items":["复查项目"],"escalation_triggers":["升级触发条件"]},
  "policy_applications": [{"policy_title":"政策名称","action_required":"需要做的事","deadline":"截止日期"}],
  "confidence": 0.0-1.0
}`;

// ─── Mock Fallback ─────────────────────────────
function getMockOutput(profile: ProfileAgentOutput, _assessment: AssessmentAgentOutput): CarePlanAgentOutput {
  const name = profile.elderly_profile.name;
  const diseases = profile.elderly_profile.chronic_diseases;

  return {
    plan_title: `${name}的综合照护计划`,
    goals: [
      "维持现有生活自理能力",
      "稳定慢性病指标",
      "改善营养和睡眠质量",
      "预防跌倒等意外事件",
      "增强社会交往和心理健康",
    ],
    today_actions: [
      { action: "整理现有用药清单，确认用药时间和剂量", responsible: "家属", notes: "拍照记录" },
      { action: "检查家中安全隐患（地面湿滑、扶手等）", responsible: "家属" },
      { action: "预约最近一次全科体检", responsible: "家属" },
    ],
    week_plan: [
      { day: "周一", actions: ["上午：服药提醒+血压测量", "下午：30分钟散步"] },
      { day: "周二", actions: ["上午：社区日间照料中心活动", "下午：康复训练"] },
      { day: "周三", actions: ["上午：就医复查", "下午：休息+家属陪伴"] },
      { day: "周四", actions: ["上午：服药提醒+血糖测量", "下午：兴趣活动"] },
      { day: "周五", actions: ["上午：社区健康讲座", "下午：家庭聚餐"] },
      { day: "周六", actions: ["全天：家属陪伴户外活动"] },
      { day: "周日", actions: ["上午：休息", "下午：整理本周健康记录"] },
    ],
    month_plan: [
      { week: 1, focus: "建立日常照护规律", milestones: ["用药管理到位", "安全环境改造完成"] },
      { week: 2, focus: "引入社区服务资源", milestones: ["日间照料中心对接完成", "护理员首次上门服务"] },
      { week: 3, focus: "健康指标监测", milestones: ["连续2周血压/血糖记录", "完成全面体检"] },
      { week: 4, focus: "评估和调整", milestones: ["照护计划首次复盘", "确定下月重点"] },
    ],
    service_tasks: [
      { type: "护理服务", description: "居家护理员上门协助日常起居", frequency: "每周3次", priority: "high", estimated_duration: "每次2小时" },
      { type: "康复训练", description: `${diseases.length > 0 ? "针对" + diseases[0] + "的" : ""}康复运动指导`, frequency: "每周2次", priority: "medium", estimated_duration: "每次1小时" },
      { type: "陪诊服务", description: "陪同就医复查", frequency: "每月1次", priority: "medium", estimated_duration: "半天" },
      { type: "营养配餐", description: "根据慢性病定制饮食方案", frequency: "一次性", priority: "high", estimated_duration: "1次评估" },
    ],
    family_tasks: [
      { task: "每日电话/视频问候", frequency: "每日", responsible: "子女" },
      { task: "陪同就医复查", frequency: "每月1-2次", responsible: "主要家属" },
      { task: "检查用药情况", frequency: "每周", responsible: "家属" },
      { task: "整理健康记录", frequency: "每月", responsible: "家属" },
    ],
    followup_plan: {
      next_review_date: "30天后",
      review_items: ["慢性病指标变化", "服务任务完成情况", "跌倒/意外事件", "心理状态评估"],
      escalation_triggers: ["血压持续偏高", "跌倒事件", "用药不良反应", "情绪明显低落"],
    },
    policy_applications: [
      { policy_title: "长护险评估申请", action_required: "联系社区服务中心提交评估申请", deadline: "30天内" },
      { policy_title: "高龄补贴", action_required: "准备身份证、户口本到居委会申请" },
    ],
    confidence: 0.82,
  };
}

// ─── Agent Function ────────────────────────────
export async function carePlanAgent(
  caseId: string,
  profile: ProfileAgentOutput,
  assessment: AssessmentAgentOutput,
  policyResult: PolicyAgentOutput
): Promise<CarePlanAgentOutput> {
  const startTime = Date.now();

  const run = await prisma.agentRun.create({
    data: {
      caseId,
      agentName: "care-plan-agent",
      skillName: "care-plan-generate",
      status: "RUNNING",
      input: { profile, assessment, policyResult } as any,
      startTime: new Date(),
    },
  });

  try {
    const context = {
      elderly_profile: profile.elderly_profile,
      major_needs: profile.major_needs,
      risk_flags: profile.risk_flags,
      care_needs: assessment.care_need_categories,
      urgency: assessment.urgency,
      assistance_needed: assessment.assistance_needed,
      adl_score: assessment.adl_score,
      matched_policies: policyResult.candidate_policies.slice(0, 5),
    };

    const userPrompt = `请基于以下信息为老年人制定个性化照护计划：\n\n${JSON.stringify(context, null, 2)}`;

    let output: CarePlanAgentOutput;

    if (isLLMConfigured()) {
      try {
        const { data } = await callLLMStructured<CarePlanAgentOutput>(SYSTEM_PROMPT, userPrompt);
        output = data;
      } catch (err) {
        console.warn("[care-plan-agent] LLM call failed, falling back to mock:", err);
        output = getMockOutput(profile, assessment);
      }
    } else {
      output = getMockOutput(profile, assessment);
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

    // Persist CarePlan record
    const elderly = await prisma.elderlyProfile.findFirst({
      where: { name: profile.elderly_profile.name },
      select: { id: true },
    });

    if (elderly) {
      await prisma.carePlan.create({
        data: {
          elderlyId: elderly.id,
          title: output.plan_title,
          goals: output.goals,
          interventions: output.service_tasks as any,
          todayActions: output.today_actions.map((a) => a.action),
          weekPlan: output.week_plan as any,
          monthPlan: output.month_plan as any,
          startDate: new Date(),
          status: "ACTIVE",
          createdBy: "care-plan-agent",
        },
      });
    }

    // Update Case
    await prisma.case.update({
      where: { id: caseId },
      data: {
        carePlan: output as any,
        status: "PLAN_GENERATED",
      },
    });

    return output;
  } catch (error: any) {
    console.error("[care-plan-agent] Error:", error);
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        retryCount: { increment: 1 },
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    }).catch((e) => console.error("[care-plan-agent] Failed to update AgentRun:", e));
    throw error;
  }
}
