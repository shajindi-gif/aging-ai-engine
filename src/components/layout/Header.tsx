"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/products", label: "产品" },
  { href: "/policies", label: "政策库" },
  { href: "/care-crm", label: "CRM" },
  { href: "/elders", label: "老人档案" },
  { href: "/institutions", label: "机构线索" },
  { href: "/agents", label: "Agent" },
  { href: "/pricing", label: "定价" },
  { href: "/docs", label: "文档" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-lg font-semibold text-text-primary">
            银龄AI
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/contact" className="yc-btn-secondary text-sm">
            联系我们
          </Link>
          <Link href="/dashboard" className="yc-btn-primary text-sm">
            进入工作台
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-silver-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border lg:hidden transition-all duration-200",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-silver-100 hover:text-brand-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-silver-100"
            onClick={() => setMobileOpen(false)}
          >
            联系我们
          </Link>
          <Link
            href="/dashboard"
            className="yc-btn-primary mt-2 w-full justify-center"
            onClick={() => setMobileOpen(false)}
          >
            进入工作台
          </Link>
        </nav>
      </div>
    </header>
  );
}
