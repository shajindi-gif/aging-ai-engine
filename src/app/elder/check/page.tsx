"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import ElderShell from "@/components/silvercare/ElderShell";
import { useSelectedElder } from "@/lib/silvercare/use-elder";

const FIELDS: { key: string; label: string; unit: string; max: number; step?: number; placeholder: string }[] = [
  { key: "systolicBP", label: "收缩压（高压）", unit: "mmHg", max: 260, placeholder: "如 132" },
  { key: "diastolicBP", label: "舒张压（低压）", unit: "mmHg", max: 180, placeholder: "如 78" },
  { key: "spo2", label: "血氧饱和度", unit: "%", max: 100, placeholder: "如 95" },
  { key: "heartRate", label: "心率", unit: "次/分", max: 220, placeholder: "如 72" },
  { key: "respiratoryRate", label: "呼吸频率", unit: "次/分", max: 60, placeholder: "如 16" },
  { key: "steps", label: "今日步数", unit: "步", max: 100000, placeholder: "如 2380" },
  { key: "sleepHours", label: "昨晚睡眠", unit: "小时", max: 24, step: 0.5, placeholder: "如 6.5" },
  { key: "temperature", label: "体温", unit: "℃", max: 43, step: 0.1, placeholder: "如 36.5" },
];

const SYMPTOMS: { key: string; label: string }[] = [
  { key: "coughLevel", label: "咳嗽程度" },
  { key: "dyspneaLevel", label: "呼吸困难" },
  { key: "chestTightness", label: "胸闷" },
  { key: "fatigueLevel", label: "疲劳" },
];

export default function ElderCheckPage() {
  const { elder, elderId, loading } = useSelectedElder();
  const [values, setValues] = useState<Record<string, string>>({});
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!elderId) return;
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = { elderlyId: elderId };
      for (const f of FIELDS) if (values[f.key]?.trim()) body[f.key] = Number(values[f.key]);
      for (const s of SYMPTOMS) body[s.key] = symptoms[s.key] ?? 0;
      const res = await fetch("/api/silvercare/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (res.ok && json.success) setDone(true);
      else setError(json.error || "保存失败，请重试");
    } catch {
      setError("网络异常，请重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ElderShell title="每日健康检测" active="check" elderId={elderId} elderName={elder?.name}>
      <div className="mb-6 rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-4">
        <p className="text-base font-semibold text-brand-800">数据使用告知</p>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
          本次录入的健康指标将保存到您所属机构的账号下，仅用于趋势记录与照护提醒，不用于模型训练、不对外共享；详情见《隐私政策》。当前为演示环境，请使用虚构或已获授权的信息，不要录入真实病历。
        </p>
      </div>
      {loading ? <p className="text-lg text-text-secondary">加载中…</p> : !elder ? (
        <p className="text-lg text-text-secondary">请先创建老人档案。</p>
      ) : done ? (
        <div className="rounded-2xl border-2 border-success/40 bg-success/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-bold text-text-primary">记录成功</h2>
          <p className="mt-2 text-lg text-text-secondary">今天的数据已保存，AI 会持续关注变化趋势。</p>
          <button onClick={() => { setDone(false); setValues({}); }} className="yc-btn-primary mt-6 px-8 py-4 text-lg">
            再记一次
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border-2 border-border bg-white p-6">
            <h2 className="text-xl font-bold text-text-primary">今天测到的数值</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-lg font-medium text-text-primary">{f.label}</span>
                  <span className="ml-2 text-base text-text-muted">（{f.unit}）</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    max={f.max}
                    step={f.step ?? 1}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    className="mt-2 min-h-16 w-full rounded-xl border-2 border-border px-5 text-xl focus:border-brand-400 focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border-2 border-border bg-white p-6">
            <h2 className="text-xl font-bold text-text-primary">今天的感觉怎么样？</h2>
            <p className="mt-1 text-base text-text-muted">0 = 完全没有，10 = 非常严重</p>
            <div className="mt-5 space-y-6">
              {SYMPTOMS.map((s) => (
                <div key={s.key}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-text-primary">{s.label}</span>
                    <span className="text-2xl font-bold text-brand-700">{symptoms[s.key] ?? 0}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={symptoms[s.key] ?? 0}
                    onChange={(e) => setSymptoms((v) => ({ ...v, [s.key]: Number(e.target.value) }))}
                    className="mt-2 h-3 w-full accent-teal-600"
                    aria-label={s.label}
                  />
                </div>
              ))}
            </div>
          </section>

          {error && <p className="rounded-xl bg-red-50 px-5 py-4 text-lg text-red-700">{error}</p>}

          <button
            onClick={submit}
            disabled={saving}
            className="yc-btn-primary w-full min-h-16 justify-center text-xl disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存今天的记录"}
          </button>
        </div>
      )}
    </ElderShell>
  );
}
