"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SiteHeader,
  SiteFooter,
} from "@/components/shared";
import { PolicyDisclaimer, MedicalDisclaimer } from "@/components/shared/DisclaimerBanner";
import {
  Search,
  ArrowRight,
  BookOpen,
  HeartPulse,
  Building2,
  FileText,
  ShieldCheck,
  Database,
  Clock,
  UserRound,
  PhoneCall,
  ClipboardList,
} from "lucide-react";

/* ── 三个真实场景（每个都对应可访问功能）── */
const SCENES = [
  {
    icon: Search,
    title: "为父母查询养老补贴",
    desc: "告诉系统父母的年龄、所在城市和照护情况，几分钟内看到可能适用的补贴政策方向和申请材料清单。",
    action: "查询养老补贴",
    href: "/tools/subsidy-checker",
    note: "免费使用，无需注册",
  },
  {
    icon: ClipboardList,
    title: "记录陪诊和护理过程",
    desc: "就诊信息、护理内容、风险事件按模板记录归档，随时可查，不再散落在微信群和纸质单据里。",
    action: "试用记录工具",
    href: "/tools/medical-companion-summary",
    note: "免费使用，结果本页生成",
  },
  {
    icon: FileText,
    title: "给家人一份明白的照护报告",
    desc: "把零散的服务记录整理成家属看得懂、放得心的周报月报，让不在身边的子女也了解情况。",
    action: "生成家属报告",
    href: "/tools/family-care-report",
    note: "免费使用，内容可编辑",
  },
];

/* ── 两条使用路径 ── */
const PATH_FAMILY = [
  { step: "1", label: "选择城市", href: "/tools/subsidy-checker" },
  { step: "2", label: "填写父母基本情况", href: "/tools/subsidy-checker" },
  { step: "3", label: "查看可能适用的政策", href: "/policies" },
  { step: "4", label: "了解申请条件与期限", href: "/policies" },
  { step: "5", label: "获取申报材料清单", href: "/tools/policy-materials-generator" },
];
const PATH_BIZ = [
  { step: "1", label: "创建机构账户", href: "/register" },
  { step: "2", label: "建立老人档案", href: "/elders" },
  { step: "3", label: "登记服务订单", href: "/care-orders" },
  { step: "4", label: "记录服务过程", href: "/care-records" },
  { step: "5", label: "生成家属报告与运营看板", href: "/dashboard" },
];

/* ── 产品模块 ── */
const MODULES = [
  { icon: BookOpen, title: "养老政策数据库", desc: "按城市、类别检索各地养老政策与补贴信息，标注发布部门与有效期。", href: "/policies", tag: "免费查询" },
  { icon: HeartPulse, title: "陪诊护理管理系统", desc: "老人档案、服务订单、护理记录、家属沟通，一套流程管完。", href: "/care-crm", tag: "注册可用" },
  { icon: ClipboardList, title: "照护小工具", desc: "补贴初筛、照护报告、陪诊记录、风险初筛等 10 个免费工具。", href: "/tools", tag: "无需注册" },
  { icon: Building2, title: "养老机构数据库", desc: "机构档案与数字化程度评估，供行业伙伴寻找合作线索。", href: "/institutions", tag: "免费浏览" },
];

/* ── 可信度内容（全部真实可查）── */
const TRUST = [
  { icon: Database, title: "政策数据从哪里来", text: "来自各级政府官方网站与公开文件，人工整理核验。当前收录 41 条政策样本、覆盖 10 个地区（演示数据库，持续扩充中）。" },
  { icon: Clock, title: "数据何时更新", text: "政策数据最近一次整理核验于 2026 年 9 月。每条政策标注发布部门与生效信息，供核对时参考。" },
  { icon: Search, title: "查询结果有什么限制", text: "补贴匹配结果为初步参考，不构成资格认定。能否申请、能领多少，以当地主管部门最终审核为准。" },
  { icon: ShieldCheck, title: "信息如何受到保护", text: "网站使用 HTTPS 加密传输；登录后的老人档案与健康信息按角色权限隔离访问，不用于广告，不训练模型。详见隐私政策。" },
  { icon: UserRound, title: "谁适合使用", text: "为父母查询补贴和安排照护的家庭；陪诊公司、护理团队、社区服务站等养老服务机构。" },
  { icon: PhoneCall, title: "遇到问题找人工", text: "通过「联系我们」表单提交问题，工作日 1-2 个工作日内回复；涉及申请事宜建议同时咨询当地主管部门。" },
];

export default function HomePage() {
  const [subsidyInput, setSubsidyInput] = useState("");
  const [subsidyError, setSubsidyError] = useState("");

  function goSubsidy(e: React.FormEvent) {
    e.preventDefault();
    const text = subsidyInput.trim();
    if (!text) {
      setSubsidyError("请先简单描述父母的情况，例如「上海 78 岁独居 高血压」");
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
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl">
                让养老照护更有条理
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
                查找养老补贴政策，整理老人照护信息，记录陪诊和护理服务——
                让家人更安心，让服务更省心。
              </p>
            </div>

            {/* 主行动：查询补贴（真实功能入口） */}
            <div className="mx-auto mt-9 max-w-2xl">
              <form onSubmit={goSubsidy}>
                <div className="flex items-center gap-1.5 rounded-xl border border-border bg-white p-1.5 shadow-sm transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
                  <Search className="ml-2.5 h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
                  <input
                    type="text"
                    value={subsidyInput}
                    onChange={(e) => { setSubsidyInput(e.target.value); if (subsidyError) setSubsidyError(""); }}
                    aria-label="描述父母的情况，查询养老补贴"
                    aria-invalid={!!subsidyError}
                    placeholder="父母的情况：城市、年龄、居住和身体情况"
                    className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base text-text-primary outline-none placeholder:text-text-muted"
                  />
                  <button type="submit" className="shrink-0 rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white transition hover:bg-brand-700 active:translate-y-px">
                    查询补贴
                  </button>
                </div>
                {subsidyError && (
                  <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--color-danger)]">{subsidyError}</p>
                )}
                <p className="mt-2 text-center text-xs text-text-muted">
                  例如：上海 78 岁独居 高血压 · 免费使用，无需注册，输入内容会带到下一页供您确认
                </p>
              </form>
              <div className="mt-6 text-center">
                <Link href="/care-crm" className="inline-flex items-center gap-1.5 text-base font-medium text-brand-700 hover:underline">
                  我是养老服务机构，了解管理系统 <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 三个真实场景 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">常见场景</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                三件养老生活里最常遇到的事
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {SCENES.map((s) => (
                <div key={s.href} className="flex flex-col rounded-xl border border-border bg-surface p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{s.desc}</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <Link href={s.href} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                      {s.action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <p className="mt-1.5 text-xs text-text-muted">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 两条使用路径 ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <span className="yc-eyebrow">给老人家庭</span>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">五步查清父母能享受什么</h2>
                <ol className="mt-6 space-y-2">
                  {PATH_FAMILY.map((p) => (
                    <li key={p.step}>
                      <Link href={p.href} className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm transition hover:border-brand-300">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{p.step}</span>
                        <span className="flex-1 font-medium text-text-primary">{p.label}</span>
                        <ArrowRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <span className="yc-eyebrow">给服务机构</span>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">五步把业务管起来</h2>
                <ol className="mt-6 space-y-2">
                  {PATH_BIZ.map((p) => (
                    <li key={p.step}>
                      <Link href={p.href} className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm transition hover:border-brand-300">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{p.step}</span>
                        <span className="flex-1 font-medium text-text-primary">{p.label}</span>
                        <ArrowRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── 产品模块 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">产品模块</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">按需使用，不必一次全买</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {MODULES.map((m) => (
                <Link key={m.href} href={m.href} className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 transition hover:border-brand-300">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <m.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-text-primary">{m.title}</h3>
                      <span className="yc-badge yc-badge-brand">{m.tag}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{m.desc}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs text-text-muted">
              以上页面均可直接打开体验；演示数据均已明确标注。机构管理系统需注册后使用。
            </p>
          </div>
        </section>

        {/* ── 可信度 ── */}
        <section className="bg-surface-secondary">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">明明白白</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                关于数据与服务的实话实说
              </h2>
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {TRUST.map((t) => (
                <div key={t.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-600 ring-1 ring-border">
                    <t.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 价格：只列真实可购买的 ── */}
        <section className="bg-surface">
          <div className="yc-container yc-section">
            <div className="max-w-2xl">
              <span className="yc-eyebrow">价格</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                先用起来，再决定
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="text-base font-semibold text-text-primary">免费使用</h3>
                <p className="mt-1 text-3xl font-bold text-text-primary">¥0</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  补贴查询、照护报告、陪诊记录等全部小工具，以及政策数据库浏览——无需注册，不收费用。
                </p>
                <Link href="/tools" className="yc-btn-secondary mt-5 w-full justify-center">开始免费使用</Link>
              </div>
              <div className="rounded-xl border border-brand-300 bg-brand-50/40 p-6">
                <h3 className="text-base font-semibold text-text-primary">机构管理系统 · 专业版</h3>
                <p className="mt-1 text-3xl font-bold text-text-primary">¥2,980<span className="text-base font-normal text-text-muted"> / 月</span></p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  老人档案、订单管理、护理记录、家属报告、健康风险看板，支持团队使用。支付通道已就绪；当前为人工开通：先咨询后开通。
                </p>
                <div className="mt-5 flex gap-3">
                  <Link href="/contact" className="yc-btn-primary flex-1 justify-center">咨询开通</Link>
                  <Link href="/pricing" className="yc-btn-secondary flex-1 justify-center">查看定价</Link>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-text-muted">
              小团队版、数据订阅版、园区定制等更多方案见<Link href="/pricing" className="text-brand-700 hover:underline">定价页</Link>（部分需人工开通）。
            </p>
          </div>
        </section>

        {/* 免责声明 */}
        <section className="yc-container pb-10">
          <div className="mx-auto max-w-3xl space-y-3">
            <PolicyDisclaimer />
            <MedicalDisclaimer />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
