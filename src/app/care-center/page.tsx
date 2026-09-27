"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RISK_LEVEL_LABEL, MEDICAL_DISCLAIMER_TEXT } from "@/lib/silvercare/ui";
import { ShieldAlert } from "lucide-react";

const STATUS_TEXT: Record<string, string> = { stable: "稳定", attention: "关注", concern: "介入" };
const STATUS_CLASS: Record<string, string> = {
  stable: "yc-badge yc-badge-success",
  attention: "yc-badge yc-badge-warning",
  concern: "yc-badge yc-badge-danger",
};

type FilterKey = "ALL" | "HIGH" | "MISSED" | "ALERTS" | "FALL" | "LOWACTIVITY";

export default function CareCenterPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("ALL");

  useEffect(() => {
    fetch("/api/silvercare/overview", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setItems(d.data))
      .finally(() => setLoading(false));
  }, []);

  const FILTERS: { key: FilterKey; label: string; test: (e: any) => boolean }[] = [
    { key: "ALL", label: "全部老人", test: () => true },
    { key: "HIGH", label: "高风险", test: (e) => e.overallStatus === "concern" || e.fallRisk?.level === "HIGH" },
    { key: "MISSED", label: "有漏做任务", test: (e) => e.todayTasks.missed > 0 || (e.todayTasks.total > 0 && e.todayTasks.completed < e.todayTasks.total) },
    { key: "ALERTS", label: "新提醒", test: (e) => e.openAlerts.length > 0 },
    { key: "FALL", label: "近期跌倒风险", test: (e) => e.fallRisk && e.fallRisk.level !== "LOW" },
    { key: "LOWACTIVITY", label: "活动量下降", test: (e) => e.trendSignals.some((s: any) => s.category === "ACTIVITY") },
  ];

  const filtered = items.filter((e) => (FILTERS.find((f) => f.key === filter) ?? FILTERS[0]).test(e));

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <section className="border-b border-border bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="yc-eyebrow">机构看板（基础版）</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">护理对象总览</h1>
            <p className="mt-2 text-sm text-text-secondary">按综合状态排序，优先展示需要关注的老人。</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${filter === f.key ? "bg-brand-600 text-white" : "border border-border bg-white text-text-secondary hover:border-brand-300"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? <p className="text-sm text-text-secondary">加载中…</p> : (
            <div className="overflow-x-auto rounded-xl border border-border bg-white">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                    <th className="px-4 py-3 font-medium">老人</th>
                    <th className="px-4 py-3 font-medium">综合状态</th>
                    <th className="px-4 py-3 font-medium">跌倒风险</th>
                    <th className="px-4 py-3 font-medium">心肺/活动</th>
                    <th className="px-4 py-3 font-medium">今日任务</th>
                    <th className="px-4 py-3 font-medium">提醒</th>
                    <th className="px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-silver-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-text-primary">{e.name}</p>
                        <p className="text-xs text-text-muted">{e.age} 岁 · {e.livingStatus ?? "居家"}</p>
                      </td>
                      <td className="px-4 py-3"><span className={STATUS_CLASS[e.overallStatus]}>{STATUS_TEXT[e.overallStatus]}</span></td>
                      <td className="px-4 py-3">
                        {e.fallRisk ? (
                          <span className={e.fallRisk.level === "HIGH" ? "font-semibold text-danger" : e.fallRisk.level === "MODERATE" ? "font-semibold text-warning" : "text-success"}>
                            {RISK_LEVEL_LABEL[e.fallRisk.level]} ({e.fallRisk.score})
                          </span>
                        ) : <span className="text-text-muted">未评估</span>}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {e.trendSignals.filter((s: any) => s.category === "VITALS" || s.category === "SYMPTOM").length > 0 ? "需关注" : "平稳"}
                        {e.trendSignals.some((s: any) => s.category === "ACTIVITY") && " · 活动下降"}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{e.todayTasks.completed}/{e.todayTasks.total}{e.todayTasks.missed > 0 && <span className="ml-1 text-danger">（漏 {e.todayTasks.missed}）</span>}</td>
                      <td className="px-4 py-3">{e.openAlerts.length > 0 ? <span className="yc-badge yc-badge-gold">{e.openAlerts.length}</span> : <span className="text-text-muted">—</span>}</td>
                      <td className="px-4 py-3">
                        <Link href={`/family/elder/${e.id}`} className="text-brand-700 hover:underline">详情</Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-text-muted">当前筛选下没有老人。</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-text-secondary">{MEDICAL_DISCLAIMER_TEXT}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
