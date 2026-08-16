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

// Valid enum values for validation
const careOrderTypes = [
  "ESCORT",
  "NURSING",
  "REHABILITATION",
  "COMPANION",
  "BATHING",
  "MEAL",
  "CLEANING",
  "MEDICATION_REMINDER",
  "FOLLOWUP",
  "POST_SURGERY",
] as const;

const careOrderStatuses = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

// Zod schema for creating a new care order
const createCareOrderSchema = z.object({
  elderlyId: z.string().min(1, "elderlyId is required"),
  elderlyName: z.string().min(1, "elderlyName is required"),
  type: z.enum(careOrderTypes),
  scheduledAt: z.coerce.date(),
  caregiverId: z.string().optional(),
  caregiverName: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  price: z.number().min(0).optional(),
  organizationId: z.string().optional(),
});

/**
 * Generate a unique order number: CO + YYYYMMDD + 3-digit sequence
 */
async function generateOrderNo(): Promise<string> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = `CO${dateStr}`;

  // Find the latest order number for today to avoid collisions
  const latest = await prisma.careOrder.findFirst({
    where: { orderNo: { startsWith: prefix } },
    orderBy: { orderNo: "desc" },
    select: { orderNo: true },
  });

  let seq = 1;
  if (latest) {
    const lastSeq = parseInt(latest.orderNo.slice(prefix.length), 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }

  return `${prefix}${String(seq).padStart(3, "0")}`;
}

/**
 * GET /api/care-orders
 * List care orders with filtering and pagination.
 *
 * Query params:
 *  - status: PENDING | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED
 *  - type: CareOrderType enum value
 *  - elderlyId: string
 *  - organizationId: string
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
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const elderlyId = searchParams.get("elderlyId");
    const organizationId = searchParams.get("organizationId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)),
    );

    // Validate enum filters
    if (status && !careOrderStatuses.includes(status as any)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${careOrderStatuses.join(", ")}` },
        { status: 400 },
      );
    }
    if (type && !careOrderTypes.includes(type as any)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${careOrderTypes.join(", ")}` },
        { status: 400 },
      );
    }

    // Build dynamic where clause
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (elderlyId) where.elderlyId = elderlyId;
    if (organizationId) where.organizationId = organizationId;

    const [careOrders, total] = await Promise.all([
      prisma.careOrder.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { scheduledAt: "desc" },
        include: {
          elderly: true,
        },
      }),
      prisma.careOrder.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: careOrders,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/care-orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch care orders" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/care-orders
 * Create a new care order.
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
    const parsed = createCareOrderSchema.safeParse(body);
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
    const orderNo = await generateOrderNo();

    const careOrder = await prisma.careOrder.create({
      data: {
        orderNo,
        elderlyId: data.elderlyId,
        elderlyName: data.elderlyName,
        type: data.type,
        scheduledAt: data.scheduledAt,
        caregiverId: data.caregiverId,
        caregiverName: data.caregiverName,
        location: data.location,
        notes: data.notes,
        price: data.price ?? 0,
        organizationId: data.organizationId,
      },
      include: {
        elderly: true,
      },
    });

    return NextResponse.json(
      { success: true, data: careOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/care-orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create care order" },
      { status: 500 },
    );
  }
}
