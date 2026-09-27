"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", gender: "FEMALE", birthYear: "1950", livingStatus: "居家", careLevel: "INDEPENDENT" });
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<any>(null);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/elders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          gender: form.gender,
          birthDate: `${form.birthYear}-01-01`,
          livingStatus: form.livingStatus,
          careLevel: form.careLevel,
          serviceType: "HOME",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        const elder = json.data?.elderly ?? json.data;
        setCreated(elder);
      } else {
        setError(json.error || "创建失败，请重试");
      }
    } catch {
      setError("网络异常，请重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <span className="yc-eyebrow">开始使用</span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">建立老人健康档案</h1>
          <p className="mt-2 text-sm text-text-secondary">只需要基本信息即可开始。之后的健康问卷、活动测试和每日记录都可以逐步补充。</p>

          {created ? (
            <div className="mt-8 rounded-2xl border border-success/30 bg-white p-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-text-primary">档案已创建</h2>
              <p className="mt-2 text-sm text-text-secondary">接下来可以先做一次跌倒风险测试，或进入老人端开始每日健康检测。</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => router.push(`/elder/mobility?elder=${created.id}`)} className="yc-btn-primary">先做活动能力测试</button>
                <button onClick={() => router.push(`/elder?elder=${created.id}`)} className="yc-btn-secondary">进入老人端首页</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-white p-6">
              <label className="block">
                <span className="text-sm font-medium text-text-primary">老人姓名 *</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none" placeholder="如：王秀兰" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-text-primary">性别</span>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none">
                    <option value="FEMALE">女</option>
                    <option value="MALE">男</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-text-primary">出生年份 *</span>
                  <input required type="number" min={1900} max={2020} value={form.birthYear}
                    onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-text-primary">居住方式</span>
                  <select value={form.livingStatus} onChange={(e) => setForm({ ...form, livingStatus: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none">
                    <option>居家</option><option>独居</option><option>与子女同住</option><option>养老机构</option><option>社区照护</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-text-primary">自理能力</span>
                  <select value={form.careLevel} onChange={(e) => setForm({ ...form, careLevel: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none">
                    <option value="INDEPENDENT">完全自理</option>
                    <option value="SEMI_DEPENDENT">半自理</option>
                    <option value="DEPENDENT">需要照护</option>
                    <option value="CRITICAL">重度依赖</option>
                  </select>
                </label>
              </div>
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={saving} className="yc-btn-primary w-full justify-center disabled:opacity-60">
                {saving ? "创建中…" : "创建档案"}
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
