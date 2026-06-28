"use client";
import { SiteHeader, SiteFooter, CTASection } from "@/components/shared";
import { mockSolutions } from "@/lib/mock/solutions";

const ICONS: Record<string, string> = {
  "elder-family": "👨‍👩‍👧", "medical-companion-company": "🏥", "home-care-agency": "💊",
  "community-care-station": "🏘️", "nursing-home": "🏢", "aging-modification-company": "🔧",
  "smart-aging-hardware": "📡", "government-park": "🏛️", "silver-economy-research": "📚",
};

export default function SolutionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">解决方案</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              为不同类型的养老服务组织和企业提供定制化 AI 解决方案
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockSolutions.map((s) => (
              <a key={s.id} href={`/solutions/${s.slug}`}
                className="yc-card group flex flex-col gap-3 p-6 transition hover:border-[var(--color-brand-300)] hover:shadow-lg">
                <span className="text-3xl">{ICONS[s.slug] || "📋"}</span>
                <h3 className="text-base font-semibold group-hover:text-[var(--color-brand-600)]">{s.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)]">{s.targetCustomer}</p>
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--color-brand-600)]">查看方案 →</span>
                  <span className="yc-badge yc-badge-brand text-[10px]">{s.pricingTier}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
