// @ts-nocheck
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowRight, Download, Sparkles, ListChecks } from "lucide-react";

// 五分钟主推路线：虚构老人「王秀兰」贯穿（演示数据已 seed，可重复执行）
const fiveMinScript = [
  { step: "0:00-1:00", label: "看主客户叙事与四步流程", href: "/", how: "首页首屏：陪诊/护理团队的问题与解决方案" },
  { step: "1:00-2:00", label: "用虚构资料跑一次补贴初筛", href: "/tools/subsidy-checker", how: "输入：上海 / 78 / 失能 / 独居，查看规则初筛结果与免责说明" },
  { step: "2:00-3:00", label: "体验建档与服务记录", href: "/onboarding", how: "填写虚构老人信息创建档案；再打开 /care-orders 看订单列表" },
  { step: "3:00-4:00", label: "生成家属报告", href: "/tools/family-care-report", how: "输入虚构照护记录，查看生成的报告草稿（虚构样例）" },
  { step: "4:00-5:00", label: "登录看家属看板（王秀兰）", href: "/login", how: "用演示账号登录 → /family 看健康趋势、AI 摘要与任务提醒" },
];

const scenarios = [
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* 五分钟主推路线：虚构老人贯穿 */}
          <div className="rounded-2xl border border-brand-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="yc-badge yc-badge-brand">推荐 · 可重复执行</span>
                <h2 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">五分钟产品演示（虚构老人「王秀兰」）</h2>
                <p className="mt-1.5 text-sm text-text-secondary">全程使用站内真实功能页与虚构演示数据，可重复执行；每步标注时间与操作要点。</p>
              </div>
              <div className="rounded-xl bg-silver-50 px-4 py-3 text-xs text-text-secondary">
                演示账号：<span className="font-mono font-semibold text-text-primary">demo@yanglaoai999.com</span> / <span className="font-mono font-semibold text-text-primary">demo123456</span>
              </div>
            </div>
            <ol className="mt-6 space-y-3">
              {fiveMinScript.map((s) => (
                <li key={s.step}>
                  <Link href={s.href} className="group flex flex-col gap-1 rounded-xl border border-border px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/40 sm:flex-row sm:items-center sm:gap-4">
                    <span className="w-24 shrink-0 font-mono text-xs font-semibold text-brand-700">{s.step}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-text-primary">{s.label}</span>
                      <span className="mt-0.5 block text-xs text-text-secondary">{s.how}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              说明：演示中的老人资料（王秀兰，76 岁）为虚构演示数据；工具结果由规则模板生成并标注「虚构样例演示」；健康类页面不替代医疗诊断。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
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
