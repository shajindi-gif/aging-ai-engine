// @ts-nocheck
// ═══════════════════════════════════════════════
// 衍策银龄 AI — 政策匹配 API (Prisma)
// POST: 根据用户条件匹配政策
// ═══════════════════════════════════════════════

import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import prisma from "@/lib/db";

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

    // Fetch active policies from DB
    const where: Record<string, unknown> = {
      status: "ACTIVE",
    };
    if (region) {
      where.OR = [
        { province: region },
        { city: region },
        { province: "全国" },
      ];
    }

    const policies = await prisma.policy.findMany({
      where,
      orderBy: { publishDate: "desc" },
      take: 100,
    });

    // Score-based matching
    const scored = policies.map((p: any) => {
      let score = 0.5;

      // Region match
      if (region) {
        if (p.province === region || p.city === region) score += 0.2;
        if (p.province === "全国") score += 0.15;
      }

      // Age match
      if (age && p.eligibilityCriteria) {
        const criteria = Array.isArray(p.eligibilityCriteria) ? p.eligibilityCriteria : [];
        const ageMatch = criteria.find((e: string) => e.includes("周岁"))?.match(/(\d+)/);
        if (ageMatch && age >= parseInt(ageMatch[1])) score += 0.15;
      }

      // Care level match
      if (careLevel && (careLevel === "DEPENDENT" || careLevel === "CRITICAL" || careLevel === "dependent" || careLevel === "critical")) {
        score += 0.1;
      }

      // Disability level match
      if (disabilityLevel && (disabilityLevel === "重度" || disabilityLevel === "severe")) {
        score += 0.1;
      }

      return { ...p, matchScore: Math.min(score, 0.98) };
    });

    const matched = scored
      .filter((p) => p.matchScore >= 0.6)
      .sort((a, b) => b.matchScore - a.matchScore);

    return apiSuccess({
      matches: matched,
      total: matched.length,
      query: { region, age, careLevel, disabilityLevel, incomeLevel, applicantType },
    }, { source: "database" });
  } catch (error) {
    console.error("[policy-match] error:", error);
    return apiError("政策匹配失败", 500);
  }
}
