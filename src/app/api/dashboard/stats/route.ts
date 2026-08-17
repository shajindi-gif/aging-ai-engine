// @ts-nocheck
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

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
    const session = await auth();
    if (!session) return apiError("Unauthorized", 401);

    const [
      totalElderly,
      activeOrders,
      riskAlerts,
      totalOrders,
      completedOrders,
      pendingOrders,
      inProgressOrders,
      revenue,
    ] = await Promise.all([
      prisma.elderlyProfile.count(),
      prisma.careOrder.count({ where: { status: { in: ["CONFIRMED", "IN_PROGRESS"] } } }),
      prisma.riskFlag.count({ where: { resolvedAt: null } }),
      prisma.careOrder.count(),
      prisma.careOrder.count({ where: { status: "COMPLETED" } }),
      prisma.careOrder.count({ where: { status: "PENDING" } }),
      prisma.careOrder.count({ where: { status: "IN_PROGRESS" } }),
      prisma.careOrder.aggregate({ _sum: { price: true }, where: { status: "COMPLETED" } }),
    ]);

    const stats = {
      totalElderly,
      activeOrders,
      riskAlerts,
      revenueThisMonth: revenue._sum.price ?? 0,
      totalOrders,
      completedOrders,
      pendingOrders,
      inProgressOrders,
    };

    return apiSuccess(stats, { source: "database" });
  } catch (error) {
    console.error("[dashboard/stats] error:", error);
    return apiError("获取统计数据失败", 500);
  }
}
