// @ts-nocheck
// ═══════════════════════════════════════════════
// 衍策银龄 AI — 健康档案 API (Prisma)
// GET: 获取老人健康档案,支持 ?id=X 获取单个
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const elderly = await prisma.elderlyProfile.findUnique({
        where: { id },
        include: {
          healthSummary: true,
          medications: { orderBy: { startDate: "desc" }, take: 10 },
          visitRecords: { orderBy: { date: "desc" }, take: 10 },
          riskFlags: { where: { resolvedAt: null }, take: 10 },
          familyMembers: true,
          emergencyContact: true,
          chronicMetrics: { orderBy: { metricDate: "desc" }, take: 20 },
          medicationReminders: { where: { status: "ACTIVE" }, take: 10 },
        },
      });

      if (!elderly) {
        return NextResponse.json(
          { success: false, error: "未找到该老人档案" },
          { status: 404, headers: corsHeaders }
        );
      }

      return NextResponse.json(
        { success: true, data: elderly },
        { headers: corsHeaders }
      );
    }

    // List all elders with health summary
    const elders = await prisma.elderlyProfile.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        healthSummary: true,
        emergencyContact: true,
      },
    });

    return NextResponse.json(
      { success: true, data: elders, total: elders.length },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[health-records] GET error:", error);
    return NextResponse.json(
      { success: false, error: "获取健康档案失败" },
      { status: 500, headers: corsHeaders }
    );
  }
}
