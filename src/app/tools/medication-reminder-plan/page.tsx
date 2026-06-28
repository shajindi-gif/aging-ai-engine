"use client";
import { useState } from "react";
import { ToolLayout, PolicyDisclaimer, MedicalDisclaimer, DemoBadge } from "@/components/shared";
import { mockTools } from "@/lib/mock/tools";

export default function ToolPage() {
  const tool = mockTools.find((t) => t.slug === "medication-reminder-plan");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [showPartial, setShowPartial] = useState(false);

  if (!tool) return null;

  const handleSubmit = () => {
    setShowPartial(true);
    setTimeout(() => setResult("生成成功"), 800);
  };

  const isHealth = tool.category === "health" || tool.category === "care";
  const isPolicy = tool.category === "policy";

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      breadcrumbs={[{ label: "免费工具", href: "/tools" }, { label: tool.name, href: "#" }]}
    >
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Input form */}
        <div className="lg:col-span-2">
          <div className="yc-card p-6">
            <h2 className="mb-4 text-sm font-semibold">输入信息</h2>
            <div className="space-y-4">
              {tool.inputFields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      value={formData[f.key] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-400)]"
                    >
                      <option value="">请选择</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      value={formData[f.key] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-400)]"
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={formData[f.key] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-400)]"
                    />
                  )}
                </div>
              ))}
              <button onClick={handleSubmit} className="yc-btn-primary w-full py-2.5 text-sm">
                生成结果
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3">
          {!showPartial ? (
            <div className="yc-card flex min-h-[300px] items-center justify-center p-6 text-center">
              <div>
                <span className="text-4xl">📋</span>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">填写左侧信息，点击「生成结果」即可查看 AI 分析</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="yc-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <DemoBadge />
                  <span className="text-xs text-[var(--color-text-muted)]">AI 生成结果（Demo 数据）</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-[var(--color-brand-50)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-brand-700)]">📊 分析结果摘要</h3>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                      根据您提供的信息，AI 已完成初步分析。以下为结果预览（展示 60% 内容）。
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--color-silver-50)] p-4 text-sm text-[var(--color-text-secondary)]">
                    <p className="font-medium text-[var(--color-text-primary)]">✅ 已匹配 3 项相关政策/建议</p>
                    <p className="mt-1">1. 高龄津贴 — 每月 75-360 元（按年龄梯度）</p>
                    <p>2. 适老化改造补贴 — 最高 3000-6000 元/户</p>
                    <p>3. 社区助餐服务 — 每餐补贴 2-5 元</p>
                  </div>
                  <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] p-4 text-center">
                    <p className="text-sm text-[var(--color-text-muted)]">🔒 注册后可查看完整结果、保存记录、生成 PDF 报告</p>
                    <a href="/demo" className="yc-btn-primary mt-3 inline-block text-xs">免费注册查看完整结果</a>
                  </div>
                </div>
              </div>

              {/* Conversion CTA */}
              <div className="yc-card border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-6 text-center">
                <h3 className="text-sm font-semibold">升级到专业版</h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">解锁完整报告导出、批量管理、API 调用、Agent 工作台</p>
                <div className="mt-3 flex justify-center gap-2">
                  <a href="/pricing" className="yc-btn-primary text-xs">查看定价</a>
                  <a href="/demo" className="yc-btn-secondary text-xs">预约演示</a>
                </div>
              </div>

              {isPolicy && <PolicyDisclaimer />}
              {isHealth && <MedicalDisclaimer />}
            </div>
          )}
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-10">
        <h3 className="mb-4 text-sm font-semibold">相关工具推荐</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tool.relatedTools.map((rSlug) => {
            const related = mockTools.find((t) => t.slug === rSlug);
            if (!related) return null;
            return (
              <a key={rSlug} href={`/tools/${rSlug}`}
                className="yc-card p-4 transition hover:border-[var(--color-brand-300)]">
                <h4 className="text-sm font-medium">{related.name}</h4>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{related.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
