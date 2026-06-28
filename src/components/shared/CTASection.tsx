"use client";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  variant?: "brand" | "light";
}

export default function CTASection({
  title = "开始用 AI 升级您的养老服务",
  subtitle = "免费注册，立即体验养老补贴匹配、家属报告生成等 AI 工具",
  variant = "brand",
}: CTASectionProps) {
  const isBrand = variant === "brand";
  return (
    <section className={`py-14 ${isBrand ? "bg-gradient-to-r from-[var(--color-brand-600)] to-[var(--color-brand-500)] text-white" : "bg-[var(--color-silver-50)]"}`}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className={`text-2xl font-semibold ${isBrand ? "text-white" : ""}`}>{title}</h2>
        <p className={`mt-2 text-sm ${isBrand ? "text-[var(--color-brand-100)]" : "text-[var(--color-text-secondary)]"}`}>{subtitle}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/tools/subsidy-checker"
            className={`rounded-md px-5 py-2.5 text-sm font-medium shadow-sm transition ${isBrand ? "bg-white text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]" : "bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)]"}`}>
            免费试用工具
          </a>
          <a href="/demo"
            className={`rounded-md border px-5 py-2.5 text-sm font-medium transition ${isBrand ? "border-white/30 text-white hover:bg-white/10" : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-300)]"}`}>
            预约演示
          </a>
          <a href="/pricing"
            className={`rounded-md border px-5 py-2.5 text-sm font-medium transition ${isBrand ? "border-white/30 text-white hover:bg-white/10" : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-300)]"}`}>
            查看定价
          </a>
        </div>
      </div>
    </section>
  );
}
