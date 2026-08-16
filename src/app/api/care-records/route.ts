import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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

// Zod schema for creating a new service record
const createServiceRecordSchema = z.object({
  careOrderId: z.string().min(1, "careOrderId is required"),
  elderlyId: z.string().optional(),
  providerId: z.string().optional(),
  recordType: z.string().min(1, "recordType is required"),
  content: z.string().min(1, "content is required"),
  riskLevel: z.string().optional(),
  familyVisible: z.boolean().default(true),
});

/**
 * GET /api/care-records
 * List service records with filtering and pagination.
 *
 * Query params:
 *  - elderlyId: string
 *  - careOrderId: string
 *  - recordType: string
 *  - page: number (default 1)
 *  - pageSize: number (default 20)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const elderlyId = searchParams.get("elderlyId");
    const careOrderId = searchParams.get("careOrderId");
    const recordType = searchParams.get("recordType");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)),
    );

    // Build dynamic where clause
    const where: Record<string, unknown> = {};
    if (elderlyId) where.elderlyId = elderlyId;
    if (careOrderId) where.careOrderId = careOrderId;
    if (recordType) where.recordType = recordType;

    const [records, total] = await Promise.all([
      prisma.serviceRecord.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          careOrder: {
            select: {
              id: true,
              orderNo: true,
              type: true,
              elderlyName: true,
              caregiverName: true,
              scheduledAt: true,
            },
          },
        },
      }),
      prisma.serviceRecord.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: records,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/care-records error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service records" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/care-records
 * Create a new service record.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate request body with Zod
    const parsed = createServiceRecordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Verify the care order exists
    const careOrder = await prisma.careOrder.findUnique({
      where: { id: data.careOrderId },
    });
    if (!careOrder) {
      return NextResponse.json(
        { success: false, error: "Care order not found" },
        { status: 404 },
      );
    }

    const record = await prisma.serviceRecord.create({
      data: {
        careOrderId: data.careOrderId,
        elderlyId: data.elderlyId,
        providerId: data.providerId,
        recordType: data.recordType,
        content: data.content,
        riskLevel: data.riskLevel,
        familyVisible: data.familyVisible,
      },
      include: {
        careOrder: {
          select: {
            id: true,
            orderNo: true,
            type: true,
            elderlyName: true,
            caregiverName: true,
            scheduledAt: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: record },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/care-records error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service record" },
      { status: 500 },
    );
  }
}
