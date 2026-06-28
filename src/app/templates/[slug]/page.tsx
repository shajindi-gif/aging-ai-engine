"use client";
import { use } from "react";
import { ToolLayout, DemoBadge } from "@/components/shared";
import { mockTemplates } from "@/lib/mock/templates";

export default function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const template = mockTemplates.find((t) => t.slug === slug);

  if (!template) {
    return (
      <ToolLayout title="模板未找到" description="该模板不存在">
        <a href="/templates" className="yc-btn-primary text-xs">返回模板库</a>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title={template.name}
      description={template.description}
      breadcrumbs={[{ label: "模板库", href: "/templates" }, { label: template.name, href: "#" }]}
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          {/* Template info */}
          <div className="yc-card p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="yc-badge yc-badge-brand">{template.category}</span>
              <DemoBadge />
            </div>
            <h2 className="text-lg font-semibold">{template.name}</h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{template.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-[var(--color-silver-50)] p-3">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">适用对象</span>
                <p className="mt-1 text-sm">{template.targetAudience}</p>
              </div>
              <div className="rounded-lg bg-[var(--color-silver-50)] p-3">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">使用场景</span>
                <p className="mt-1 text-sm">{template.useCase}</p>
              </div>
            </div>
          </div>

          {/* Input fields */}
          <div className="yc-card p-6">
            <h3 className="mb-3 text-sm font-semibold">输入字段</h3>
            <div className="flex flex-wrap gap-2">
              {template.inputFields.map((f) => (
                <span key={f} className="rounded-full bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] px-3 py-1 text-xs text-[var(--color-brand-700)]">{f}</span>
              ))}
            </div>
          </div>

          {/* Output sample */}
          <div className="yc-card p-6">
            <h3 className="mb-3 text-sm font-semibold">输出样例</h3>
            <div className="rounded-lg bg-[var(--color-silver-50)] p-4 text-sm text-[var(--color-text-secondary)]">
              {template.outputSample}
            </div>
          </div>
        </div>

        {/* Sidebar actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="yc-card p-6 text-center">
            <h3 className="text-sm font-semibold">使用此模板</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">输入信息，一键生成专业文档</p>
            <div className="mt-4 space-y-2">
              <button className="yc-btn-primary w-full py-2.5 text-sm">一键生成</button>
              <button className="yc-btn-secondary w-full text-xs">保存到 SaaS 后台</button>
            </div>
          </div>
          <div className="yc-card border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-6 text-center">
            <h3 className="text-sm font-semibold">升级专业版</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">解锁全部 35 个模板、自定义字段、批量生成、PDF 导出</p>
            <a href="/pricing" className="yc-btn-primary mt-3 inline-block text-xs">查看定价</a>
          </div>
        </div>
      </div>

      {/* Related templates */}
      <div className="mt-10">
        <h3 className="mb-4 text-sm font-semibold">相关模板</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockTemplates.filter((t) => t.category === template.category && t.id !== template.id).slice(0, 3).map((t) => (
            <a key={t.id} href={`/templates/${t.slug}`} className="yc-card p-4 transition hover:border-[var(--color-brand-300)]">
              <h4 className="text-sm font-medium">{t.name}</h4>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t.description}</p>
            </a>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
