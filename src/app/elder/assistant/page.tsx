"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import ElderShell from "@/components/silvercare/ElderShell";
import { useSelectedElder } from "@/lib/silvercare/use-elder";
import { STATUS_LABEL, ALERT_LEVEL_LABEL, ALERT_LEVEL_COLOR } from "@/lib/silvercare/ui";

export default function ElderAssistantPage() {
  const { elder, elderId, loading } = useSelectedElder();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function runAgent() {
    if (!elderId) return;
    setRunning(true);
    setError("");
    try {
      const res = await fetch("/api/silvercare/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderlyId: elderId }),
      });
      const json = await res.json();
      if (res.ok && json.success) setResult(json.data);
      else setError(json.error || "运行失败，请稍后重试");
    } catch {
      setError("网络异常，请重试");
    } finally {
      setRunning(false);
    }
  }

  return (
    <ElderShell title="AI 健康助手" active="assistant" elderId={elderId} elderName={elder?.name}>
      {loading ? <p className="text-lg text-text-secondary">加载中…</p> : !elder ? (
        <p className="text-lg text-text-secondary">请先创建老人档案。</p>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-brand-800">
              <Sparkles className="h-6 w-6" aria-hidden="true" /> SilverCare 照护助手
            </h2>
            <p className="mt-2 text-base leading-relaxed text-text-secondary">
              助手会读取 {elder.name} 的档案、最近 30 天健康数据、趋势信号和跌倒风险，生成今日健康摘要与照护建议，并自动创建照护任务和提醒。
            </p>
            <button onClick={runAgent} disabled={running} className="yc-btn-primary mt-5 min-h-16 px-8 text-xl disabled:opacity-60">
              {running ? <><RefreshCw className="h-6 w-6 animate-spin" aria-hidden="true" /> 分析中…</> : "生成今日健康摘要"}
            </button>
            {error && <p className="mt-4 rounded-xl bg-red-50 px-5 py-3 text-lg text-red-700">{error}</p>}
          </section>

          {result && (
            <>
              <section className="rounded-2xl border-2 border-border bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-text-primary">今日健康摘要</h2>
                  <span className="yc-badge yc-badge-brand">{STATUS_LABEL[result.output.overall_status] ?? result.output.overall_status}</span>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-text-primary">{result.output.summary}</p>
                <p className="mt-3 text-sm text-text-muted">
                  生成方式：{result.output.mode === "llm" ? `大模型增强（${result.run.model ?? "LLM"}）+ 规则引擎` : "规则引擎（未配置 LLM_API_KEY）"}
                  {" "}· 工具：{result.output.tools_used?.join(" → ")}
                </p>
              </section>

              {result.output.findings?.length > 0 && (
                <section className="rounded-2xl border-2 border-gold-200 bg-gold-50 p-6">
                  <h2 className="text-xl font-bold text-gold-800">需要关注</h2>
                  <ul className="mt-3 space-y-2">
                    {result.output.findings.map((f: any, i: number) => (
                      <li key={i} className="rounded-xl bg-white/80 px-4 py-3 text-lg text-text-primary">{f.description}</li>
                    ))}
                  </ul>
                </section>
              )}

              {result.output.recommendations?.length > 0 && (
                <section className="rounded-2xl border-2 border-border bg-white p-6">
                  <h2 className="text-xl font-bold text-text-primary">今日建议</h2>
                  <ul className="mt-3 list-disc space-y-1 pl-6 text-lg text-text-secondary">
                    {result.output.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                </section>
              )}

              {result.output.alerts?.length > 0 && (
                <section className="rounded-2xl border-2 border-border bg-white p-6">
                  <h2 className="text-xl font-bold text-text-primary">已创建的提醒</h2>
                  <ul className="mt-3 space-y-2">
                    {result.output.alerts.map((a: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl bg-silver-50 px-4 py-3">
                        <span className={ALERT_LEVEL_COLOR[a.level] ?? "yc-badge"}>{ALERT_LEVEL_LABEL[a.level] ?? `L${a.level}`}</span>
                        <div className="text-lg">
                          <p className="font-semibold text-text-primary">{a.title}</p>
                          <p className="mt-1 text-base text-text-secondary">{a.message}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {result.familyReport && (
                <section className="rounded-2xl border-2 border-border bg-white p-6">
                  <h2 className="text-xl font-bold text-text-primary">家属报告（可复制发送）</h2>
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-silver-50 p-4 text-base leading-relaxed text-text-secondary">{result.familyReport}</pre>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </ElderShell>
  );
}
