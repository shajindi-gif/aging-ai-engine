"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/policies", label: "政策库" },
  { href: "/care-crm", label: "陪诊 CRM" },
  { href: "/institutions", label: "机构线索" },
  { href: "/tools", label: "AI 工具" },
  { href: "/solutions", label: "解决方案" },
  { href: "/pricing", label: "定价" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="衍策银龄 AI 首页"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white shadow-sm">
            龄
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-text-primary">
            衍策银龄 AI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-brand-700"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className="yc-btn-ghost">
            登录
          </Link>
          <Link href="/register" className="yc-btn-primary">
            免费试用
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-silver-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border bg-white transition-[max-height] duration-200 lg:hidden",
          mobileOpen ? "max-h-[calc(100vh-4rem)] overflow-y-auto" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="移动端导航">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-text-secondary hover:bg-silver-100 hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="yc-btn-secondary w-full justify-center">
              登录
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="yc-btn-primary w-full justify-center">
              免费试用
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
