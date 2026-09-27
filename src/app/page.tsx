"use client";
import Link from "next/link";
import {
  SiteHeader,
  SiteFooter,
  CTASection,
} from "@/components/shared";
import { PolicyDisclaimer, MedicalDisclaimer } from "@/components/shared/DisclaimerBanner";
import {
  Search,
  ArrowRight,
  BookOpen,
  HeartPulse,
  Building2,
  Home,
  Users,
  ClipboardList,
  Wrench,
  Landmark,
  FileText,
  BookMarked,
} from "lucide-react";

const SCENARIOS = [
  { icon: Home, title: "我想给父母找陪诊 / 护理服务", href: "/solutions/elder-family" },
  { icon: Search, title: "我想知道父母能申请哪些养老补贴", href: "/tools/subsidy-checker" },
  { icon: HeartPulse, title: "我是陪诊公司，想管理客户和订单", href: "/solutions/medical-companion-company" },
  { icon: Users, title: "我是社区养老服务站，想管理老人档案", href: "/solutions/community-care-station" },
  { icon: Wrench, title: "我是适老化改造企业，想找机构和家庭线索", href: "/solutions/aging-modification-company" },
  { icon: Landmark, title: "我是园区 / 街道，想做区域养老服务数据平台", href: "/solutions/government-park" },
];

const PRODUCTS = [
  { icon: BookOpen, name: "政策数据库", title: "银发经济政策数据库", desc: "汇集各地养老政策与补贴信息，AI 智能匹配资格，持续扩充覆盖。", href: "/policies" },
  { icon: HeartPulse, name: "服务管理", title: "陪诊护理服务 CRM", desc: "老人档案、订单管理、服务记录、家属通知，一站式闭环。", href: "/care-crm" },
  { icon: Building2, name: "线索经营", title: "养老机构销售线索库", desc: "机构画像与数字化成熟度评分，支撑销售线索管理。", href: "/institutions" },
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
  { label: "已收录养老政策", value: "1,000+" },
  { label: "已覆盖城市", value: "30+" },
  { label: "已整理养老机构", value: "5,000+" },
  { label: "已支持服务场景", value: "10+" },
  { label: "已内置服务模板", value: "35+" },
];

export default function HomePage() {

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section text-center">
            <div className="mx-auto max-w-3xl">
              <span className="yc-eyebrow">YanglaoAI · SilverCare OS</span>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl">
                面向老年人的 AI 健康风险预测、康复与照护操作系统
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
                通过计算机视觉、健康数据分析和 AI Agent，持续识别老年人的跌倒、衰弱与健康异常趋势，并协同家属、护理员和社区完成日常照护。
              </p>
            </div>

            {/* 主行动 */}
            <div className="mx-auto mt-9 flex max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/elder/mobility" className="yc-btn-primary w-full px-7 py-3.5 text-base sm:w-auto">
                体验 AI 健康评估
              </Link>
              <Link href="/family" className="yc-btn-secondary w-full px-7 py-3.5 text-base sm:w-auto">
                查看 Demo
              </Link>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              演示数据为虚构家庭。本产品用于健康管理与风险提示，不替代专业医疗诊断。
            </p>
          </div>
        </section>

        {/* ── 数据条 ── */}
        <section className="border-b border-border bg-white">
          <div className="yc-container py-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold tracking-tight text-text-primary">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-text-muted">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] text-text-muted">以上为产品演示示例数据</p>
          </div>
        </section>

        {/* ── 三大核心产品 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">核心产品</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                覆盖政策、服务与增长的三条产品线
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PRODUCTS.map((p) => (
                <Link key={p.href} href={p.href} className="yc-card group flex flex-col">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">{p.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                    了解更多 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 六大高频场景 ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">按角色进入</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                找到适合你的解决方案
              </h2>
            </div>
            <div className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
              {SCENARIOS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-silver-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-silver-100 text-silver-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                    <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-text-primary">{s.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 免费 AI 工具 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="max-w-2xl">
                <span className="yc-eyebrow">免费工具</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                  输入信息，立即获得结构化结果
                </h2>
                <p className="mt-2 text-sm text-text-secondary">无需注册，即可体验 AI 辅助生成能力。</p>
              </div>
              <Link href="/tools" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                查看全部工具 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS_PREVIEW.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex flex-col rounded-xl border border-border bg-white p-5 transition-colors hover:border-brand-300"
                >
                  <h3 className="text-sm font-semibold text-text-primary">{t.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-text-secondary">{t.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                    立即使用 <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 模板 + 资源 ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="yc-card flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">服务模板库</h3>
                  <p className="mt-1 text-sm text-text-secondary">35+ 养老服务报告、通知、清单模板，一键生成专业文档。</p>
                  <Link href="/templates" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                    浏览模板库 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="yc-card flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <BookMarked className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">资源与城市政策</h3>
                  <p className="mt-1 text-sm text-text-secondary">城市养老政策专题、行业指南与照护指南。</p>
                  <Link href="/resources" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                    浏览资源中心 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 开发者入口 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="rounded-2xl bg-silver-900 p-8 text-white sm:p-12">
              <h2 className="text-2xl font-semibold tracking-tight">开发者与 API</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-silver-300">
                TypeScript SDK、MCP Server、Chrome 插件，快速集成养老服务能力到你的产品和工作流。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/developers" className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-silver-900 transition hover:bg-silver-100">
                  查看文档
                </Link>
                <Link href="/developers" className="rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">
                  SDK &amp; API
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 免责声明 */}
        <section className="yc-container pb-10">
          <div className="mx-auto max-w-3xl space-y-3">
            <PolicyDisclaimer />
            <MedicalDisclaimer />
          </div>
        </section>

        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
