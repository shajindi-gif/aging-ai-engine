// ═══════════════════════════════════════════════
// 衍策银龄 AI — 补贴匹配 API
// POST: 接收 SubsidyMatchRequest,通过 policyMatchAgent 返回匹配结果
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { policyMatchAgent } from "@/lib/agents";
import type { SubsidyMatchRequest } from "@/lib/types";

/** CORS 通用响应头 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/** 处理 OPTIONS 预检请求 */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/** POST /api/subsidy-match — 补贴匹配 */
export async function POST(request: NextRequest) {
  try {
    const body: SubsidyMatchRequest = await request.json();

    // 参数验证
    if (!body.province || !body.age) {
      return NextResponse.json(
        { error: "缺少必要参数: province 和 age 为必填项" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 调用政策匹配 Agent
    const agentResult = await policyMatchAgent({
      age: body.age,
      province: body.province,
      city: body.city,
      careLevel: body.careLevel,
      disabilityLevel: body.disabilityLevel,
      specialConditions: body.specialConditions,
      income: body.income,
      householdType: body.householdType,
    });

    // 将 Agent 结果转化为 SubsidyMatchResult 格式
    const matches = (agentResult.result as { matches: unknown[] }).matches;

    return NextResponse.json(
      {
        data: matches,
        confidence: agentResult.confidence,
        sources: agentResult.sources,
        disclaimer: agentResult.disclaimer,
        requiresHumanReview: agentResult.requiresHumanReview,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[subsidy-match] POST error:", error);
    return NextResponse.json(
      { error: "补贴匹配失败,请稍后重试" },
      { status: 500, headers: corsHeaders }
    );
  }
}
