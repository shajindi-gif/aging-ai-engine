import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/cases/[id]
 * Retrieve a single case with all related data.
 *
 * Includes:
 *  - elderly profile
 *  - agentRuns (most recent 20, ordered by startTime desc)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: {
        elderly: true,
        agentRuns: {
          orderBy: { startTime: "desc" },
          take: 20,
        },
      },
    });

    if (!caseRecord) {
      return NextResponse.json(
        { success: false, error: "Case not found" },
        { status: 404 }
      );
    }

    // Verify case belongs to the authenticated user
    if (caseRecord.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: case does not belong to you" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: caseRecord,
    });
  } catch (error) {
    console.error("GET /api/cases/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch case" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cases/[id]
 * Update case status, approval, or payment.
 *
 * Body: { status?: CaseStatus, approvalStatus?: string, paymentStatus?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify case exists and belongs to user
    const existing = await prisma.case.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Case not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: case does not belong to you" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, approvalStatus, paymentStatus } = body;

    // Build update payload with only provided fields
    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (approvalStatus !== undefined) updateData.approvalStatus = approvalStatus;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.case.update({
      where: { id },
      data: updateData,
      include: {
        elderly: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/cases/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update case" },
      { status: 500 }
    );
  }
}
