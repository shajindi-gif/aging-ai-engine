"use client";
import { useState } from "react";

const NAV = [
  { label: "免费工具", href: "/tools" },
  { label: "模板库", href: "/templates" },
  { label: "解决方案", href: "/solutions" },
  { label: "资源中心", href: "/resources" },
  { label: "开发者", href: "/developers" },
  { label: "定价", href: "/pricing" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 font-semibold text-[var(--color-brand-700)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-brand-600)] text-xs font-bold text-white">
            龄
          </span>
          <span className="hidden sm:inline">衍策银龄 AI</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}
              className="rounded-md px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)]">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <a href="/demo" className="yc-btn-secondary text-xs">查看 Demo</a>
          <a href="/tools/subsidy-checker" className="yc-btn-primary text-xs">免费试用</a>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] md:hidden"
          onClick={() => setOpen(!open)} aria-label="菜单">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-[var(--color-border)] bg-white px-4 pb-4 pt-2 md:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-50)]">
              {n.label}
            </a>
          ))}
          <div className="mt-3 flex gap-2">
            <a href="/demo" className="yc-btn-secondary flex-1 text-xs text-center">查看 Demo</a>
            <a href="/tools/subsidy-checker" className="yc-btn-primary flex-1 text-xs text-center">免费试用</a>
          </div>
        </div>
      )}
    </header>
  );
}
