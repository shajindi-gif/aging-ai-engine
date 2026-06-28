"use client";
import { useState } from "react";
import { SiteHeader, SiteFooter, CTASection } from "@/components/shared";
import { mockTemplates } from "@/lib/mock/templates";

const CATEGORIES = [
  { key: "all", label: "全部", icon: "📁" },
  { key: "family", label: "家属沟通", icon: "👨‍👩‍👧" },
  { key: "service", label: "服务记录", icon: "📋" },
  { key: "policy", label: "政策申报", icon: "📖" },
  { key: "operations", label: "机构运营", icon: "⚙️" },
  { key: "sales", label: "销售线索", icon: "📊" },
];

export default function TemplatesPage() {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = mockTemplates.filter((t) => {
    if (cat !== "all" && t.category !== cat) return false;
    if (search && !t.name.includes(search) && !t.description.includes(search)) return false;
    return true;
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">养老服务模板库</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              35+ 专业模板，覆盖家属沟通、服务记录、政策申报、机构运营、销售线索五大场景
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.key} onClick={() => setCat(c.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${cat === c.key ? "bg-[var(--color-brand-600)] text-white" : "bg-[var(--color-silver-100)] text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-50)]"}`}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模板..." className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm sm:w-48" />
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <a key={t.id} href={`/templates/${t.slug}`}
                className="yc-card group flex flex-col gap-3 p-5 transition hover:border-[var(--color-brand-300)] hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="yc-badge yc-badge-brand">{CATEGORIES.find((c) => c.key === t.category)?.label}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{t.targetAudience}</span>
                </div>
                <h3 className="text-sm font-semibold group-hover:text-[var(--color-brand-600)]">{t.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)]">{t.description}</p>
                <span className="mt-auto text-xs font-medium text-[var(--color-brand-600)]">查看详情 →</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
            共 {filtered.length} 个模板
          </p>
        </div>
        <CTASection title="开通专业版，解锁全部模板和自定义功能" />
      </main>
      <SiteFooter />
    </>
  );
}
