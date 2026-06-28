"use client";
import { use } from "react";
import { ToolLayout } from "@/components/shared";
import { mockSolutions } from "@/lib/mock/solutions";

export default function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const solution = mockSolutions.find((s) => s.slug === slug);

  if (!solution) {
    return (
      <ToolLayout title="方案未找到" description="该解决方案不存在">
        <a href="/solutions" className="yc-btn-primary text-xs">返回解决方案</a>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title={solution.name}
      description={`面向${solution.targetCustomer}的 AI 养老服务解决方案`}
      breadcrumbs={[{ label: "解决方案", href: "/solutions" }, { label: solution.shortName, href: "#" }]}
    >
      <div className="space-y-8">
        {/* Target customer */}
        <div className="yc-card p-6">
          <h2 className="text-base font-semibold">目标客户</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{solution.targetCustomer}</p>
        </div>

        {/* Pain points */}
        <div className="yc-card p-6">
          <h2 className="text-base font-semibold">现在的痛点</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {solution.painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-[var(--color-silver-50)] p-3">
                <span className="mt-0.5 text-red-400">✕</span>
                <span className="text-sm text-[var(--color-text-secondary)]">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How we help */}
        <div className="yc-card p-6">
          <h2 className="text-base font-semibold">Aging AI Engine 如何解决</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {solution.howWeHelp.map((h, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-[var(--color-brand-50)] p-3">
                <span className="mt-0.5 text-[var(--color-brand-500)]">✓</span>
                <span className="text-sm text-[var(--color-text-secondary)]">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product modules */}
        <div className="yc-card p-6">
          <h2 className="text-base font-semibold">对应产品模块</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {solution.productModules.map((m) => (
              <span key={m} className="rounded-full bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] px-3 py-1.5 text-xs text-[var(--color-brand-700)]">{m}</span>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="yc-card p-6">
          <h2 className="text-base font-semibold">典型工作流</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {solution.workflow.map((w, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="rounded-md bg-[var(--color-silver-100)] px-3 py-1.5 text-xs">{w}</span>
                {i < solution.workflow.length - 1 && <span className="text-[var(--color-text-muted)]">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Demo screenshot placeholder */}
        <div className="rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-silver-50)] p-12 text-center">
          <span className="text-4xl">🖥️</span>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">Demo 截图占位</p>
        </div>

        {/* Pricing */}
        <div className="yc-card border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-6 text-center">
          <h3 className="text-base font-semibold">推荐方案：{solution.pricingTier}</h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">查看适合您的价格方案</p>
          <div className="mt-4 flex justify-center gap-3">
            <a href="/pricing" className="yc-btn-primary text-xs">查看定价</a>
            <a href="/demo" className="yc-btn-secondary text-xs">预约演示</a>
            <a href="/contact" className="yc-btn-secondary text-xs">联系合作</a>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
