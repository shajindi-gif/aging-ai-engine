import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { institutionProfileAgent } from "@/lib/agents";

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
    const result = await institutionProfileAgent(body);

    return apiSuccess(result);
  } catch (error) {
    return apiError("机构画像 Agent 执行失败", 500);
  }
}
