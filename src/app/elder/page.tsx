"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ElderShell from "@/components/silvercare/ElderShell";
import { useSelectedElder } from "@/lib/silvercare/use-elder";
import { TASK_TYPE_LABEL, TASK_STATUS_LABEL, STATUS_LABEL } from "@/lib/silvercare/ui";
import { HeartPulse, ClipboardCheck, ClipboardList, Sparkles, ChevronRight, CheckCircle2, Circle } from "lucide-react";

export default function ElderTodayPage() {
  const { elder, elderId, loading, error } = useSelectedElder();
  const params = useSearchParams();
  const q = elderId ? `?elder=${elderId}` : "";
  const [vitals, setVitals] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [latestRun, setLatestRun] = useState<any>(null);

  useEffect(() => {
    if (!elderId) return;
    fetch(`/api/silvercare/vitals?elderlyId=${elderId}`, { cache: "no-store" }).then((r) => r.json()).then((d) => setVitals(d?.data?.vitals?.[0] ?? null)).catch(() => {});
    fetch(`/api/silvercare/care-tasks?elderlyId=${elderId}`, { cache: "no-store" }).then((r) => r.json()).then((d) => setTasks(d?.data?.tasks ?? [])).catch(() => {});
    fetch(`/api/silvercare/agent?elderlyId=${elderId}`, { cache: "no-store" }).then((r) => r.json()).then((d) => setLatestRun(d?.data ?? null)).catch(() => {});
  }, [elderId]);

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.scheduledTime?.slice(0, 10) === today);
  const doneCount = todayTasks.filter((t) => t.status === "COMPLETED").length;

  async function toggleTask(t: any) {
    const next = t.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    await fetch("/api/silvercare/care-tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, status: next }),
    });
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
  }

  return (
    <ElderShell title="今日健康" active="today" elderId={elderId} elderName={elder?.name}>
      {loading ? (
        <p className="text-lg text-text-secondary">加载中…</p>
      ) : error || !elder ? (
        <div className="rounded-xl border-2 border-border bg-white p-8 text-lg text-text-secondary">
          {error || "请先在“我的工作台”中创建老人档案，再使用老人端。"}
        </div>
      ) : (
        <div className="space-y-6">
          {/* 今日指标 */}
          <section className="rounded-2xl border-2 border-border bg-white p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
              <HeartPulse className="h-6 w-6 text-brand-600" aria-hidden="true" /> 今日健康
            </h2>
            {vitals ? (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "心率", value: vitals.heartRate ?? vitals.restingHR, unit: "次/分" },
                  { label: "血压", value: vitals.systolicBP ? `${vitals.systolicBP}/${vitals.diastolicBP}` : null, unit: "mmHg" },
                  { label: "血氧", value: vitals.spo2, unit: "%" },
                  { label: "步数", value: vitals.steps, unit: "步" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-silver-50 p-4 text-center">
                    <p className="text-base text-text-secondary">{m.label}</p>
                    <p className="mt-1 text-3xl font-bold text-text-primary">{m.value ?? "—"}</p>
                    <p className="text-sm text-text-muted">{m.unit}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-lg text-text-secondary">今天还没有记录，先做一次健康检测吧。</p>
            )}
          </section>

          {/* 今日任务 */}
          <section className="rounded-2xl border-2 border-border bg-white p-6">
            <h2 className="flex items-center justify-between text-xl font-bold text-text-primary">
              <span className="flex items-center gap-2"><ClipboardList className="h-6 w-6 text-brand-600" aria-hidden="true" /> 今日任务</span>
              <span className="text-lg font-semibold text-brand-700">{doneCount} / {todayTasks.length} 已完成</span>
            </h2>
            {todayTasks.length ? (
              <ul className="mt-4 space-y-3">
                {todayTasks.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => toggleTask(t)}
                      className={`flex min-h-16 w-full items-center gap-4 rounded-xl border-2 px-5 text-left text-lg transition ${
                        t.status === "COMPLETED" ? "border-success/40 bg-success/5 text-text-muted" : "border-border bg-white hover:border-brand-300"
                      }`}
                      aria-pressed={t.status === "COMPLETED"}
                    >
                      {t.status === "COMPLETED" ? (
                        <CheckCircle2 className="h-7 w-7 shrink-0 text-success" aria-hidden="true" />
                      ) : (
                        <Circle className="h-7 w-7 shrink-0 text-silver-400" aria-hidden="true" />
                      )}
                      <span className="flex-1 font-medium">
                        {t.title}
                        <span className="ml-2 text-base text-text-muted">（{TASK_TYPE_LABEL[t.type] ?? "任务"}）</span>
                      </span>
                      <span className="text-base">{TASK_STATUS_LABEL[t.status]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-lg text-text-secondary">今天暂无任务。</p>
            )}
          </section>

          {/* 快捷入口 */}
          <section className="grid gap-4 sm:grid-cols-2">
            <Link href={`/elder/check${q}`} className="flex min-h-24 items-center justify-between rounded-2xl bg-brand-600 px-6 py-5 text-white transition hover:bg-brand-700">
              <span className="flex items-center gap-3 text-xl font-bold"><ClipboardCheck className="h-7 w-7" aria-hidden="true" /> 开始健康检测</span>
              <ChevronRight className="h-7 w-7" aria-hidden="true" />
            </Link>
            <Link href={`/elder/assistant${q}`} className="flex min-h-24 items-center justify-between rounded-2xl border-2 border-brand-200 bg-brand-50 px-6 py-5 text-brand-800 transition hover:bg-brand-100">
              <span className="flex items-center gap-3 text-xl font-bold"><Sparkles className="h-7 w-7" aria-hidden="true" /> AI 健康助手</span>
              <ChevronRight className="h-7 w-7" aria-hidden="true" />
            </Link>
          </section>

          {/* AI 摘要预览 */}
          {latestRun?.output && (
            <section className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-6">
              <h2 className="text-xl font-bold text-brand-800">最近 AI 摘要</h2>
              <p className="mt-3 text-lg leading-relaxed text-text-primary">{latestRun.output.summary}</p>
              <p className="mt-3 text-base text-text-muted">状态：{STATUS_LABEL[latestRun.output.overall_status] ?? latestRun.output.overall_status}</p>
            </section>
          )}
        </div>
      )}
    </ElderShell>
  );
}
