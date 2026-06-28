"use client";
import { use } from "react";
import { ToolLayout, PolicyDisclaimer } from "@/components/shared";
import { mockCityPages } from "@/lib/mock/city-pages";

export default function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const city = mockCityPages.find((c) => c.slug === slug);

  if (!city) {
    return (
      <ToolLayout title="城市未找到" description="该城市页面不存在">
        <a href="/resources" className="yc-btn-primary text-xs">返回资源中心</a>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title={`${city.name}养老政策与服务指南`}
      description={`${city.name}养老政策汇总：高龄津贴、长期护理保险、适老化改造、社区助餐等`}
      breadcrumbs={[{ label: "资源中心", href: "/resources" }, { label: "城市政策", href: "/resources/city-aging-policy" }, { label: city.name, href: "#" }]}
    >
      <div className="space-y-6">
        {/* City overview */}
        <div className="yc-card p-6">
          <h2 className="text-base font-semibold">{city.name}养老概况</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">{city.policySummary}</p>
        </div>

        {/* Policy details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="yc-card p-5">
            <h3 className="text-sm font-semibold">🎂 高龄津贴</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{city.elderlyAllowance}</p>
          </div>
          <div className="yc-card p-5">
            <h3 className="text-sm font-semibold">🏥 长期护理保险</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{city.longTermCare}</p>
          </div>
          <div className="yc-card p-5">
            <h3 className="text-sm font-semibold">🔧 适老化改造</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{city.homeModification}</p>
          </div>
          <div className="yc-card p-5">
            <h3 className="text-sm font-semibold">🍽️ 社区助餐</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{city.communityMeal}</p>
          </div>
        </div>

        {/* Home care */}
        <div className="yc-card p-5">
          <h3 className="text-sm font-semibold">🏠 居家养老服务</h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{city.homeCare}</p>
        </div>

        {/* Institution types */}
        <div className="yc-card p-5">
          <h3 className="text-sm font-semibold">🏢 {city.name}养老机构类型</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {city.institutionTypes.map((t) => (
              <span key={t} className="rounded-full bg-[var(--color-silver-100)] px-3 py-1 text-xs">{t}</span>
            ))}
          </div>
        </div>

        {/* Suitable tools */}
        <div className="yc-card p-5">
          <h3 className="text-sm font-semibold">🔍 适合使用的工具</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <a href="/tools/subsidy-checker" className="rounded-lg bg-[var(--color-brand-50)] p-3 text-sm hover:bg-[var(--color-brand-100)]">🎯 养老补贴资格初筛</a>
            <a href="/tools/policy-materials-generator" className="rounded-lg bg-[var(--color-brand-50)] p-3 text-sm hover:bg-[var(--color-brand-100)]">📋 政策申报材料清单生成器</a>
            <a href="/tools/home-aging-modification-checklist" className="rounded-lg bg-[var(--color-brand-50)] p-3 text-sm hover:bg-[var(--color-brand-100)]">🏠 适老化改造清单生成器</a>
            <a href="/tools/elder-risk-check" className="rounded-lg bg-[var(--color-brand-50)] p-3 text-sm hover:bg-[var(--color-brand-100)]">⚠️ 老人照护风险初筛</a>
          </div>
        </div>

        {/* Related policies */}
        <div className="yc-card p-5">
          <h3 className="text-sm font-semibold">📖 相关政策</h3>
          <div className="mt-3 space-y-2">
            {city.relatedPolicies.map((p) => (
              <div key={p.title} className="flex items-center gap-3 rounded-lg bg-[var(--color-silver-50)] p-3">
                <span className="yc-badge yc-badge-brand">{p.type}</span>
                <span className="text-sm">{p.title}</span>
              </div>
            ))}
          </div>
        </div>

        <PolicyDisclaimer />
      </div>
    </ToolLayout>
  );
}
