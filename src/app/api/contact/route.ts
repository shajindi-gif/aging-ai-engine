// @ts-nocheck
// ═══════════════════════════════════════════════
// 衍策银龄 AI — 公开联系 / 预约演示 / 意见反馈接口
// POST 提交写入数据库 ContactMessage，供人工跟进
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const ALLOWED_TYPES = ["DEMO", "PARTNER", "FEEDBACK", "OTHER"];

const schema = z.object({
  name: z.string().trim().min(1, "请填写您的姓名").max(50),
  company: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("请填写有效的邮箱地址").max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  type: z.enum(ALLOWED_TYPES as [string, ...string[]]).default("DEMO"),
  products: z.array(z.string().max(40)).max(10).default([]),
  message: z.string().trim().min(5, "请简要描述您的需求").max(2000),
  consent: z.literal(true, {
    message: "请先阅读并同意隐私政策与服务条款",
  }),
  source: z.string().trim().max(120).optional(),
  // honeypot: humans never fill this, bots do
  website: z.string().max(0).optional(),
});

// naive per-IP throttle (in-memory, best-effort; enough for a low-traffic seed site)
const hits = new Map<string, { n: number; ts: number }>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > 60_000) {
    hits.set(ip, { n: 1, ts: now });
    return false;
  }
  rec.n += 1;
  return rec.n > 5; // >5 submissions per minute per IP
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (throttled(ip)) {
      return NextResponse.json(
        { success: false, error: "提交过于频繁，请稍后再试" },
        { status: 429, headers: corsHeaders }
      );
    }

    const body = await request.json();

    // silently accept honeypot submissions without storing (bot trap)
    if (typeof body?.website === "string" && body.website.length > 0) {
      return NextResponse.json(
        { success: true, message: "提交成功" },
        { status: 200, headers: corsHeaders }
      );
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message || "表单填写有误";
      return NextResponse.json(
        { success: false, error: first },
        { status: 400, headers: corsHeaders }
      );
    }

    const d = parsed.data;
    await prisma.contactMessage.create({
      data: {
        name: d.name,
        company: d.company || null,
        email: d.email,
        phone: d.phone || null,
        type: d.type,
        products: d.products,
        message: d.message,
        consent: true,
        source: d.source || null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, message: "提交成功，我们会在 1-2 个工作日内与您联系" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[contact] POST error:", error);
    return NextResponse.json(
      { success: false, error: "提交失败，请稍后重试或直接通过页面邮箱联系我们" },
      { status: 500, headers: corsHeaders }
    );
  }
}
