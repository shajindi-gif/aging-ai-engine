import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/cases
 * List cases for the authenticated user.
 *
 * Query params:
 *  - status: CaseStatus filter
 *  - page: number (default 1)
 *  - pageSize: number (default 20)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10))
    );

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          elderly: true,
        },
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: cases,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/cases error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cases
 * Create a new case.
 *
 * Body: { elderlyId: string, title?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { elderlyId, title } = body;

    if (!elderlyId) {
      return NextResponse.json(
        { success: false, error: "elderlyId is required" },
        { status: 400 }
      );
    }

    // Validate elderly exists and belongs to user's org
    const elderly = await prisma.elderlyProfile.findUnique({
      where: { id: elderlyId },
      select: { id: true, name: true, organizationId: true, userId: true },
    });

    if (!elderly) {
      return NextResponse.json(
        { success: false, error: "Elderly profile not found" },
        { status: 404 }
      );
    }

    // Fetch user to check organizationId
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    // Verify ownership: elderly belongs to user directly or to the same org
    const belongsToUser = elderly.userId === session.user.id;
    const belongsToOrg =
      user?.organizationId &&
      elderly.organizationId &&
      user.organizationId === elderly.organizationId;

    if (!belongsToUser && !belongsToOrg) {
      return NextResponse.json(
        { success: false, error: "Elderly profile does not belong to your organization" },
        { status: 403 }
      );
    }

    const newCase = await prisma.case.create({
      data: {
        userId: session.user.id,
        elderlyId,
        title: title || `${elderly.name}的养老服务案例`,
        status: "NEW",
      },
      include: {
        elderly: true,
      },
    });

    return NextResponse.json(
      { success: true, data: newCase },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/cases error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create case" },
      { status: 500 }
    );
  }
}
