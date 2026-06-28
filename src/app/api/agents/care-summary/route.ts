import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { careSummaryAgent } from "@/lib/agents";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await careSummaryAgent(body);

    return apiSuccess(result, {
      humanReviewRequired: result.humanReviewRequired,
    });
  } catch (error) {
    return apiError("护理总结 Agent 执行失败", 500);
  }
}
