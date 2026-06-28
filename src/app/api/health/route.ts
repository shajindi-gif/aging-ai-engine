// @ts-nocheck
import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(_request: NextRequest) {
  return apiSuccess({
    status: "ok",
    version: "0.1.0",
    routes: [
      "GET  /api/health",
      "GET  /api/policies",
      "GET  /api/policies/:id",
      "POST /api/policy-match",
      "GET  /api/elders",
      "GET  /api/elders/:id",
      "POST /api/elders",
      "GET  /api/care-orders",
      "POST /api/care-orders",
      "GET  /api/care-records",
      "POST /api/care-records",
      "GET  /api/institutions",
      "GET  /api/institutions/:id",
      "GET  /api/leads",
      "POST /api/leads",
      "POST /api/agents/policy-match",
      "POST /api/agents/elder-report",
      "POST /api/agents/institution-profile",
      "POST /api/agents/risk-alert",
      "POST /api/agents/care-summary",
      "POST /api/agents/sales-followup",
    ],
  });
}
