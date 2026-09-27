// ═══════════════════════════════════════════════
// SilverCare Agent — 工具调用架构
// 数据 → 风险计算 → 结构化判断 → 任务/提醒 → 每日报告
// LLM 仅用于叙述增强，输出经结构校验，不直接信任模型内容
// ═══════════════════════════════════════════════

import prisma from "@/lib/db";
import type { CareAgentRun } from "@prisma/client";
import { computeTrends, detectTrendAlerts, EMERGENCY_HINT, type DailyVitals, type TrendAlertSignal } from "./trend-engine";
import { llmChatJSON, getLlmConfig } from "./llm";

export const AGENT_DISCLAIMER =
  "本内容由 AI 照护助手基于已记录数据生成，用于健康管理与照护辅助，不替代专业医疗诊断或治疗。";

export interface AgentFinding {
  type: string;
  severity: "low" | "moderate" | "high";
  description: string;
}

export interface AgentOutput {
  overall_status: "stable" | "attention" | "concern";
  risk_level: "low" | "moderate" | "high";
  summary: string; // 今日健康摘要（叙述）
  findings: AgentFinding[];
  recommendations: string[];
  tasks: { title: string; type: string; priority: string }[];
  alerts: { level: number; category: string; title: string; message: string }[];
  tools_used: string[];
  mode: "llm" | "rules";
  disclaimer: string;
}

// ── Tools ──────────────────────────────────────

export async function getElderProfile(elderlyId: string) {
  return prisma.elderlyProfile.findUnique({
    where: { id: elderlyId },
    include: { healthSummary: true, familyMembers: true },
  });
}

export async function getLatestVitals(elderlyId: string) {
  const list = await prisma.chronicMetric.findMany({
    where: { elderlyId },
    orderBy: { metricDate: "desc" },
    take: 30,
  });
  return list;
}

export async function getHealthTrend(elderlyId: string) {
  const raw = await getLatestVitals(elderlyId);
  const vitals: DailyVitals[] = raw.map((m) => ({
    date: m.metricDate.toISOString().slice(0, 10),
    heartRate: m.heartRate ?? m.restingHR ?? null,
    restingHR: m.restingHR ?? null,
    systolicBP: m.systolicBP ?? null,
    diastolicBP: m.diastolicBP ?? null,
    spo2: m.spo2 ?? null,
    respiratoryRate: m.respiratoryRate ?? null,
    steps: m.steps ?? null,
    sleepHours: m.sleepHours ?? null,
    dyspneaLevel: m.dyspneaLevel ?? null,
  }));
  return { trends: computeTrends(vitals), alertSignals: detectTrendAlerts(vitals), raw: vitals };
}

export async function getFallRisk(elderlyId: string) {
  return prisma.fallRiskScore.findFirst({
    where: { elderlyId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCareTask(input: {
  elderlyId: string; title: string; type: string; priority?: string; scheduledTime?: Date; notes?: string;
}) {
  return prisma.careTask.create({
    data: {
      elderlyId: input.elderlyId,
      title: input.title,
      type: input.type,
      priority: input.priority ?? "NORMAL",
      scheduledTime: input.scheduledTime ?? new Date(),
      notes: input.notes,
      source: "agent",
    },
  });
}

export async function createAlert(input: {
  elderlyId: string; level: number; category: string; title: string; message: string;
}) {
  const lvl = Math.min(3, Math.max(1, Math.round(input.level)));
  return prisma.healthAlert.create({
    data: { elderlyId: input.elderlyId, level: lvl, category: input.category, title: input.title, message: input.message, source: "agent" },
  });
}

export async function generateFamilyReport(elderlyId: string, output: AgentOutput) {
  const elder = await getElderProfile(elderlyId);
  const name = elder?.name ?? "老人";
  const lines = [
    `${name} · AI 照护摘要`,
    `总体状态：${statusLabel(output.overall_status)}`,
    "",
    "需要关注：",
    ...(output.findings.length
      ? output.findings.map((f, i) => `${i + 1}. ${f.description}`)
      : ["近期无异常信号"]),
    "",
    "今日建议：",
    ...output.recommendations.map((r) => `· ${r}`),
    "",
    AGENT_DISCLAIMER,
  ];
  return lines.join("\n");
}

function statusLabel(s: AgentOutput["overall_status"]) {
  return s === "stable" ? "总体稳定" : s === "attention" ? "需要关注" : "建议尽快关注";
}

// ── 结构校验（不直接信任 LLM 输出）─────────────

const SEV: AgentFinding["severity"][] = ["low", "moderate", "high"];

function sanitizeLlmSummary(raw: unknown, fallback: string): string {
  if (typeof raw === "string" && raw.trim().length > 0 && raw.length <= 800) return raw.trim();
  return fallback;
}

// ── Agent 主流程 ───────────────────────────────

export async function runCareAgent(elderlyId: string): Promise<{ run: CareAgentRun; output: AgentOutput; familyReport: string }> {
  const t0 = Date.now();
  const toolsUsed: string[] = ["get_elder_profile", "get_latest_vitals", "get_health_trend", "get_fall_risk"];

  const [profile, trend, fallRisk] = await Promise.all([
    getElderProfile(elderlyId),
    getHealthTrend(elderlyId),
    getFallRisk(elderlyId),
  ]);
  if (!profile) throw new Error("老人档案不存在");

  const signals: TrendAlertSignal[] = trend.alertSignals;
  const findings: AgentFinding[] = signals.map((s) => ({
    type: s.category.toLowerCase(),
    severity: s.level >= 3 ? "high" : s.level === 2 ? "moderate" : "low",
    description: s.title ? `${s.title}：${s.message}` : s.message,
  }));

  const fallLevel = fallRisk?.level?.toLowerCase() as "low" | "moderate" | "high" | undefined;
  if (fallLevel === "high" || fallLevel === "moderate") {
    findings.push({
      type: "fall_risk",
      severity: fallLevel === "high" ? "high" : "moderate",
      description: `跌倒风险评估为 ${fallLevel === "high" ? "较高" : "中等"}（${fallRisk!.score}/100，实验性评分）`,
    });
  }

  // 判断
  const hasHigh = findings.some((f) => f.severity === "high");
  const hasModerate = findings.some((f) => f.severity === "moderate");
  const overall: AgentOutput["overall_status"] = hasHigh ? "concern" : hasModerate ? "attention" : "stable";
  const risk: AgentOutput["risk_level"] = hasHigh ? "high" : hasModerate ? "moderate" : "low";

  // 任务与提醒
  const tasks: AgentOutput["tasks"] = [];
  const alerts: AgentOutput["alerts"] = [];

  for (const s of signals) {
    alerts.push({ level: s.level, category: s.category, title: s.title, message: s.message });
  }
  if (signals.some((s) => s.title.includes("血氧"))) {
    tasks.push({ title: "下午复测一次血氧", type: "VITALS_SPO2", priority: "HIGH" });
  }
  if (signals.some((s) => s.category === "ACTIVITY")) {
    tasks.push({ title: "陪同散步 15 分钟（适度活动）", type: "WALK", priority: "NORMAL" });
  }
  if (fallLevel && fallLevel !== "low") {
    tasks.push({ title: "完成 5 次起立训练（家属陪同）", type: "REHAB", priority: fallLevel === "high" ? "HIGH" : "NORMAL" });
  }
  tasks.push({ title: "晚间服药提醒", type: "MEDICATION", priority: "NORMAL" });

  const recommendations = [
    ...new Set([
      ...tasks.slice(0, 3).map((t) => t.title),
      ...(overall !== "stable" ? ["建议家属今日与老人通话了解状态"] : []),
    ]),
  ];

  // 规则模式摘要（默认）
  const spo2Trend = trend.trends.d7.find((t) => t.metric.includes("血氧"));
  const stepsTrend = trend.trends.d7.find((t) => t.metric.includes("活动量"));
  const name = profile.name;
  const rulesSummary = [
    `${name}，今日总体${overall === "stable" ? "稳定" : overall === "attention" ? "需要关注" : "建议尽快关注"}。`,
    findings.length ? `需要关注：${findings.slice(0, 3).map((f) => f.description.split("：")[0]).join("；")}。` : "近期各项指标未见明显异常。",
    spo2Trend?.direction === "down" ? `过去 7 天血氧 ${spo2Trend.first}% → ${spo2Trend.last}%。` : "",
    stepsTrend?.direction === "down" && stepsTrend.changePct != null ? `活动量较前下降约 ${Math.abs(stepsTrend.changePct)}%。` : "",
    `今日建议：${recommendations.slice(0, 3).join("；")}。`,
  ].filter(Boolean).join("");

  // LLM 增强（可选，失败自动回退规则模式）
  let mode: "llm" | "rules" = "rules";
  let summary = rulesSummary;
  if (getLlmConfig()) {
    toolsUsed.push("llm_summary");
    const llmOut = await llmChatJSON([
      {
        role: "system",
        content:
          "你是养老健康照护助手。根据结构化数据用简体中文写一段 80-150 字的「今日健康摘要」，口吻温暖克制，只描述数据中存在的事实与建议，禁止编造数据、禁止疾病诊断、禁止危言耸听。输出 JSON：{\"summary\": \"...\"}",
      },
      {
        role: "user",
        content: JSON.stringify({
          elder: { name, age: profile.birthDate ? new Date().getFullYear() - profile.birthDate.getFullYear() : null },
          overall_status: overall,
          findings: findings.map((f) => f.description),
          recommendations,
          trends_7d: trend.trends.d7.map((t) => ({ metric: t.metric, first: t.first, last: t.last, direction: t.direction })),
        }),
      },
    ]);
    summary = sanitizeLlmSummary((llmOut as { summary?: unknown } | null)?.summary, rulesSummary);
    if (summary !== rulesSummary) mode = "llm";
  }

  const output: AgentOutput = {
    overall_status: overall,
    risk_level: risk,
    summary,
    findings,
    recommendations,
    tasks,
    alerts,
    tools_used: [...toolsUsed, ...(tasks.length ? ["create_care_task"] : []), ...(alerts.length ? ["create_alert"] : []), "generate_family_report"],
    mode,
    disclaimer: AGENT_DISCLAIMER,
  };

  // 持久化：任务、提醒、运行记录
  for (const t of tasks) {
    await createCareTask({ elderlyId, title: t.title, type: t.type, priority: t.priority });
  }
  for (const a of alerts) {
    await createAlert({ elderlyId, level: a.level, category: a.category, title: a.title, message: a.message });
  }
  const familyReport = await generateFamilyReport(elderlyId, output);

  const run = await prisma.careAgentRun.create({
    data: {
      elderlyId,
      mode,
      model: getLlmConfig()?.model ?? null,
      inputSummary: `findings=${findings.length}; signals=${signals.length}; fallRisk=${fallRisk?.level ?? "none"}`,
      output: output as unknown as object,
      toolsUsed: output.tools_used,
      durationMs: Date.now() - t0,
    },
  });

  return { run, output, familyReport };
}

export { SEV };
