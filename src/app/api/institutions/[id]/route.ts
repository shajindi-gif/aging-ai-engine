import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockInstitutions } from "@/lib/mock";

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
    const institutions = (mockInstitutions ?? []) as any[];
    const institution = institutions.find((i) => i.id === id);

    if (!institution) {
      return apiError(`机构 ${id} 未找到`, 404);
    }

    return apiSuccess(institution);
  } catch (error) {
    return apiError("获取机构详情失败", 500);
  }
}
