import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/elders/[id]
 * Retrieve a single elderly profile with all related data.
 *
 * Includes:
 *  - healthSummary
 *  - medications (active only — endDate is null)
 *  - visitRecords (most recent 10)
 *  - riskFlags (unresolved — resolvedAt is null)
 *  - familyMembers
 *  - emergencyContact
 *  - careOrders (most recent 5)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;

    const elder = await prisma.elderlyProfile.findUnique({
      where: { id },
      include: {
        healthSummary: true,
        medications: {
          where: { endDate: null },
          orderBy: { startDate: "desc" },
        },
        visitRecords: {
          orderBy: { date: "desc" },
          take: 10,
        },
        riskFlags: {
          where: { resolvedAt: null },
          orderBy: { detectedAt: "desc" },
        },
        familyMembers: true,
        emergencyContact: true,
        careOrders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!elder) {
      return apiError(`Elder ${id} not found`, 404);
    }

    return apiSuccess(elder, { source: "database" });
  } catch (error) {
    console.error("GET /api/elders/[id] error:", error);
    return apiError("Failed to fetch elder details", 500);
  }
}
