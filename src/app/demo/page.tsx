// @ts-nocheck
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowRight, Download, Sparkles, ListChecks } from "lucide-react";

// 页面导览路线：链接均为站内真实可打开的功能页（含演示数据，均已标注）
const scenarios = [
  {
    title: "5 分钟快速导览",
    subtitle: "适合快速了解产品形态",
    time: "约 5 分钟",
    points: [
      "首页补贴初筛工具（输入即出结果）",
      "政策数据库检索（演示数据 41 条）",
      "工作台登录入口",
    ],
    steps: [
      { label: "第 1 步：跑一次补贴初筛工具", href: "/tools/subsidy-checker" },
      { label: "第 2 步：浏览政策数据库", href: "/policies" },
      { label: "第 3 步：注册/登录进入工作台", href: "/login" },
    ],
  },
  {
    title: "10 分钟产品导览",
    subtitle: "适合了解照护服务管理流程",
    time: "约 10 分钟",
    points: [
      "陪诊护理 CRM（订单与服务记录）",
      "老人档案与健康数据",
      "家属报告形态",
    ],
    steps: [
      { label: "第 1 步：了解陪诊 CRM 功能", href: "/care-crm" },
      { label: "第 2 步：查看老人档案页", href: "/elders" },
      { label: "第 3 步：查看服务记录", href: "/care-records" },
    ],
  },
  {
    title: "20 分钟深度了解",
    subtitle: "适合合作洽谈前完整了解",
    time: "约 20 分钟",
    points: [
      "健康风险评估（活动测试）",
      "家属看板与提醒中心",
      "AI 助手（规则模式）",
      "开发者 SDK / API 文档",
    ],
    steps: [
      { label: "第 1 步：体验健康 OS 评估", href: "/elder/mobility" },
      { label: "第 2 步：查看家属看板（需登录）", href: "/family" },
      { label: "第 3 步：提醒中心", href: "/alerts" },
      { label: "第 4 步：开发者文档", href: "/developers" },
    ],
  },
];

export default function DemoPage() {
  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">演示导览</span>
          <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">产品导览路线</h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            以下为可直接打开的站内功能页组成的导览路线（数据为标注过的演示数据）；演示视频正在筹备，可先按路线自助体验或预约人工演示。
          </p>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {scenarios.map((s) => (
              <div key={s.title} className="yc-card flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <ListChecks className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{s.title}</h3>
                <p className="text-sm text-text-muted mt-1">{s.subtitle}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="h-4 w-4" /> {s.time}
                </div>
                <ul className="mt-4 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  {s.steps.map((st) => (
                    <Link key={st.href + st.label} href={st.href} className="flex items-center justify-between rounded-lg bg-silver-50 px-3 py-2 text-sm text-text-primary transition hover:bg-brand-50">
                      {st.label} <ArrowRight className="h-4 w-4 text-brand-600" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary">演示视频与产品资料</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            演示视频正在筹备中。如需产品介绍资料（PPT / 手册），请通过联系表单索取，我们会在 1-2 个工作日内以邮件发送真实文件；也可直接预约人工演示。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="yc-btn-secondary">
              <Download className="h-4 w-4" /> 联系我们索取产品资料
            </Link>
            <Link href="/contact" className="yc-btn-primary">
              预约人工演示
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
