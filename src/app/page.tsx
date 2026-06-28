"use client";
import { useState } from "react";
import { SiteHeader, SiteFooter, CTASection, DemoBadge } from "@/components/shared";
import { PolicyDisclaimer, MedicalDisclaimer } from "@/components/shared/DisclaimerBanner";

const SCENARIOS = [
  { icon: "🏠", title: "我想给父母找陪诊/护理服务", href: "/solutions/elder-family" },
  { icon: "💰", title: "我想知道父母能不能申请养老补贴", href: "/tools/subsidy-checker" },
  { icon: "🏥", title: "我是陪诊公司，想管理客户和订单", href: "/solutions/medical-companion-company" },
  { icon: "📋", title: "我是社区养老服务站，想管理老人档案", href: "/solutions/community-care-station" },
  { icon: "🔧", title: "我是适老化改造企业，想找机构和家庭线索", href: "/solutions/aging-modification-company" },
  { icon: "🏛️", title: "我是园区/街道，想做区域养老服务数据平台", href: "/solutions/government-park" },
];

const PRODUCTS = [
  { icon: "📖", title: "银发经济政策数据库", desc: "收录全国1000+养老政策，AI智能匹配，覆盖30+城市", href: "/policies" },
  { icon: "💊", title: "陪诊护理服务CRM", desc: "老人档案、订单管理、服务记录、家属通知一站式", href: "/care-crm" },
  { icon: "🏢", title: "养老机构销售线索库", desc: "5000+养老机构画像，数字化评分，销售线索管理", href: "/institutions" },
];

const TOOLS_PREVIEW = [
  { name: "养老补贴资格初筛", desc: "输入基本信息，快速匹配可申请的补贴政策", href: "/tools/subsidy-checker" },
  { name: "家属照护报告生成器", desc: "一键生成老人健康周报，让异地子女安心", href: "/tools/family-care-report" },
  { name: "陪诊记录总结器", desc: "就诊信息快速结构化为标准陪诊记录", href: "/tools/medical-companion-summary" },
  { name: "居家照护计划生成器", desc: "根据老人情况生成个性化照护方案", href: "/tools/care-plan-generator" },
  { name: "适老化改造清单", desc: "根据居住环境生成改造建议和预算", href: "/tools/home-aging-modification-checklist" },
  { name: "老人照护风险初筛", desc: "评估当前照护风险等级，提供改善建议", href: "/tools/elder-risk-check" },
];

const STATS = [
  { label: "已收录养老政策", value: "1,000+", note: "Demo 数据" },
  { label: "已覆盖城市", value: "30+", note: "Demo 数据" },
  { label: "已整理养老机构", value: "5,000+", note: "Demo 数据" },
  { label: "已支持服务场景", value: "10+", note: "Demo 数据" },
  { label: "已内置服务模板", value: "35+", note: "Demo 数据" },
];

export default function HomePage() {
  const [input, setInput] = useState("");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Hero: AI 工具入口型 ── */}
        <section className="yc-gradient-hero relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--color-brand-600)]">
              Aging AI Engine
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              衍策银龄 <span className="yc-text-gradient">AI</span>
            </h1>
            <p className="mt-3 text-lg font-medium text-[var(--color-text-secondary)] sm:text-xl">
              面向中国银发经济的 AI 原生养老服务基础设施
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              用 AI Agent、政策知识库和 SaaS 工作流，帮助老人家庭、陪诊护理公司、社区服务站、养老机构和银发经济企业，把养老服务从微信群、Excel 和纸质档案升级为可追踪、可提醒、可复盘、可增长的数字化系统。
            </p>

            {/* AI 输入框 */}
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="flex items-center rounded-xl border-2 border-[var(--color-brand-200)] bg-white p-1.5 shadow-lg shadow-[var(--color-brand-100)]/30 transition focus-within:border-[var(--color-brand-400)]">
                <span className="pl-3 text-xl">🔍</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入老人所在城市、年龄、照护情况，立即匹配可申请的养老补贴和服务路径"
                  className="flex-1 border-0 bg-transparent px-3 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                />
                <a href="/tools/subsidy-checker"
                  className="shrink-0 rounded-lg bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-brand-700)]">
                  立即匹配
                </a>
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                例如：上海 78岁 独居 高血压 → 为您匹配高龄津贴、长护险、适老化改造等补贴政策
              </p>
            </div>

            {/* 双入口 CTA */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/tools/subsidy-checker"
                className="yc-btn-primary w-full px-6 py-3 text-sm sm:w-auto">
                🎯 养老补贴匹配 Agent
              </a>
              <a href="/tools/family-care-report"
                className="yc-btn-primary w-full px-6 py-3 text-sm sm:w-auto" style={{ background: "var(--color-gold-600)" }}>
                📊 家属照护报告生成
              </a>
              <a href="/demo"
                className="yc-btn-secondary w-full px-6 py-3 text-sm sm:w-auto">
                查看完整 Demo
              </a>
            </div>
          </div>
        </section>

        {/* ── 社会证明 ── */}
        <section className="border-b border-[var(--color-border)] bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-center">
                  <span className="text-xl font-bold text-[var(--color-brand-600)]">{s.value}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{s.label}</span>
                  <DemoBadge />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 三大产品入口 ── */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-semibold">三大核心产品</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {PRODUCTS.map((p) => (
                <a key={p.href} href={p.href}
                  className="yc-card group flex flex-col items-start gap-3 p-6 transition hover:shadow-lg">
                  <span className="text-3xl">{p.icon}</span>
                  <h3 className="text-base font-semibold group-hover:text-[var(--color-brand-600)]">{p.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{p.desc}</p>
                  <span className="mt-auto text-xs font-medium text-[var(--color-brand-600)]">了解更多 →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 六大高频场景 ── */}
        <section className="bg-[var(--color-silver-50)] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-semibold">你是谁？找到适合你的解决方案</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SCENARIOS.map((s) => (
                <a key={s.href} href={s.href}
                  className="yc-card flex items-start gap-4 p-5 transition hover:border-[var(--color-brand-300)] hover:shadow-md">
                  <span className="mt-0.5 text-2xl">{s.icon}</span>
                  <div>
                    <h3 className="text-sm font-medium">{s.title}</h3>
                    <span className="mt-1 inline-block text-xs text-[var(--color-brand-600)]">查看方案 →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 免费工具矩阵 ── */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-semibold">免费 AI 工具</h2>
              <a href="/tools" className="text-sm text-[var(--color-brand-600)] hover:underline">查看全部 →</a>
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">输入信息，立即获得结构化结果。无需注册。</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS_PREVIEW.map((t) => (
                <a key={t.href} href={t.href}
                  className="yc-card p-5 transition hover:border-[var(--color-brand-300)] hover:shadow-md">
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t.desc}</p>
                  <span className="mt-3 inline-block text-xs font-medium text-[var(--color-brand-600)]">免费试用 →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 模板 + 资源 ── */}
        <section className="bg-[var(--color-silver-50)] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="yc-card bg-white p-6">
                <h3 className="text-base font-semibold">📄 服务模板库</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">35+ 养老服务报告、通知、清单模板，一键生成专业文档</p>
                <a href="/templates" className="mt-4 inline-block yc-btn-primary text-xs">浏览模板库</a>
              </div>
              <div className="yc-card bg-white p-6">
                <h3 className="text-base font-semibold">📚 资源与城市政策</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">12个城市养老政策专题、行业指南、SEO内容矩阵</p>
                <a href="/resources" className="mt-4 inline-block yc-btn-primary text-xs">浏览资源中心</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 开发者入口 ── */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-[var(--color-silver-900)] p-8 text-white sm:p-12">
              <h2 className="text-xl font-semibold">开发者与 API</h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--color-silver-300)]">
                TypeScript SDK、MCP Server、Chrome 插件，快速集成养老服务能力到你的产品和工作流。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/developers" className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-silver-900)] transition hover:bg-[var(--color-silver-100)]">查看文档</a>
                <a href="/developers" className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">SDK &amp; API</a>
              </div>
            </div>
          </div>
        </section>

        {/* 免责声明 */}
        <section className="mx-auto max-w-4xl px-4 pb-8">
          <PolicyDisclaimer className="mb-3" />
          <MedicalDisclaimer />
        </section>

        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
