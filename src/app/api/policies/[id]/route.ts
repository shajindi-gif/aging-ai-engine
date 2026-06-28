import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockPolicies } from "@/lib/mock";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const policies = (mockPolicies ?? []) as any[];
    const policy = policies.find((p) => p.id === id);

    if (!policy) {
      return apiError(`政策 ${id} 未找到`, 404);
    }

    return apiSuccess(policy);
  } catch (error) {
    return apiError("获取政策详情失败", 500);
  }
}
