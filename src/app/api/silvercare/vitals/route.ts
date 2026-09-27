// @ts-nocheck
// SilverCare 每日健康指标 API（Daily Health Check）
// GET ?elderlyId= : 最近 30 天指标 + 趋势 + 异常信号
// POST: 录入今日指标
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { computeTrends, detectTrendAlerts, type DailyVitals } from "@/lib/silvercare/trend-engine";

async function requireSession() {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  return null;
}

function toDailyVitals(list: any[]): DailyVitals[] {
  return list.map((m) => ({
    date: m.metricDate.toISOString().slice(0, 10),
    heartRate: m.heartRate ?? m.restingHR ?? null,
    restingHR: m.restingHR ?? null,
    systolicBP: m.systolicBP ?? null,
    diastolicBP: m.diastolicBP ?? null,
    spo2: m.spo2 ?? null,
    respiratoryRate: m.respiratoryRate ?? null,
    steps: m.steps ?? null,
    sleepHours: m.sleepHours ?? null,
    coughLevel: m.coughLevel ?? null,
    dyspneaLevel: m.dyspneaLevel ?? null,
    chestTightness: m.chestTightness ?? null,
    fatigueLevel: m.fatigueLevel ?? null,
  }));
}

const num = (v: unknown, min: number, max: number) => {
  if (v == null || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n) || n < min || n > max) return null;
  return n;
};

export async function GET(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  const elderlyId = new URL(request.url).searchParams.get("elderlyId");
  if (!elderlyId) return NextResponse.json({ success: false, error: "缺少 elderlyId" }, { status: 400 });
  const list = await prisma.chronicMetric.findMany({
    where: { elderlyId },
    orderBy: { metricDate: "desc" },
    take: 30,
  });
  const vitals = toDailyVitals(list.reverse());
  return NextResponse.json({
    success: true,
    data: {
      vitals: list,
      trends: computeTrends(vitals),
      alertSignals: detectTrendAlerts(vitals),
    },
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  try {
    const b = await request.json();
    const elderlyId = b.elderlyId;
    if (!elderlyId) return NextResponse.json({ success: false, error: "缺少 elderlyId" }, { status: 400 });

    const metric = await prisma.chronicMetric.create({
      data: {
        elderlyId,
        metricDate: b.metricDate ? new Date(b.metricDate) : new Date(),
        heartRate: num(b.heartRate, 30, 220),
        restingHR: num(b.restingHR, 30, 150),
        systolicBP: num(b.systolicBP, 60, 260),
        diastolicBP: num(b.diastolicBP, 40, 180),
        spo2: num(b.spo2, 70, 100),
        respiratoryRate: num(b.respiratoryRate, 6, 60),
        steps: num(b.steps, 0, 100000),
        sleepHours: num(b.sleepHours, 0, 24),
        coughLevel: num(b.coughLevel, 0, 10),
        dyspneaLevel: num(b.dyspneaLevel, 0, 10),
        chestTightness: num(b.chestTightness, 0, 10),
        fatigueLevel: num(b.fatigueLevel, 0, 10),
        temperature: num(b.temperature, 33, 43),
        source: b.source === "demo" ? "demo" : "manual",
        notes: b.notes || null,
      },
    });
    return NextResponse.json({ success: true, data: metric }, { status: 201 });
  } catch (error) {
    console.error("[vitals] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "录入失败，请稍后重试" }, { status: 500 });
  }
}
