"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RISK_LEVEL_LABEL, RISK_LEVEL_COLOR, STATUS_LABEL, ALERT_LEVEL_LABEL, ALERT_LEVEL_COLOR, MEDICAL_DISCLAIMER_TEXT, calcAge } from "@/lib/silvercare/ui";
import { ChevronRight, ShieldAlert } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  stable: "yc-badge yc-badge-success",
  attention: "yc-badge yc-badge-warning",
  concern: "yc-badge yc-badge-danger",
};
const STATUS_TEXT: Record<string, string> = { stable: "总体稳定", attention: "需要关注", concern: "建议尽快关注" };

export default function FamilyDashboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/silvercare/overview", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => (d.success ? setItems(d.data) : setError(d.error || "加载失败")))
      .catch(() => setError("网络异常"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <section className="border-b border-border bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="yc-eyebrow">家属看板</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">家人健康状况，一目了然</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              汇总老人最近指标、跌倒风险、AI 摘要与待办提醒，按关注优先级排序。<Link href="/alerts" className="text-brand-700 hover:underline">进入提醒中心 →</Link>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-sm text-text-secondary">加载中…</p>
          ) : error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-text-secondary">暂无老人档案，请先在工作台创建。</p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {items.map((e) => (
                <Link key={e.id} href={`/family/elder/${e.id}`} className="yc-card group block">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">
                        {e.name}
                        {e.age != null && <span className="ml-2 text-sm font-normal text-text-muted">{e.age} 岁 · {e.livingStatus ?? "居家"}</span>}
                      </h2>
                      <p className="mt-1 text-xs text-text-muted">
                        最近检测：{e.latestVitalsAt ? `${Math.max(0, Math.round((Date.now() - new Date(e.latestVitalsAt).getTime()) / 3600000))} 小时前` : "暂无"}
                      </p>
                    </div>
                    <span className={STATUS_BADGE[e.overallStatus] ?? "yc-badge"}>{STATUS_TEXT[e.overallStatus] ?? e.overallStatus}</span>
                  </div>

                  {/* 今日健康 */}
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {[
                      { label: "心率", v: e.latestVitals?.heartRate ?? e.latestVitals?.restingHR },
                      { label: "血氧", v: e.latestVitals?.spo2 ? `${e.latestVitals.spo2}%` : null },
                      { label: "血压", v: e.latestVitals?.systolicBP ? `${e.latestVitals.systolicBP}/${e.latestVitals.diastolicBP}` : null },
                      { label: "步数", v: e.latestVitals?.steps },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg bg-silver-50 p-2.5 text-center">
                        <p className="text-[11px] text-text-muted">{m.label}</p>
                        <p className="mt-0.5 text-lg font-bold text-text-primary">{m.v ?? "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* 风险 */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className={`yc-badge ${e.fallRisk ? (e.fallRisk.level === "HIGH" ? "yc-badge-danger" : e.fallRisk.level === "MODERATE" ? "yc-badge-gold" : "yc-badge-success") : ""}`}>
                      跌倒：{e.fallRisk ? `${RISK_LEVEL_LABEL[e.fallRisk.level]} (${e.fallRisk.score})` : "未评估"}
                    </span>
                    <span className={`yc-badge ${e.trendSignals.some((s: any) => s.category === "VITALS" || s.category === "SYMPTOM") ? "yc-badge-warning" : "yc-badge-success"}`}>
                      心肺：{e.trendSignals.some((s: any) => s.category === "VITALS" || s.category === "SYMPTOM") ? "需关注" : "平稳"}
                    </span>
                    <span className="yc-badge">今日任务 {e.todayTasks.completed}/{e.todayTasks.total}</span>
                    {e.openAlerts.length > 0 && (
                      <span className="yc-badge yc-badge-gold">{e.openAlerts.length} 条未读提醒</span>
                    )}
                  </div>

                  {/* AI 摘要 */}
                  {e.latestAgentSummary && (
                    <p className="mt-3 line-clamp-2 rounded-lg bg-brand-50 px-3 py-2 text-xs leading-relaxed text-text-secondary">{e.latestAgentSummary}</p>
                  )}

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                    查看详情 <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-text-secondary">{MEDICAL_DISCLAIMER_TEXT}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
