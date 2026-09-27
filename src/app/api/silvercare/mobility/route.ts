// @ts-nocheck
// SilverCare 运动能力评估 API
// POST: 提交起立/步行/平衡测试 → 保存 MobilityAssessment + 计算 FallRiskScore
// GET: 查询评估历史
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { computeFallRisk } from "@/lib/silvercare/risk-engine";

async function requireSession() {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  const elderlyId = new URL(request.url).searchParams.get("elderlyId");
  if (!elderlyId) return NextResponse.json({ success: false, error: "缺少 elderlyId" }, { status: 400 });
  const list = await prisma.mobilityAssessment.findMany({
    where: { elderlyId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const latestRisk = await prisma.fallRiskScore.findFirst({
    where: { elderlyId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: { assessments: list, latestRisk } });
}

export async function POST(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  try {
    const body = await request.json();
    const elderlyId = body.elderlyId;
    const testType = String(body.testType || "").toUpperCase();
    if (!elderlyId || !["STS", "WALK", "BALANCE"].includes(testType)) {
      return NextResponse.json({ success: false, error: "参数不完整" }, { status: 400 });
    }

    const assessment = await prisma.mobilityAssessment.create({
      data: {
        elderlyId,
        testType,
        reps: body.reps != null ? Number(body.reps) : null,
        durationSec: body.durationSec != null ? Number(body.durationSec) : null,
        holdTimeSec: body.holdTimeSec != null ? Number(body.holdTimeSec) : null,
        swayScore: body.swayScore != null ? Number(body.swayScore) : null,
        notes: body.notes || null,
        source: body.source === "camera" ? "camera" : "manual",
      },
    });

    // 汇总最近一次各测试 + 问卷，计算跌倒风险
    const [sts, walk, balance, elder] = await Promise.all([
      prisma.mobilityAssessment.findFirst({ where: { elderlyId, testType: "STS" }, orderBy: { createdAt: "desc" } }),
      prisma.mobilityAssessment.findFirst({ where: { elderlyId, testType: "WALK" }, orderBy: { createdAt: "desc" } }),
      prisma.mobilityAssessment.findFirst({ where: { elderlyId, testType: "BALANCE" }, orderBy: { createdAt: "desc" } }),
      prisma.elderlyProfile.findUnique({ where: { id: elderlyId }, include: { medications: true } }),
    ]);
    if (!elder) return NextResponse.json({ success: false, error: "老人档案不存在" }, { status: 404 });

    const age = elder.birthDate ? new Date().getFullYear() - elder.birthDate.getFullYear() : 70;
    // 步行测试：默认按 4 米计时换算步速
    const gaitSpeed = walk?.durationSec ? +(4 / walk.durationSec).toFixed(2) : null;

    const risk = computeFallRisk({
      age,
      fellLast12Months: !!body.fellLast12Months,
      usesWalkingAid: !!body.usesWalkingAid,
      sitToStandSec: sts?.durationSec ?? null,
      gaitSpeed,
      balanceHoldSec: balance?.holdTimeSec ?? null,
      adlLimited: !!body.adlLimited,
      hasDizziness: !!body.hasDizziness,
      hasVisionProblem: !!body.hasVisionProblem,
      medicationCount: elder.medications?.length ?? 0,
    });

    const saved = await prisma.fallRiskScore.create({
      data: {
        elderlyId,
        assessmentId: assessment.id,
        score: risk.score,
        level: risk.level,
        frailtyLevel: risk.frailtyLevel,
        factors: risk.factors as object,
        recommendations: risk.recommendations,
      },
    });

    return NextResponse.json({ success: true, data: { assessment, risk: { ...risk, id: saved.id } } }, { status: 201 });
  } catch (error) {
    console.error("[mobility] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "评估失败，请稍后重试" }, { status: 500 });
  }
}
