// ═══════════════════════════════════════════════
// SilverCare Assessment Agent
// 评估老年人护理需求，生成结构化评估报告
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callLLMStructured, isLLMConfigured } from "@/lib/llm";
import type { ProfileAgentOutput } from "./profile-agent";

// ─── Output Types ──────────────────────────────
export interface AssessmentAgentOutput {
  care_need_categories: Array<{
    category: string;
    level: "low" | "medium" | "high" | "critical";
    description: string;
    specific_needs: string[];
  }>;
  urgency: "routine" | "moderate" | "urgent" | "emergency";
  assistance_needed: {
    daily_living: boolean;
    medical_care: boolean;
    mobility_support: boolean;
    cognitive_support: boolean;
    emotional_support: boolean;
  };
  recommended_next_actions: Array<{
    action: string;
    priority: "low" | "medium" | "high";
    timeframe: string;
    responsible_party: string;
  }>;
  adl_score: number;
  summary: string;
  confidence: number;
}

// ─── System Prompt ─────────────────────────────
const SYSTEM_PROMPT = `你是一名专业的养老护理需求评估师。你的任务是基于老年人的档案信息，评估其护理需求等级和类型。

重要安全规则：
1. 绝对不要给出任何疾病诊断结论
2. 绝对不要推荐处方药物或调整用药方案
3. 不要做出超出护理评估范畴的判断
4. 所有评估结论必须基于提供的档案数据
5. 对于数据不足的部分，要明确标注置信度较低
6. 用中文输出所有分析内容

评估维度：
- 日常生活活动能力(ADL)：进食、穿衣、洗澡、如厕、转移、大小便控制
- 工具性日常生活活动(IADL)：做饭、购物、理财、出行、电话使用
- 认知功能：记忆力、定向力、判断力
- 情感和社会需求：社交、情感支持

输出要求（严格JSON格式）：
{
  "care_need_categories": [
    {
      "category": "类别名称(daily_living/medical/mobility/cognitive/emotional/social)",
      "level": "low|medium|high|critical",
      "description": "该类别的需求描述",
      "specific_needs": ["具体需求1", "具体需求2"]
    }
  ],
  "urgency": "routine|moderate|urgent|emergency",
  "assistance_needed": {
    "daily_living": true/false,
    "medical_care": true/false,
    "mobility_support": true/false,
    "cognitive_support": true/false,
    "emotional_support": true/false
  },
  "recommended_next_actions": [
    {
      "action": "建议的行动",
      "priority": "low|medium|high",
      "timeframe": "时间框架",
      "responsible_party": "负责方(family/caregiver/professional/community)"
    }
  ],
  "adl_score": 0-100的ADL评分,
  "summary": "一段话的评估总结",
  "confidence": 0.0-1.0的置信度
}`;

// ─── Mock Fallback ─────────────────────────────
function getMockOutput(profile: ProfileAgentOutput): AssessmentAgentOutput {
  const careLevel = profile.elderly_profile.care_level;
  const age = profile.elderly_profile.age;
  const hasDiseases = profile.elderly_profile.chronic_diseases.length > 0;

  const isHighNeed = careLevel === "dependent" || careLevel === "critical";
  const isMediumNeed = careLevel === "semi_dependent" || age >= 80;

  const categories: AssessmentAgentOutput["care_need_categories"] = [
    {
      category: "daily_living",
      level: isHighNeed ? "high" : isMediumNeed ? "medium" : "low",
      description: isHighNeed ? "日常生活需要较多辅助" : isMediumNeed ? "部分日常活动需要协助" : "基本可自理",
      specific_needs: isHighNeed
        ? ["协助穿衣洗澡", "辅助进食", "如厕辅助"]
        : isMediumNeed
          ? ["提醒按时服药", "协助准备餐食", "出行辅助"]
          : ["定期关怀探访"],
    },
    {
      category: "medical",
      level: hasDiseases ? "medium" : "low",
      description: hasDiseases
        ? `需管理${profile.elderly_profile.chronic_diseases.join("、")}等慢性病`
        : "暂无需特别管理的医疗需求",
      specific_needs: hasDiseases
        ? ["用药提醒与管理", "定期复查安排", "生命体征监测"]
        : ["年度健康体检"],
    },
    {
      category: "mobility",
      level: age >= 80 ? "medium" : "low",
      description: age >= 80 ? "高龄需注意跌倒预防和行动辅助" : "行动能力基本正常",
      specific_needs: age >= 80
        ? ["居家防跌倒改造", "辅助行走器具评估", "适度运动指导"]
        : ["鼓励适度户外活动"],
    },
    {
      category: "emotional",
      level: profile.elderly_profile.living_status === "alone" ? "medium" : "low",
      description: profile.elderly_profile.living_status === "alone"
        ? "独居老人需关注情感陪伴和社会参与"
        : "有家人陪伴，情感支持较好",
      specific_needs: profile.elderly_profile.living_status === "alone"
        ? ["定期探访或电话问候", "社区活动参与", "志愿者陪伴服务"]
        : ["家庭关系维护指导"],
    },
  ];

  return {
    care_need_categories: categories,
    urgency: isHighNeed ? "urgent" : isMediumNeed ? "moderate" : "routine",
    assistance_needed: {
      daily_living: isHighNeed || isMediumNeed,
      medical_care: hasDiseases,
      mobility_support: age >= 80,
      cognitive_support: careLevel === "critical",
      emotional_support: profile.elderly_profile.living_status === "alone",
    },
    recommended_next_actions: [
      {
        action: "安排护理需求正式评估",
        priority: isHighNeed ? "high" : "medium",
        timeframe: isHighNeed ? "1周内" : "2周内",
        responsible_party: "professional",
      },
      {
        action: "制定个性化护理计划",
        priority: isHighNeed ? "high" : "medium",
        timeframe: isHighNeed ? "1周内" : "1个月内",
        responsible_party: "caregiver",
      },
      {
        action: "查询适用的养老补贴政策",
        priority: "medium",
        timeframe: "1个月内",
        responsible_party: "family",
      },
      {
        action: "安排家庭医生签约或复诊",
        priority: hasDiseases ? "high" : "low",
        timeframe: hasDiseases ? "2周内" : "3个月内",
        responsible_party: "family",
      },
    ],
    adl_score: isHighNeed ? 35 : isMediumNeed ? 60 : 85,
    summary: `${profile.elderly_profile.name}，${age}岁，${profile.elderly_profile.living_status === "alone" ? "独居" : profile.elderly_profile.living_status === "with_spouse" ? "与配偶同住" : "与家人同住"}。${hasDiseases ? `患有${profile.elderly_profile.chronic_diseases.join("、")}等慢性病，需持续管理。` : "目前无已知慢性病。"}综合评估护理需求等级为${isHighNeed ? "高" : isMediumNeed ? "中等" : "低"}，建议${isHighNeed ? "尽快安排专业护理服务" : isMediumNeed ? "适度增加照护支持" : "维持当前照护方案并定期评估"}。`,
    confidence: 0.82,
  };
}

// ─── Agent Function ────────────────────────────
export async function assessmentAgent(
  caseId: string,
  elderlyId: string,
  profile: ProfileAgentOutput
): Promise<AssessmentAgentOutput> {
  const startTime = Date.now();

  const run = await prisma.agentRun.create({
    data: {
      caseId,
      agentName: "assessment-agent",
      skillName: "care-needs-assessment",
      status: "RUNNING",
      input: { elderlyId, profile_summary: profile.elderly_profile.name } as any,
      startTime: new Date(),
    },
  });

  try {
    let output: AssessmentAgentOutput;

    if (isLLMConfigured()) {
      try {
        const userPrompt = `请基于以下老年人档案画像，评估其护理需求：\n\n${JSON.stringify(profile, null, 2)}`;
        const { data } = await callLLMStructured<AssessmentAgentOutput>(SYSTEM_PROMPT, userPrompt);
        output = data;
      } catch (llmError) {
        console.warn("[assessment-agent] LLM call failed, falling back to mock:", llmError);
        output = getMockOutput(profile);
      }
    } else {
      output = getMockOutput(profile);
    }

    // Save Assessment to DB
    const assessment = await prisma.assessment.create({
      data: {
        elderlyId,
        assessmentType: "COMPREHENSIVE",
        score: output.adl_score,
        findings: output as any,
        recommendations: output.recommended_next_actions.map((a) => a.action),
        status: "COMPLETED",
        assessedAt: new Date(),
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
        assessment: output as any,
        status: "ASSESSMENT_COMPLETED",
      },
    });

    return output;
  } catch (error: any) {
    console.error("[assessment-agent] Error:", error);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        retryCount: { increment: 1 },
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    }).catch((e) => console.error("[assessment-agent] Failed to update AgentRun:", e));

    throw error;
  }
}
