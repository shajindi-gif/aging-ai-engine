"use client";
import { useState } from "react";
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
  Wrench,
  Landmark,
  FileText,
  BookMarked,
  FolderOpen,
  Activity,
  MessageSquareText,
  Repeat,
  FlaskConical,
} from "lucide-react";

// 其他客群入口（主客户=陪诊/护理团队，放页面下方，各自有解决方案页）
const AUDIENCES = [
  { icon: Home, title: "老人家庭：给父母找陪诊/护理", href: "/solutions/elder-family" },
  { icon: Users, title: "社区养老服务站：管理老人档案", href: "/solutions/community-care-station" },
  { icon: Building2, title: "养老机构：床位与服务管理", href: "/solutions/nursing-home" },
  { icon: Wrench, title: "适老化改造企业：找机构与家庭线索", href: "/solutions/aging-modification-company" },
  { icon: Landmark, title: "园区/街道：区域养老数据平台", href: "/solutions/government-park" },
];

// 主客户四步工作流：每步链接到站内真实可打开的功能页（演示数据已标注）
const WORKFLOW = [
  {
    step: 1,
    icon: FolderOpen,
    title: "建立老人档案",
    desc: "基本信息、照护等级、健康基线一次录入，团队共享。",
    href: "/onboarding",
    action: "打开建档页",
  },
  {
    step: 2,
    icon: Activity,
    title: "记录每次服务",
    desc: "陪诊、护理订单与服务记录在线填写，支持风险标注。",
    href: "/care-orders",
    action: "查看订单页",
  },
  {
    step: 3,
    icon: MessageSquareText,
    title: "生成家属报告",
    desc: "服务记录自动汇总为家属周报/月报，可复制发送微信。",
    href: "/tools/family-care-report",
    action: "试用报告工具",
  },
  {
    step: 4,
    icon: Repeat,
    title: "复购与回访管理",
    desc: "复诊提醒、服务计划与回访任务，形成复购线索。",
    href: "/tools/follow-up-reminder",
    action: "试用提醒工具",
  },
];

const PRODUCTS = [
  { icon: BookOpen, title: "银发经济政策数据库", desc: "汇集各地养老政策与补贴信息，规则匹配资格方向，持续扩充覆盖。", href: "/policies" },
  { icon: HeartPulse, title: "陪诊护理服务 CRM", desc: "老人档案、订单管理、服务记录、家属通知，一站式闭环。", href: "/care-crm" },
  { icon: Building2, title: "养老机构销售线索库", desc: "机构画像与数字化成熟度评分，支撑销售线索管理。", href: "/institutions" },
];

const TOOLS_PREVIEW = [
  { name: "养老补贴资格初筛", desc: "输入基本信息，快速初筛可申请的补贴政策", href: "/tools/subsidy-checker" },
  { name: "家属照护报告生成器", desc: "一键整理老人健康周报，让异地子女安心", href: "/tools/family-care-report" },
  { name: "陪诊记录总结器", desc: "就诊信息快速结构化为标准陪诊记录", href: "/tools/medical-companion-summary" },
  { name: "居家照护计划生成器", desc: "根据老人情况生成个性化照护方案", href: "/tools/care-plan-generator" },
  { name: "适老化改造清单", desc: "根据居住环境生成改造建议和预算", href: "/tools/home-aging-modification-checklist" },
  { name: "老人照护风险初筛", desc: "评估当前照护风险等级，提供改善建议", href: "/tools/elder-risk-check" },
];

// 实际进展：只写可核验事实；无数据处如实标注与验证计划
const PROGRESS = [
  { label: "产品形态", value: "Web 端可运行", detail: "29+ 功能页、免费工具与工作台已上线，本站可逐页验证" },
  { label: "试点机构", value: "0 · 招募中", detail: "正与陪诊/护理团队接洽首批试点，目标 3 个月内落地 3 家" },
  { label: "付费客户", value: "0 · 未开放", detail: "自助付费尚未上线，需联系人工开通（见定价页说明）" },
  { label: "验证指标", value: "MVP 验证中", detail: "建档完成率、服务记录留存率、家属报告使用率三项核心指标" },
];

export default function HomePage() {
  const [subsidyInput, setSubsidyInput] = useState("");
  const [subsidyError, setSubsidyError] = useState("");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Hero：主客户 = 陪诊/护理团队 ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="mx-auto max-w-3xl text-center">
              <span className="yc-eyebrow">为陪诊 / 护理团队打造</span>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                客户档案在微信群、服务记录靠回忆？
                <br className="hidden sm:block" />
                把它变成一套可管理的系统。
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
                衍策银龄 AI 帮助陪诊/护理团队完成<strong>建档 → 服务记录 → 家属报告 → 复购管理</strong>的全流程线上化，
                减少漏单和信息断层。下面每一步都是本站可打开的真实功能页，欢迎逐一点验。
              </p>
            </div>

            <div className="mx-auto mt-9 flex max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/demo" className="yc-btn-primary w-full px-7 py-3.5 text-base sm:w-auto">
                按四步流程体验产品
              </Link>
              <Link href="/care-crm" className="yc-btn-secondary w-full px-7 py-3.5 text-base sm:w-auto">
                了解陪诊 CRM
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-text-muted">
              全站演示数据均为虚构并明确标注；产品用于健康管理与照护辅助，不替代医疗诊断。
            </p>

            {/* 补贴初筛（次级入口）：输入带入下一页确认 */}
            <div className="mx-auto mt-10 max-w-2xl text-left">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = subsidyInput.trim();
                  if (!text) {
                    setSubsidyError("请先填写老人情况，例如「上海 78 岁独居 高血压」");
                    return;
                  }
                  setSubsidyError("");
                  const cities = ["上海","北京","深圳","杭州","苏州","广州","成都","武汉","南京","天津","重庆","西安"];
                  const city = cities.find((c) => text.includes(c)) || "";
                  const ageMatch = text.match(/(\d{1,3})\s*岁/);
                  const params = new URLSearchParams();
                  if (city) params.set("city", city);
                  if (ageMatch) params.set("age", ageMatch[1]);
                  params.set("note", text);
                  window.location.href = `/tools/subsidy-checker?${params.toString()}`;
                }}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-white p-1.5 shadow-sm transition focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100"
              >
                <Search className="ml-2.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                <input
                  type="text"
                  value={subsidyInput}
                  onChange={(e) => { setSubsidyInput(e.target.value); if (subsidyError) setSubsidyError(""); }}
                  aria-label="输入老人情况进行补贴初筛"
                  aria-invalid={!!subsidyError}
                  placeholder="也可试试：输入老人情况初筛补贴，如 上海 78 岁独居 高血压"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
                <button type="submit" className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 active:translate-y-px">
                  立即匹配
                </button>
              </form>
              {subsidyError && (
                <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{subsidyError}</p>
              )}
              <p className="mt-2 text-xs text-text-muted">
                提交后进入「补贴资格初筛工具」，您输入的内容会带入下一页供确认与补充，不会丢失。
              </p>
            </div>
          </div>
        </section>

        {/* ── 四步真实流程 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">核心工作流</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                建档 → 服务记录 → 家属报告 → 复购管理
              </h2>
              <p className="mt-2 text-sm text-text-secondary">每一步都链接到本站真实功能页（含标注的演示数据），可自行点开验证。</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {WORKFLOW.map((w) => (
                <div key={w.step} className="flex flex-col rounded-xl border border-border bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <w.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold text-text-muted">STEP {w.step}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">{w.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">{w.desc}</p>
                  <Link href={w.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                    {w.action} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 实际进展与证据（如实） ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow flex items-center gap-1.5"><FlaskConical className="h-4 w-4" aria-hidden="true" /> 实际进展</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                我们做到哪一步了（截至 2026-09-27，如实更新）
              </h2>
              <p className="mt-2 text-sm text-text-secondary">只写可核验事实；暂无数据的项如实标注，不使用虚构数字。</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROGRESS.map((p) => (
                <div key={p.label} className="rounded-xl border border-border bg-white p-5">
                  <p className="text-xs text-text-muted">{p.label}</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">{p.value}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 产品矩阵 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">产品矩阵</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                服务管理之外的三条产品线
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

        {/* ── 其他客群 ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">其他客群</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                不只是陪诊团队在用
              </h2>
              <p className="mt-2 text-sm text-text-secondary">各客群有独立的解决方案说明页。</p>
            </div>
            <div className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
              {AUDIENCES.map((s) => (
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
                <p className="mt-2 text-sm text-text-secondary">无需注册即可体验；结果由规则模板根据输入生成（虚构样例演示）。</p>
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
                TypeScript SDK、MCP Server、Chrome 插件（内测），快速集成养老服务能力到你的产品和工作流。
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
