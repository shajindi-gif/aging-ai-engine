"use client";
import { SiteHeader, SiteFooter, CTASection } from "@/components/shared";
import { mockTools } from "@/lib/mock/tools";

const CATEGORIES = [
  { key: "all", label: "全部" },
  { key: "policy", label: "政策类" },
  { key: "care", label: "护理类" },
  { key: "health", label: "健康类" },
  { key: "sales", label: "销售类" },
  { key: "operations", label: "运营类" },
];

const CAT_ICONS: Record<string, string> = { policy: "📖", care: "💊", health: "❤️", sales: "📊", operations: "⚙️" };

export default function ToolsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">免费 AI 养老工具</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              输入简单信息，立即获得结构化结果。无需注册，即开即用。
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockTools.map((t) => (
              <a key={t.id} href={`/tools/${t.slug}`}
                className="yc-card group flex flex-col gap-3 p-6 transition hover:border-[var(--color-brand-300)] hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CAT_ICONS[t.category] || "🔧"}</span>
                  <h3 className="text-base font-semibold group-hover:text-[var(--color-brand-600)]">{t.name}</h3>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">{t.description}</p>
                <span className="mt-auto text-xs font-medium text-[var(--color-brand-600)]">立即试用 →</span>
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
