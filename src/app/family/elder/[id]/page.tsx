"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RISK_LEVEL_LABEL, TASK_TYPE_LABEL, TASK_STATUS_LABEL, ALERT_LEVEL_LABEL, ALERT_LEVEL_COLOR, MEDICAL_DISCLAIMER_TEXT } from "@/lib/silvercare/ui";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowLeft, ShieldAlert } from "lucide-react";

const STATUS_TEXT: Record<string, string> = { stable: "总体稳定", attention: "需要关注", concern: "建议尽快关注" };

export default function FamilyElderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vitalsData, setVitalsData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [overviewItem, setOverviewItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/silvercare/vitals?elderlyId=${id}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      fetch(`/api/silvercare/care-tasks?elderlyId=${id}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      fetch(`/api/silvercare/alerts?elderlyId=${id}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      fetch("/api/silvercare/overview", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
    ]).then(([v, t, a, o]) => {
      if (v?.success) setVitalsData(v.data);
      if (t?.success) setTasks(t.data.tasks ?? []);
      if (a?.success) setAlerts(a.data ?? []);
      if (o?.success) setOverviewItem(o.data.find((x: any) => x.id === id));
    }).finally(() => setLoading(false));
  }, [id]);

  const chartData = (metric: string) =>
    (vitalsData?.trends?.d30 ?? vitalsData?.trends?.d7 ?? [])
      .find((t: any) => t.metric === metric)?.points ?? [];

  async function ackAlert(alertId: string) {
    await fetch("/api/silvercare/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: alertId, status: "ACKNOWLEDGED" }),
    });
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: "ACKNOWLEDGED" } : a)));
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary pb-12">
        <section className="border-b border-border bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link href="/family" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-brand-700">
              <ArrowLeft className="h-4 w-4" /> 返回家属看板
            </Link>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                {overviewItem?.name ?? "老人"} 健康详情
                {overviewItem?.age != null && <span className="ml-2 text-base font-normal text-text-muted">{overviewItem.age} 岁</span>}
              </h1>
              {overviewItem && (
                <span className={`yc-badge ${overviewItem.overallStatus === "concern" ? "yc-badge-danger" : overviewItem.overallStatus === "attention" ? "yc-badge-warning" : "yc-badge-success"}`}>
                  {STATUS_TEXT[overviewItem.overallStatus]}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          {loading ? <p className="text-sm text-text-secondary">加载中…</p> : (
            <>
              {/* 风险概览 */}
              {overviewItem && (
                <section className="grid gap-4 sm:grid-cols-3">
                  <div className="yc-card">
                    <p className="text-xs text-text-muted">跌倒风险（实验性）</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">
                      {overviewItem.fallRisk ? `${overviewItem.fallRisk.score}/100 · ${RISK_LEVEL_LABEL[overviewItem.fallRisk.level]}` : "未评估"}
                    </p>
                  </div>
                  <div className="yc-card">
                    <p className="text-xs text-text-muted">今日任务</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{overviewItem.todayTasks.completed} / {overviewItem.todayTasks.total} 已完成</p>
                  </div>
                  <div className="yc-card">
                    <p className="text-xs text-text-muted">未读提醒</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{overviewItem.openAlerts.length} 条</p>
                  </div>
                </section>
              )}

              {/* 趋势图 */}
              <section className="yc-card">
                <h2 className="text-base font-bold text-text-primary">血氧趋势（近 30 天）</h2>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData("血氧饱和度")}>
                      <CartesianGrid stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(d: string) => d.slice(5)} />
                      <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                      <Tooltip formatter={(v: any) => [`${v}%`, "血氧"]} />
                      <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} dot={false} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="yc-card">
                <h2 className="text-base font-bold text-text-primary">活动量趋势（近 30 天）</h2>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData("活动量（步数）")}>
                      <CartesianGrid stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(d: string) => d.slice(5)} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                      <Tooltip formatter={(v: any) => [`${v} 步`, "步数"]} />
                      <Line type="monotone" dataKey="value" stroke="#d97706" strokeWidth={2} dot={false} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* AI 摘要 */}
              {overviewItem?.latestAgentSummary && (
                <section className="rounded-xl border border-brand-200 bg-brand-50 p-5">
                  <h2 className="text-base font-bold text-brand-800">AI 照护摘要</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{overviewItem.latestAgentSummary}</p>
                </section>
              )}

              {/* 提醒 */}
              {alerts.length > 0 && (
                <section className="yc-card">
                  <h2 className="text-base font-bold text-text-primary">异常提醒</h2>
                  <ul className="mt-4 space-y-3">
                    {alerts.slice(0, 10).map((a) => (
                      <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg bg-silver-50 px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={ALERT_LEVEL_COLOR[a.level]}>{ALERT_LEVEL_LABEL[a.level]}</span>
                            <p className="text-sm font-semibold text-text-primary">{a.title}</p>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{a.message}</p>
                          <p className="mt-1 text-xs text-text-muted">{new Date(a.createdAt).toLocaleString("zh-CN")} · {a.status === "OPEN" ? "未处理" : a.status === "ACKNOWLEDGED" ? "已确认" : "已解决"}</p>
                        </div>
                        {a.status === "OPEN" && (
                          <button onClick={() => ackAlert(a.id)} className="yc-btn-secondary shrink-0 px-3 py-1.5 text-xs">确认已读</button>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 任务 */}
              <section className="yc-card">
                <h2 className="text-base font-bold text-text-primary">照护任务</h2>
                <ul className="mt-4 divide-y divide-border">
                  {tasks.slice(0, 12).map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{t.title}</p>
                        <p className="text-xs text-text-muted">{TASK_TYPE_LABEL[t.type] ?? t.type} · 来源 {t.source === "agent" ? "AI 生成" : "手动"}</p>
                      </div>
                      <span className={`yc-badge ${t.status === "COMPLETED" ? "yc-badge-success" : t.status === "MISSED" ? "yc-badge-danger" : "yc-badge-warning"}`}>
                        {TASK_STATUS_LABEL[t.status]}
                      </span>
                    </li>
                  ))}
                  {tasks.length === 0 && <li className="py-3 text-sm text-text-secondary">暂无任务</li>}
                </ul>
              </section>

              <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-text-secondary">{MEDICAL_DISCLAIMER_TEXT}</p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
