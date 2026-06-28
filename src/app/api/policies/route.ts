// @ts-nocheck
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockPolicies } from "@/lib/mock";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const policyType = searchParams.get("policyType");
    const keyword = searchParams.get("keyword");

    let filtered = (mockPolicies ?? []) as any[];

    if (region) {
      filtered = filtered.filter(
        (p) => p.province === region || p.city === region || p.province === "全国"
      );
    }

    if (policyType) {
      filtered = filtered.filter((p) => p.category === policyType);
    }

    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.summary.toLowerCase().includes(kw) ||
          (p.tags ?? []).some((t: string) => t.toLowerCase().includes(kw))
      );
    }

    return apiSuccess(filtered, { source: "mock" });
  } catch (error) {
    return apiError("获取政策列表失败", 500);
  }
}
