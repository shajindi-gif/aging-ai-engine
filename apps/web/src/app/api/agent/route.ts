// ═══════════════════════════════════════════════
// 衍策银龄 AI — Agent 统一调度 API
// POST: 接收 { type, params },路由到对应 Agent 函数
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { executeAgent } from "@/lib/agents";
import type { AgentInput } from "@/lib/agents";

/** 支持的 Agent 类型 */
const SUPPORTED_AGENT_TYPES = [
  "policy_match",
  "health_summary",
  "service_report",
  "risk_assessment",
  "institution_recommend",
  "family_report",
] as const;

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

/** POST /api/agent — 统一 Agent 调度 */
export async function POST(request: NextRequest) {
  try {
    const body: AgentInput = await request.json();

    // 参数验证
    if (!body.type || !body.params) {
      return NextResponse.json(
        {
          error: "缺少必要参数: type 和 params 为必填项",
          supportedTypes: SUPPORTED_AGENT_TYPES,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 验证 Agent 类型
    if (!SUPPORTED_AGENT_TYPES.includes(body.type as typeof SUPPORTED_AGENT_TYPES[number])) {
      return NextResponse.json(
        {
          error: `不支持的 Agent 类型: ${body.type}`,
          supportedTypes: SUPPORTED_AGENT_TYPES,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 执行 Agent
    const result = await executeAgent(body);

    return NextResponse.json(
      {
        data: result.result,
        confidence: result.confidence,
        sources: result.sources,
        disclaimer: result.disclaimer,
        requiresHumanReview: result.requiresHumanReview,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[agent] POST error:", error);
    return NextResponse.json(
      { error: "Agent 执行失败,请稍后重试" },
      { status: 500, headers: corsHeaders }
    );
  }
}
