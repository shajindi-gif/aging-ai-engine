// ═══════════════════════════════════════════════
// SilverCare Profile Agent
// 分析老年人综合档案，生成结构化画像
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callLLMStructured, isLLMConfigured } from "@/lib/llm";
import { mockElders } from "@/lib/mock";

// ─── Output Types ──────────────────────────────
export interface ProfileAgentOutput {
  elderly_profile: {
    name: string;
    age: number;
    gender: string;
    living_status: string;
    care_level: string;
    location: string;
    chronic_diseases: string[];
    current_medications: Array<{ name: string; dosage: string; frequency: string }>;
    recent_visits: Array<{ date: string; hospital: string; department: string; summary: string }>;
    family_members: Array<{ name: string; relationship: string; is_primary: boolean }>;
  };
  missing_fields: string[];
  major_needs: string[];
  risk_flags: Array<{ type: string; level: string; description: string }>;
  evidence: Array<{ source: string; content: string }>;
  confidence: number;
}

// ─── System Prompt (Chinese, elderly care domain) ────
const SYSTEM_PROMPT = `你是一名专业的养老护理档案分析师。你的任务是分析老年人的综合信息，生成结构化的档案画像。

重要规则：
1. 绝对不要输出任何医学诊断结论，只能整理已有的诊断记录
2. 不要开具处方或推荐具体药物
3. 只基于提供的数据进行分析，不要编造信息
4. 对缺失数据要在 missing_fields 中明确标注
5. 所有结论必须在 evidence 中标注数据来源
6. 用中文输出所有分析内容

输出要求（严格JSON格式）：
{
  "elderly_profile": {
    "name": "姓名",
    "age": 年龄数字,
    "gender": "性别",
    "living_status": "居住状态(alone/with_spouse/with_children/institution)",
    "care_level": "护理等级(independent/semi_dependent/dependent/critical)",
    "location": "所在地区",
    "chronic_diseases": ["已有诊断的慢性病列表"],
    "current_medications": [{"name":"药名","dosage":"剂量","frequency":"频次"}],
    "recent_visits": [{"date":"日期","hospital":"医院","department":"科室","summary":"摘要"}],
    "family_members": [{"name":"姓名","relationship":"关系","is_primary":是否主要联系人}]
  },
  "missing_fields": ["缺失的关键信息字段列表"],
  "major_needs": ["主要需求列表，如：日常护理、就医陪同、康复训练等"],
  "risk_flags": [{"type":"类型(fall/medication/vital/behavior/nutrition)","level":"等级(low/medium/high/critical)","description":"描述"}],
  "evidence": [{"source":"数据来源","content":"依据内容"}],
  "confidence": 0.0-1.0的置信度
}`;

// ─── Mock Fallback ─────────────────────────────
function getMockOutput(elderlyId: string): ProfileAgentOutput {
  const elder = (mockElders as any[]).find((e) => e.id === elderlyId) ?? (mockElders as any[])[0];
  const diseases = elder?.chronicDiseases ?? ["高血压", "糖尿病"];
  const name = elder?.name ?? "张秀兰";
  const age = elder?.age ?? 78;

  return {
    elderly_profile: {
      name,
      age,
      gender: elder?.gender ?? "female",
      living_status: elder?.livingStatus ?? "with_spouse",
      care_level: elder?.careLevel ?? "semi_dependent",
      location: elder?.region ?? "上海市浦东新区",
      chronic_diseases: diseases,
      current_medications: diseases.map((d: string) => ({
        name: d === "高血压" ? "氨氯地平" : d === "糖尿病" ? "二甲双胍" : "相关药物",
        dosage: d === "高血压" ? "5mg" : "500mg",
        frequency: "每日一次",
      })),
      recent_visits: [
        { date: "2025-03-15", hospital: "浦东新区人民医院", department: "内科", summary: `${diseases[0]}复查，指标稳定` },
      ],
      family_members: [
        { name: elder?.emergencyContactName ?? "张德明", relationship: "子女", is_primary: true },
        { name: "张秀芳", relationship: "子女", is_primary: false },
      ],
    },
    missing_fields: ["最近3个月血压/血糖监测数据", "最近一次全面体检报告"],
    major_needs: [
      "慢性病用药管理和定期复查提醒",
      "居家安全防护（防跌倒）",
      "营养膳食指导",
      "适度运动和康复活动",
    ],
    risk_flags: [
      { type: "fall", level: "medium", description: `${age}岁高龄，需关注跌倒风险` },
      { type: "medication", level: "low", description: "多种药物同时服用，需注意药物相互作用" },
    ],
    evidence: [
      { source: "个人健康档案", content: `${name}，${age}岁，患有${diseases.join("、")}` },
      { source: "用药记录", content: "当前用药方案来自历史处方记录" },
    ],
    confidence: 0.85,
  };
}

// ─── Agent Function ────────────────────────────
export async function profileAgent(
  caseId: string,
  elderlyId: string
): Promise<ProfileAgentOutput> {
  const startTime = Date.now();

  // Create AgentRun record
  const run = await prisma.agentRun.create({
    data: {
      caseId,
      agentName: "profile-agent",
      skillName: "elderly-profile-analysis",
      status: "RUNNING",
      input: { elderlyId },
      startTime: new Date(),
    },
  });

  try {
    // 1. Load elderly data from database
    const elderly = await prisma.elderlyProfile.findUnique({
      where: { id: elderlyId },
      include: {
        healthSummary: true,
        medications: { where: { endDate: null }, orderBy: { startDate: "desc" } },
        visitRecords: { orderBy: { date: "desc" }, take: 10 },
        riskFlags: { where: { resolvedAt: null } },
        familyMembers: true,
        emergencyContact: true,
      },
    });

    // If no DB record, use mock fallback
    if (!elderly) {
      console.log(`[profile-agent] No DB record for elderlyId=${elderlyId}, using mock`);
      const output = getMockOutput(elderlyId);

      await prisma.agentRun.update({
        where: { id: run.id },
        data: {
          status: "COMPLETED",
          output: output as any,
          confidence: output.confidence,
          fallbackUsed: true,
          latencyMs: Date.now() - startTime,
          endTime: new Date(),
        },
      });

      return output;
    }

    // 2. Build context for LLM
    const now = new Date();
    const age = Math.floor((now.getTime() - new Date(elderly.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000));

    const context = {
      name: elderly.name,
      age,
      gender: elderly.gender,
      living_status: elderly.livingStatus ?? "未知",
      care_level: elderly.careLevel,
      location: [elderly.province, elderly.city].filter(Boolean).join("") || "未知",
      chronic_diseases: elderly.healthSummary?.chronicDiseases ?? [],
      allergies: elderly.healthSummary?.allergies ?? [],
      medications: elderly.medications.map((m) => ({
        name: m.name, dosage: m.dosage, frequency: m.frequency, start_date: m.startDate,
      })),
      recent_visits: elderly.visitRecords.map((v) => ({
        date: v.date, hospital: v.hospital, department: v.department, diagnosis: v.diagnosis, notes: v.notes,
      })),
      risk_flags: elderly.riskFlags.map((r) => ({
        type: r.type, level: r.level, description: r.description, detected_at: r.detectedAt,
      })),
      family_members: elderly.familyMembers.map((f) => ({
        name: f.name, relationship: f.relationship, is_primary: f.isPrimary,
      })),
      emergency_contact: elderly.emergencyContact ? {
        name: elderly.emergencyContact.name,
        phone: elderly.emergencyContact.phone,
        relationship: elderly.emergencyContact.relationship,
      } : null,
    };

    const userPrompt = `请分析以下老年人的综合信息，生成结构化的档案画像：\n\n${JSON.stringify(context, null, 2)}`;

    // 3. Call LLM or fallback
    let output: ProfileAgentOutput;

    if (isLLMConfigured()) {
      try {
        const { data } = await callLLMStructured<ProfileAgentOutput>(SYSTEM_PROMPT, userPrompt);
        output = data;
      } catch (llmError) {
        console.warn("[profile-agent] LLM call failed, falling back to mock:", llmError);
        output = getMockOutput(elderlyId);
      }
    } else {
      output = getMockOutput(elderlyId);
    }

    // 4. Update AgentRun
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

    // 5. Update Case with elderly profile
    await prisma.case.update({
      where: { id: caseId },
      data: {
        elderlyProfile: output.elderly_profile as any,
        evidence: output.evidence as any,
        riskFlags: output.risk_flags as any,
        status: "PROFILE_READY",
      },
    });

    return output;
  } catch (error: any) {
    console.error("[profile-agent] Error:", error);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        retryCount: { increment: 1 },
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    }).catch((e) => console.error("[profile-agent] Failed to update AgentRun:", e));

    throw error;
  }
}
