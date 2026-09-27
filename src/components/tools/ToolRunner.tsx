"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Tool } from "@/lib/mock/tools";
import { TOOL_GENERATORS, TOOL_REQUIRED, TOOL_HEALTH_HINT } from "@/lib/tools/engine";
import type { ToolResult } from "@/lib/tools/engine";
import { PolicyDisclaimer, MedicalDisclaimer } from "@/components/shared/DisclaimerBanner";
import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";

export default function ToolRunner({ tool }: { tool: Tool }) {
  const params = useSearchParams();
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    // 支持 URL 参数预填（如首页补贴输入带入）：字段名或 q 参数
    const pre: Record<string, string> = {};
    for (const f of tool.inputFields) {
      const v = params.get(f.key);
      if (v) pre[f.key] = v;
    }
    return pre;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ToolResult | null>(null);
  const [generating, setGenerating] = useState(false);

  const required = TOOL_REQUIRED[tool.slug] ?? [];
  const generator = TOOL_GENERATORS[tool.slug];
  const healthHint = TOOL_HEALTH_HINT[tool.slug];
  const hasUrlPrefill = tool.inputFields.some((f) => params.get(f.key));
  const noteText = params.get("note") || "";

  function validate(): boolean {
    const errs: Record<string, string> = {};
    for (const key of required) {
      const v = (formData[key] ?? "").trim();
      const field = tool.inputFields.find((f) => f.key === key);
      if (!v) errs[key] = `请填写「${field?.label ?? key}」`;
      else if (field?.type === "number" && !Number.isFinite(Number(v))) errs[key] = "请输入有效数字";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!validate()) return;
    setGenerating(true);
    // 本地规则计算，无网络请求；短暂延迟仅用于呈现生成过程
    setTimeout(() => {
      setResult(generator({ ...formData }));
      setGenerating(false);
    }, 400);
  }

  const isHealth = tool.category === "health" || tool.category === "care";
  const isPolicy = tool.category === "policy";

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* 输入表单 */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="yc-card p-6" noValidate>
          <h2 className="mb-1 text-sm font-semibold text-text-primary">输入信息</h2>
          <p className="mb-4 text-xs text-text-muted">带 * 为必填项，全部计算在本页面完成，数据不会被上传或保存。</p>
          {noteText && (
            <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5">
              <p className="text-xs font-semibold text-brand-800">您在上一页输入的原始内容（请核对并转填到下方字段）</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{noteText}</p>
            </div>
          )}
          {hasUrlPrefill && (
            <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs text-text-secondary">
              已自动带入可识别的字段（如城市、年龄），请核对并补充其余必填项。
            </div>
          )}
          <div className="space-y-4">
            {tool.inputFields.map((f) => {
              const err = errors[f.key];
              const need = required.includes(f.key);
              return (
                <div key={f.key}>
                  <label htmlFor={`tf-${f.key}`} className="mb-1 block text-xs font-medium text-text-secondary">
                    {f.label}{need && <span className="ml-0.5 text-danger">*</span>}
                  </label>
                  {f.type === "select" ? (
                    <select
                      id={`tf-${f.key}`}
                      value={formData[f.key] || ""}
                      onChange={(e) => { setFormData({ ...formData, [f.key]: e.target.value }); setErrors((p) => ({ ...p, [f.key]: "" })); }}
                      aria-invalid={!!err}
                      className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 ${err ? "border-danger" : "border-[var(--color-border)]"}`}
                    >
                      <option value="">请选择</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      id={`tf-${f.key}`}
                      value={formData[f.key] || ""}
                      onChange={(e) => { setFormData({ ...formData, [f.key]: e.target.value }); setErrors((p) => ({ ...p, [f.key]: "" })); }}
                      placeholder={f.placeholder}
                      rows={3}
                      aria-invalid={!!err}
                      className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand-400 ${err ? "border-danger" : "border-[var(--color-border)]"}`}
                    />
                  ) : (
                    <input
                      id={`tf-${f.key}`}
                      type={f.type === "number" ? "number" : "text"}
                      value={formData[f.key] || ""}
                      onChange={(e) => { setFormData({ ...formData, [f.key]: e.target.value }); setErrors((p) => ({ ...p, [f.key]: "" })); }}
                      placeholder={f.placeholder}
                      aria-invalid={!!err}
                      className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand-400 ${err ? "border-danger" : "border-[var(--color-border)]"}`}
                    />
                  )}
                  {err && <p role="alert" className="mt-1 text-xs text-danger">{err}</p>}
                </div>
              );
            })}
            <button type="submit" disabled={generating} className="yc-btn-primary w-full py-2.5 text-sm disabled:opacity-60">
              {generating ? "生成中…" : "生成结果"}
            </button>
          </div>
        </form>

        {healthHint && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-gold-200 bg-gold-50 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-text-secondary">{healthHint}</p>
          </div>
        )}
      </div>

      {/* 结果区 */}
      <div className="lg:col-span-3">
        {!result ? (
          <div className="yc-card flex min-h-[300px] items-center justify-center p-6 text-center">
            <div>
              <Sparkles className="mx-auto h-10 w-10 text-silver-300" aria-hidden="true" />
              <p className="mt-3 text-sm text-text-muted">
                {generating ? "正在按规则整理您的输入…" : "填写左侧信息并点击「生成结果」。结果由本页规则模板根据您的输入生成。"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="yc-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="yc-badge yc-badge-gold">虚构样例演示</span>
                <span className="text-xs text-text-muted">本页结果由规则模板根据您的输入即时生成，未调用外部 AI 或政策数据库。</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-text-primary">{result.summary}</p>
              <div className="mt-4 space-y-4">
                {result.sections.map((s, idx) => (
                  <div key={idx} className={`rounded-lg p-4 ${s.tone === "warning" ? "bg-gold-50" : s.tone === "positive" ? "bg-brand-50" : "bg-silver-50"}`}>
                    <h3 className="text-sm font-semibold text-text-primary">{s.heading}</h3>
                    <ul className="mt-2 space-y-1.5">
                      {s.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
                          <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${s.tone === "warning" ? "text-gold-600" : "text-brand-500"}`} aria-hidden="true" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {result.notes.length > 0 && (
                <div className="mt-4 space-y-1 border-t border-border pt-3">
                  {result.notes.map((n, i) => (
                    <p key={i} className="text-xs leading-relaxed text-text-muted">{n}</p>
                  ))}
                </div>
              )}
            </div>

            {isPolicy && <PolicyDisclaimer />}
            {isHealth && <MedicalDisclaimer />}
          </div>
        )}
      </div>
    </div>
  );
}
