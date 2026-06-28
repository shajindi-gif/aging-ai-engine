// @ts-nocheck
// ═══════════════════════════════════════════════
// Legacy Agent Route — delegates to individual agent routes
// POST /api/agent — unified agent execution endpoint
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  policyMatchAgent,
  elderReportAgent,
  careSummaryAgent,
  riskAlertAgent,
  institutionProfileAgent,
  salesFollowupAgent,
} from "@/lib/agents";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, params } = body as { type: string; params: Record<string, unknown> };

    let result: unknown;

    switch (type) {
      case "policy_match":
        result = await policyMatchAgent(params);
        break;
      case "health_summary":
      case "elder_report":
        result = await elderReportAgent(params as { elderId: string });
        break;
      case "service_report":
      case "care_summary":
        result = await careSummaryAgent(params as { careOrderId: string });
        break;
      case "risk_assessment":
        result = await riskAlertAgent(params as { elderId: string });
        break;
      case "institution_recommend":
      case "institution_profile":
        result = await institutionProfileAgent(params as { institutionId: string });
        break;
      case "family_report":
      case "sales_followup":
        result = await salesFollowupAgent(params as { leadId: string });
        break;
      default:
        return NextResponse.json(
          { error: `未知的 Agent 类型: ${type}` },
          { status: 400, headers: CORS_HEADERS }
        );
    }

    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("[agent] POST error:", error);
    return NextResponse.json(
      { error: "Agent 执行失败，请稍后重试" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
