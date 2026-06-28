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

// Care records are derived from care orders' serviceReport field
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const elderId = searchParams.get("elderId");
    const recordType = searchParams.get("recordType");
    const careOrderId = searchParams.get("careOrderId");

    const orders = (mockCareOrders ?? []) as any[];

    // Extract service reports from orders as "care records"
    let records = orders
      .filter((o) => o.serviceReport)
      .map((o) => ({
        id: o.serviceReport.id,
        careOrderId: o.id,
        elderlyId: o.elderlyId,
        elderlyName: o.elderlyName,
        recordType: o.type,
        ...o.serviceReport,
      }));

    if (elderId) {
      records = records.filter((r) => r.elderlyId === elderId);
    }

    if (recordType) {
      records = records.filter((r) => r.recordType === recordType);
    }

    if (careOrderId) {
      records = records.filter((r) => r.careOrderId === careOrderId);
    }

    return apiSuccess(records);
  } catch (error) {
    return apiError("获取护理记录列表失败", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord = {
      ...body,
      id: `rec-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    return apiSuccess(newRecord);
  } catch (error) {
    return apiError("创建护理记录失败", 400);
  }
}
