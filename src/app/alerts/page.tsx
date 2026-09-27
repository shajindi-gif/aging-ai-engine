"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ALERT_LEVEL_LABEL, ALERT_LEVEL_COLOR, MEDICAL_DISCLAIMER_TEXT } from "@/lib/silvercare/ui";
import { ShieldAlert, Bell } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "ACKNOWLEDGED" | "RESOLVED">("OPEN");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const qs = filter === "ALL" ? "" : `?status=${filter}`;
    const d = await fetch(`/api/silvercare/alerts${qs}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null);
    if (d?.success) setAlerts(d.data);
    setLoading(false);
  }

  async function ack(id: string, status: "ACKNOWLEDGED" | "RESOLVED") {
    await fetch("/api/silvercare/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const TABS = [
    { key: "OPEN", label: "未处理" },
    { key: "ACKNOWLEDGED", label: "已确认" },
    { key: "RESOLVED", label: "已解决" },
    { key: "ALL", label: "全部" },
  ] as const;

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <section className="border-b border-border bg-white py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <span className="yc-eyebrow">提醒中心</span>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              <Bell className="h-7 w-7 text-brand-600" aria-hidden="true" /> 异常事件与提醒
            </h1>
            <div className="mt-4 flex gap-2">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { setFilter(t.key); setTimeout(load, 0); }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${filter === t.key ? "bg-brand-600 text-white" : "bg-white border border-border text-text-secondary hover:border-brand-300"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? <p className="text-sm text-text-secondary">加载中…</p> : alerts.length === 0 ? (
            <p className="rounded-xl border border-border bg-white px-5 py-8 text-center text-sm text-text-secondary">当前筛选下没有提醒。</p>
          ) : (
            <ul className="space-y-4">
              {alerts.map((a) => (
                <li key={a.id} className={`rounded-xl border bg-white p-5 ${a.level === 3 ? "border-red-200" : a.level === 2 ? "border-gold-200" : "border-border"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={ALERT_LEVEL_COLOR[a.level]}>{ALERT_LEVEL_LABEL[a.level]}</span>
                        <h2 className="text-base font-bold text-text-primary">{a.title}</h2>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a.message}</p>
                      <p className="mt-2 text-xs text-text-muted">
                        {new Date(a.createdAt).toLocaleString("zh-CN")} · 来源：{a.source === "agent" ? "AI Agent" : a.source === "trend-engine" ? "趋势引擎" : a.source}
                        {" · "}<Link href={`/family/elder/${a.elderlyId}`} className="text-brand-700 hover:underline">查看老人</Link>
                      </p>
                    </div>
                    {a.status === "OPEN" && (
                      <div className="flex gap-2">
                        <button onClick={() => ack(a.id, "ACKNOWLEDGED")} className="yc-btn-secondary px-3 py-1.5 text-xs">确认已读</button>
                        <button onClick={() => ack(a.id, "RESOLVED")} className="yc-btn-primary px-3 py-1.5 text-xs">标记解决</button>
                      </div>
                    )}
                    {a.status !== "OPEN" && (
                      <span className="yc-badge yc-badge-success">{a.status === "RESOLVED" ? "已解决" : "已确认"}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
