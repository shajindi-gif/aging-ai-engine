// @ts-nocheck
// ═══════════════════════════════════════════════
// Legacy Subsidy Match Route
// POST /api/subsidy-match — delegates to policyMatchAgent
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { policyMatchAgent } from "@/lib/agents";

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
    const result = await policyMatchAgent({
      region: body.province,
      age: body.age,
      careLevel: body.careLevel,
      disabilityStatus: body.disabilityLevel,
      incomeLevel: body.income,
      livingStatus: body.householdType,
    });

    return NextResponse.json(
      {
        data: result.matchedPolicies,
        total: result.matchedPolicies.length,
        confidence: result.confidence,
        sources: result.sources,
        disclaimer: result.disclaimer,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("[subsidy-match] POST error:", error);
    return NextResponse.json(
      { error: "补贴匹配失败，请稍后重试" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
