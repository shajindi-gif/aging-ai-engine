"use client";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import CTASection from "./CTASection";
import type { ReactNode } from "react";

interface ToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function ToolLayout({ children, title, description, breadcrumbs }: ToolLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]">
            <div className="mx-auto max-w-7xl px-4 py-2.5 text-xs text-[var(--color-text-muted)] sm:px-6 lg:px-8">
              {breadcrumbs.map((b, i) => (
                <span key={b.href}>
                  {i > 0 && <span className="mx-1">/</span>}
                  <a href={b.href} className="hover:text-[var(--color-brand-600)]">{b.label}</a>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]/50">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{title}</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
