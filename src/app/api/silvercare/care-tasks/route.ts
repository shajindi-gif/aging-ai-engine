// @ts-nocheck
// SilverCare 照护任务 API
// GET ?elderlyId=&status= : 任务列表
// POST: 创建任务
// PATCH: 更新状态（完成/取消/漏做）
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

const TYPES = ["VITALS_BP", "VITALS_SPO2", "MEDICATION", "REHAB", "WALK", "WATER", "CLINIC", "FOLLOWUP", "FAMILY_CONTACT", "CAREGIVER_VISIT", "OTHER"];
const STATUSES = ["PENDING", "COMPLETED", "MISSED", "CANCELLED"];

async function requireSession() {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  const sp = new URL(request.url).searchParams;
  const elderlyId = sp.get("elderlyId");
  const status = sp.get("status");
  if (!elderlyId) return NextResponse.json({ success: false, error: "缺少 elderlyId" }, { status: 400 });
  const tasks = await prisma.careTask.findMany({
    where: { elderlyId, ...(status ? { status } : {}) },
    orderBy: [{ scheduledTime: "asc" }, { createdAt: "desc" }],
    take: 100,
  });
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.scheduledTime?.toISOString().slice(0, 10) === today);
  return NextResponse.json({
    success: true,
    data: {
      tasks,
      todaySummary: {
        total: todayTasks.length,
        completed: todayTasks.filter((t) => t.status === "COMPLETED").length,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  try {
    const b = await request.json();
    if (!b.elderlyId || !b.title) return NextResponse.json({ success: false, error: "参数不完整" }, { status: 400 });
    const task = await prisma.careTask.create({
      data: {
        elderlyId: b.elderlyId,
        title: String(b.title).slice(0, 100),
        type: TYPES.includes(b.type) ? b.type : "OTHER",
        priority: ["LOW", "NORMAL", "HIGH", "URGENT"].includes(b.priority) ? b.priority : "NORMAL",
        scheduledTime: b.scheduledTime ? new Date(b.scheduledTime) : new Date(),
        notes: b.notes || null,
        source: "manual",
      },
    });
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error("[care-tasks] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "创建失败" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  try {
    const b = await request.json();
    if (!b.id) return NextResponse.json({ success: false, error: "缺少任务 id" }, { status: 400 });
    const status = STATUSES.includes(b.status) ? b.status : "PENDING";
    const task = await prisma.careTask.update({
      where: { id: b.id },
      data: { status, completedAt: status === "COMPLETED" ? new Date() : null },
    });
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("[care-tasks PATCH] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "更新失败" }, { status: 500 });
  }
}
