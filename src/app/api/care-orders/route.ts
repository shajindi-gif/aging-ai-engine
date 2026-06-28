// @ts-nocheck
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockCareOrders } from "@/lib/mock";

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
    const status = searchParams.get("status");
    const serviceType = searchParams.get("serviceType");
    const elderId = searchParams.get("elderId");

    let filtered = (mockCareOrders ?? []) as any[];

    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }

    if (serviceType) {
      filtered = filtered.filter((o) => o.type === serviceType);
    }

    if (elderId) {
      filtered = filtered.filter((o) => o.elderlyId === elderId);
    }

    return apiSuccess(filtered);
  } catch (error) {
    return apiError("获取护理订单列表失败", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder = {
      ...body,
      id: `ord-${Date.now()}`,
      orderNo: `CO${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      status: "pending",
      familyNotified: false,
      riskEvents: [],
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(newOrder);
  } catch (error) {
    return apiError("创建护理订单失败", 400);
  }
}
