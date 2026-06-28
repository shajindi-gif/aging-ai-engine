// @ts-nocheck
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const institutionType = searchParams.get("institutionType");

    let filtered = (mockInstitutions ?? []) as any[];

    if (region) {
      filtered = filtered.filter(
        (i) => i.province === region || i.city === region || i.district === region
      );
    }

    if (institutionType) {
      filtered = filtered.filter((i) => i.type === institutionType);
    }

    return apiSuccess(filtered);
  } catch (error) {
    return apiError("获取机构列表失败", 500);
  }
}
