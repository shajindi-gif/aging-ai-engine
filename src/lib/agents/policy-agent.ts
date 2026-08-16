// ═══════════════════════════════════════════════
// SilverCare Policy Agent
// RAG 政策匹配引擎 — 搜索适用政策并排序
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callLLMStructured, isLLMConfigured } from "@/lib/llm";
import { mockPolicies } from "@/lib/mock";
import type { ProfileAgentOutput } from "./profile-agent";
import type { AssessmentAgentOutput } from "./assessment-agent";

// ─── Output Types ──────────────────────────────
export interface CandidatePolicy {
  policy_id: string;
  title: string;
  category: string;
  level: string;
  match_score: number;
  eligibility_conditions: string[];
  match_reason: string;
  estimated_benefit: string;
  required_documents: string[];
  application_process: string[];
  source: string;
  citation: string;
  confidence: number;
}

export interface PolicyAgentOutput {
  candidate_policies: CandidatePolicy[];
  total_matched: number;
  search_strategy: string;
  missing_materials: string[];
  policy_disclaimer: string;
  confidence: number;
}

// ─── System Prompt ─────────────────────────────
const SYSTEM_PROMPT = `你是一名专业的养老政策分析师。你的任务是根据老年人的档案和护理评估，搜索并匹配适用的养老政策和补贴项目。

重要规则：
1. 所有政策结论必须有明确的来源引用（source + citation）
2. 不得编造不存在的政策，如果信息不足要明确说明
3. 匹配分数要基于真实的资格条件计算，不要虚高
4. 对每个政策的资格判断要保守，宁可标注"待确认"也不要给出错误承诺
5. 必须列出申请所需材料和流程
6. 用中文输出

政策匹配逻辑：
- 年龄匹配：核对政策年龄要求与老人实际年龄
- 地域匹配：核对政策适用地区与老人所在地
- 失能等级匹配：核对护理等级要求
- 收入条件匹配：如有收入限制要标注
- 户籍要求：核对是否需要本地户籍

输出要求（严格JSON格式）：
{
  "candidate_policies": [
    {
      "policy_id": "政策ID",
      "title": "政策名称",
      "category": "类别(subsidy/insurance/service/housing/medical/training/smart_aging)",
      "level": "级别(national/provincial/municipal/district)",
      "match_score": 0.0-1.0匹配度,
      "eligibility_conditions": ["资格条件1", "资格条件2"],
      "match_reason": "匹配原因说明",
      "estimated_benefit": "预估可享受待遇",
      "required_documents": ["所需材料1", "所需材料2"],
      "application_process": ["流程步骤1", "流程步骤2"],
      "source": "政策来源（如：民政部文件）",
      "citation": "具体文件名称和条款",
      "confidence": 0.0-1.0置信度
    }
  ],
  "total_matched": 匹配总数,
  "search_strategy": "搜索策略说明",
  "missing_materials": ["可能需要补充的材料"],
  "policy_disclaimer": "政策匹配结果仅供参考，具体以当地主管部门审核为准",
  "confidence": 0.0-1.0整体置信度
}`;

// ─── Mock policy matching (rule-based) ─────────
function mockPolicyMatch(
  profile: ProfileAgentOutput,
  _assessment: AssessmentAgentOutput
): PolicyAgentOutput {
  const policies = (mockPolicies ?? []) as any[];
  const location = profile.elderly_profile.location;
  const age = profile.elderly_profile.age;
  const careLevel = profile.elderly_profile.care_level;
  const matched: CandidatePolicy[] = [];

  // Extract city from location string (e.g. "上海市浦东新区" -> "上海")
  const cityMatch = location.match(/^(.+?[市省])/);
  const city = cityMatch ? cityMatch[1].replace(/[市省]$/, "") : "";

  for (const p of policies) {
    let score = 0.3;
    const reasons: string[] = [];

    // Region match
    if (p.region === "全国" || p.province === location || p.province?.includes(city) || p.city?.includes(city)) {
      score += 0.25;
      reasons.push(`适用于${location}地区`);
    } else {
      continue; // Skip policies not applicable to the region
    }

    // Age match
    const ageElig = p.eligibility?.find((e: string) => e.includes("周岁"));
    const ageMatch = ageElig?.match(/(\d+)/);
    if (ageMatch && age >= parseInt(ageMatch[1])) {
      score += 0.15;
      reasons.push(`年龄${age}岁满足${ageMatch[1]}周岁以上要求`);
    }

    // Care level match
    if ((careLevel === "dependent" || careLevel === "critical") && (p.category === "insurance" || p.category === "subsidy")) {
      score += 0.1;
      reasons.push("护理等级符合失能相关要求");
    }

    if (score >= 0.55) {
      matched.push({
        policy_id: p.id,
        title: p.title,
        category: p.category ?? "service",
        level: p.level ?? "municipal",
        match_score: Math.min(score, 0.95),
        eligibility_conditions: p.eligibility ?? [],
        match_reason: reasons.join("；"),
        estimated_benefit: p.benefits ?? "以实际审核为准",
        required_documents: p.materials?.split("、") ?? ["身份证", "户口簿"],
        application_process: p.process?.split("→") ?? ["向社区提交申请", "等待审核"],
        source: p.department ?? "民政部门",
        citation: p.title,
        confidence: 0.8,
      });
    }
  }

  // Sort by match score descending
  matched.sort((a, b) => b.match_score - a.match_score);

  return {
    candidate_policies: matched.slice(0, 8),
    total_matched: matched.length,
    search_strategy: `基于地域(${location})、年龄(${age}岁)、护理等级(${careLevel})进行规则匹配`,
    missing_materials: ["收入证明", "失能评估报告（如适用）", "房产证或租赁合同（如申请适老化改造）"],
    policy_disclaimer: "政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。",
    confidence: 0.78,
  };
}

// ─── Agent Function ────────────────────────────
export async function policyAgent(
  caseId: string,
  profile: ProfileAgentOutput,
  assessment: AssessmentAgentOutput
): Promise<PolicyAgentOutput> {
  const startTime = Date.now();

  const run = await prisma.agentRun.create({
    data: {
      caseId,
      agentName: "policy-agent",
      skillName: "policy-rag-matching",
      status: "RUNNING",
      input: { profile_name: profile.elderly_profile.name, assessment_urgency: assessment.urgency } as any,
      startTime: new Date(),
    },
  });

  try {
    let output: PolicyAgentOutput;

    // 1. Try querying policies from DB
    const location = profile.elderly_profile.location;
    const cityMatch = location.match(/^(.+?[市省])/);
    const city = cityMatch ? cityMatch[1].replace(/[市省]$/, "") : "";

    const dbPolicies = await prisma.policy.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { province: "全国" },
          { province: { contains: city } },
          { city: { contains: city } },
        ],
      },
      take: 30,
    });

    if (isLLMConfigured() && dbPolicies.length > 0) {
      try {
        const policyContext = {
          elderly: {
            name: profile.elderly_profile.name,
            age: profile.elderly_profile.age,
            location: profile.elderly_profile.location,
            care_level: profile.elderly_profile.care_level,
            living_status: profile.elderly_profile.living_status,
            chronic_diseases: profile.elderly_profile.chronic_diseases,
          },
          assessment: {
            urgency: assessment.urgency,
            care_categories: assessment.care_need_categories.map((c) => c.category),
            adl_score: assessment.adl_score,
          },
          available_policies: dbPolicies.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            level: p.level,
            province: p.province,
            city: p.city,
            summary: p.summary,
            eligibility: p.eligibility,
            benefits: p.benefits,
            requiredDocuments: p.requiredDocuments,
            applicationProcess: p.applicationProcess,
            tags: p.tags,
          })),
        };

        const userPrompt = `请基于以下老年人信息和可用政策列表，匹配最适用的养老政策：\n\n${JSON.stringify(policyContext, null, 2)}`;
        const { data } = await callLLMStructured<PolicyAgentOutput>(SYSTEM_PROMPT, userPrompt);
        output = data;
      } catch (llmError) {
        console.warn("[policy-agent] LLM call failed, falling back to rule-based matching:", llmError);
        output = mockPolicyMatch(profile, assessment);
      }
    } else {
      // Fallback to mock data matching
      output = mockPolicyMatch(profile, assessment);
    }

    // Update AgentRun
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        output: output as any,
        confidence: output.confidence,
        fallbackUsed: !isLLMConfigured() || dbPolicies.length === 0,
        retrievedSources: output.candidate_policies.map((p) => p.citation),
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    });

    // Update Case
    await prisma.case.update({
      where: { id: caseId },
      data: {
        policyMatches: output as any,
        status: "POLICY_MATCHED",
      },
    });

    return output;
  } catch (error: any) {
    console.error("[policy-agent] Error:", error);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        retryCount: { increment: 1 },
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    }).catch((e) => console.error("[policy-agent] Failed to update AgentRun:", e));

    throw error;
  }
}
