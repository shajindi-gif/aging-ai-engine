"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartPulse, ClipboardList, Stethoscope, MessageCircleHeart, Phone, ArrowLeft, ShieldAlert } from "lucide-react";
import { MEDICAL_DISCLAIMER_TEXT } from "@/lib/silvercare/ui";
import type { ReactNode } from "react";

/**
 * 老人端外壳 — 大字体 / 少层级 / 高对比
 * 导航只有 5 个入口：今日、健康检测、AI 助手、联系家人、返回
 */
export default function ElderShell({
  title,
  active,
  elderId,
  elderName,
  children,
}: {
  title: string;
  active: "today" | "check" | "mobility" | "assistant" | "family";
  elderId?: string;
  elderName?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const q = elderId ? `?elder=${elderId}` : "";

  const navItems = [
    { key: "today", label: "今日", href: `/elder${q}`, icon: HeartPulse },
    { key: "check", label: "健康检测", href: `/elder/check${q}`, icon: ClipboardList },
    { key: "mobility", label: "活动测试", href: `/elder/mobility${q}`, icon: Stethoscope },
    { key: "assistant", label: "AI 助手", href: `/elder/assistant${q}`, icon: MessageCircleHeart },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 border-b-2 border-border bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white">龄</span>
            <div>
              <p className="text-xl font-bold text-text-primary">银龄健康助手</p>
              {elderName && <p className="text-base text-text-secondary">{elderName} 的健康主页</p>}
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 rounded-xl border-2 border-border px-4 py-3 text-lg font-medium text-text-secondary hover:bg-silver-50"
            aria-label="返回网站首页"
          >
            <ArrowLeft className="h-5 w-5" /> 退出
          </button>
        </div>
        {/* 大号导航 */}
        <nav className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 pb-3" aria-label="老人端导航">
          {navItems.map((n) => (
            <Link
              key={n.key}
              href={n.href}
              aria-current={active === n.key ? "page" : undefined}
              className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-lg font-semibold transition ${
                active === n.key ? "bg-brand-600 text-white" : "bg-silver-100 text-text-primary hover:bg-silver-200"
              }`}
            >
              <n.icon className="h-6 w-6" aria-hidden="true" />
              {n.label}
            </Link>
          ))}
          <a
            href="tel:"
            className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-gold-50 px-4 text-lg font-semibold text-gold-700 ring-2 ring-gold-200"
          >
            <Phone className="h-6 w-6" aria-hidden="true" />
            联系家人
          </a>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-text-primary">{title}</h1>
        {children}
      </main>

      <footer className="border-t border-border bg-silver-50 px-5 py-5">
        <div className="mx-auto flex max-w-5xl items-start gap-3">
          <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="text-base leading-relaxed text-text-secondary">{MEDICAL_DISCLAIMER_TEXT}</p>
        </div>
      </footer>
    </div>
  );
}
