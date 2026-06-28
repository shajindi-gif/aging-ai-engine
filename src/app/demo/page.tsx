// @ts-nocheck
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowRight, Play, Download, Video, Sparkles } from "lucide-react";

const scenarios = [
  {
    title: "5分钟快速演示",
    subtitle: "适合创业比赛、投资人路演",
    time: "5 分钟",
    iconBg: "bg-brand-50 text-brand-600",
    points: [
      "展示政策匹配核心功能",
      "演示AI补贴匹配结果",
      "快速浏览CRM工作台",
    ],
    cta: "开始演示",
    href: "/policies",
  },
  {
    title: "10分钟产品演示",
    subtitle: "适合客户演示、产品推介",
    time: "10 分钟",
    iconBg: "bg-gold-50 text-gold-600",
    points: [
      "完整政策数据库功能",
      "补贴匹配全流程",
      "CRM订单管理和家属报告",
      "老人健康档案查看",
    ],
    cta: "开始演示",
    href: "/care-crm",
  },
  {
    title: "20分钟深度演示",
    subtitle: "适合企业销售、深度合作洽谈",
    time: "20 分钟",
    iconBg: "bg-blue-50 text-blue-600",
    points: [
      "三大MVP完整功能",
      "Agent工作台全部Agent演示",
      "机构画像和销售线索库",
      "数据模型和技术架构介绍",
      "定制化需求讨论",
    ],
    cta: "开始演示",
    href: "/agents",
  },
];

export default function DemoPage() {
  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">演示中心</span>
          <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">产品演示中心</h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            选择适合您场景的演示方案，快速了解衍策银龄 AI 的核心能力
          </p>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {scenarios.map((s) => (
              <div key={s.title} className="yc-card flex flex-col">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <Play className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{s.title}</h3>
                <p className="text-sm text-text-muted mt-1">{s.subtitle}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="h-4 w-4" /> {s.time}
                </div>
                <ul className="mt-4 flex-1 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="yc-btn-primary mt-6 w-full justify-center text-sm">
                  {s.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">产品演示视频</h2>
          <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-border bg-silver-50 aspect-video flex items-center justify-center">
            <div className="text-center">
              <Video className="mx-auto h-12 w-12 text-silver-300" />
              <p className="mt-3 text-sm text-text-muted">演示视频即将上线</p>
            </div>
          </div>
          <div className="mt-8">
            <button className="yc-btn-secondary">
              <Download className="h-4 w-4" /> 下载产品手册
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
