"use client";
import { SiteHeader, SiteFooter, CTASection } from "@/components/shared";
import { mockSEOPages } from "@/lib/mock/growth-data";
import { mockCityPages } from "@/lib/mock/city-pages";

const CAT_LABELS: Record<string, string> = { policy: "政策", service: "服务", product: "产品", industry: "行业", guide: "指南" };

export default function ResourcesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">资源中心</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              中国养老政策数据库、城市专题、行业指南和实用知识库
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Resource pages */}
          <h2 className="mb-4 text-lg font-semibold">专题内容</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockSEOPages.map((p) => (
              <a key={p.slug} href={`/resources/${p.slug}`}
                className="yc-card group p-5 transition hover:border-[var(--color-brand-300)] hover:shadow-md">
                <span className="yc-badge yc-badge-brand mb-2">{CAT_LABELS[p.category] || p.category}</span>
                <h3 className="mt-2 text-sm font-semibold group-hover:text-[var(--color-brand-600)]">{p.title}</h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{p.description}</p>
              </a>
            ))}
          </div>

          {/* City pages */}
          <h2 className="mb-4 mt-10 text-lg font-semibold">城市养老政策</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mockCityPages.map((c) => (
              <a key={c.slug} href={`/city/${c.slug}`}
                className="yc-card p-4 transition hover:border-[var(--color-brand-300)] hover:shadow-md">
                <h3 className="text-sm font-semibold">{c.name}</h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{c.province} · {c.institutionTypes.length} 类养老机构</p>
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
