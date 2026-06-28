// @ts-nocheck
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockPolicies } from "@/lib/mock";

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
    const { region, age, careLevel, disabilityLevel, incomeLevel, applicantType } = body;

    const policies = (mockPolicies ?? []) as any[];

    // Simple scoring logic
    const scored = policies.map((p) => {
      let score = 0.5;
      if (region && (p.province === region || p.city === region || p.province === "全国")) score += 0.2;
      if (age && p.eligibility.some((e: string) => e.includes("周岁"))) {
        const match = p.eligibility.find((e: string) => e.includes("周岁"));
        const ageMatch = match?.match(/(\d+)/);
        if (ageMatch && age >= parseInt(ageMatch[1])) score += 0.15;
      }
      if (careLevel && (careLevel === "dependent" || careLevel === "critical")) score += 0.1;
      return { ...p, matchScore: Math.min(score, 0.98) };
    });

    const matched = scored
      .filter((p) => p.matchScore >= 0.6)
      .sort((a, b) => b.matchScore - a.matchScore);

    return apiSuccess({
      matches: matched,
      total: matched.length,
      query: { region, age, careLevel, disabilityLevel, incomeLevel, applicantType },
    });
  } catch (error) {
    return apiError("政策匹配失败", 500);
  }
}
