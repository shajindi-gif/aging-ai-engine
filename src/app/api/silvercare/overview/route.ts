// @ts-nocheck
// SilverCare 总览 API — 家属端 / 机构端一次拉取全部老人概览
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { computeTrends, detectTrendAlerts, type DailyVitals } from "@/lib/silvercare/trend-engine";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const elders = await prisma.elderlyProfile.findMany({
      orderBy: { createdAt: "asc" },
      take: 200,
      include: { medications: true },
    });
    const today = new Date().toISOString().slice(0, 10);

    const items = await Promise.all(
      elders.map(async (e) => {
        const [metrics, risk, run, openAlerts, todayTasks] = await Promise.all([
          prisma.chronicMetric.findMany({ where: { elderlyId: e.id }, orderBy: { metricDate: "desc" }, take: 30 }),
          prisma.fallRiskScore.findFirst({ where: { elderlyId: e.id }, orderBy: { createdAt: "desc" } }),
          prisma.careAgentRun.findFirst({ where: { elderlyId: e.id }, orderBy: { createdAt: "desc" } }),
          prisma.healthAlert.findMany({ where: { elderlyId: e.id, status: "OPEN" }, orderBy: { createdAt: "desc" }, take: 5 }),
          prisma.careTask.findMany({ where: { elderlyId: e.id, scheduledTime: { gte: new Date(today), lt: new Date(today + "T23:59:59") } } }),
        ]);

        const vitals: DailyVitals[] = metrics.map((m) => ({
          date: m.metricDate.toISOString().slice(0, 10),
          heartRate: m.heartRate ?? m.restingHR ?? null,
          systolicBP: m.systolicBP ?? null,
          diastolicBP: m.diastolicBP ?? null,
          spo2: m.spo2 ?? null,
          respiratoryRate: m.respiratoryRate ?? null,
          steps: m.steps ?? null,
          sleepHours: m.sleepHours ?? null,
          dyspneaLevel: m.dyspneaLevel ?? null,
        })).reverse();

        const signals = detectTrendAlerts(vitals);
        const highSignal = signals.some((s) => s.level >= 3);
        const moderateSignal = signals.some((s) => s.level === 2);
        const overall = highSignal ? "concern" : moderateSignal || risk?.level === "HIGH" ? "attention" : "stable";

        return {
          id: e.id,
          name: e.name,
          gender: e.gender,
          birthDate: e.birthDate,
          age: e.birthDate ? new Date().getFullYear() - e.birthDate.getFullYear() : null,
          livingStatus: e.livingStatus,
          careLevel: e.careLevel,
          medicationCount: e.medications.length,
          latestVitals: metrics[0] ?? null,
          latestVitalsAt: metrics[0]?.metricDate ?? null,
          fallRisk: risk ? { score: risk.score, level: risk.level, frailtyLevel: risk.frailtyLevel, at: risk.createdAt } : null,
          trendSignals: signals,
          overallStatus: overall,
          latestAgentSummary: run?.output?.summary ?? null,
          latestAgentAt: run?.createdAt ?? null,
          openAlerts,
          todayTasks: {
            total: todayTasks.length,
            completed: todayTasks.filter((t) => t.status === "COMPLETED").length,
            missed: todayTasks.filter((t) => t.status === "MISSED").length,
            list: todayTasks.slice(0, 10),
          },
          trend7d: computeTrends(vitals).d7,
        };
      })
    );

    // 按综合状态排序：concern > attention > stable
    const order = { concern: 0, attention: 1, stable: 2 };
    items.sort((a, b) => (order[a.overallStatus] ?? 3) - (order[b.overallStatus] ?? 3));

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("[overview] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "加载总览失败" }, { status: 500 });
  }
}
