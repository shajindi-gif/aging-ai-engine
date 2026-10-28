// @ts-nocheck
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Shield, ArrowRight, FileText,
} from "lucide-react";

const categories = [
  {
    icon: Shield,
    title: "政策与合规",
    color: "bg-red-50 text-red-600",
    desc: "隐私、条款、合规与安全相关公开页面",
    items: [
      { label: "安全与信任", href: "/trust" },
      { label: "隐私政策", href: "/privacy" },
      { label: "服务条款", href: "/terms" },
      { label: "合规声明", href: "/compliance" },
    ],
  },
  {
    icon: FileText,
    title: "产品与使用",
    color: "bg-brand-50 text-brand-600",
    desc: "工具、价格与开发者入口",
    items: [
      { label: "免费工具", href: "/tools" },
      { label: "价格方案", href: "/pricing" },
      { label: "开发者文档", href: "/developers" },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">文档中心</span>
          <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">文档中心</h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            当前收录已发布的公开页面；产品需求、API 接口等技术文档整理中，完成后将在此发布
          </p>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {categories.map((cat) => (
              <div key={cat.title} className="yc-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${cat.color}`}>
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{cat.title}</h3>
                    <p className="text-xs text-text-muted">{cat.desc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <Link key={item.label} href={item.href}
                      className="flex items-center justify-between rounded-lg p-2.5 hover:bg-silver-50 transition-colors group">
                      <span className="flex items-center gap-2 text-sm text-text-secondary group-hover:text-brand-600">
                        <FileText className="h-4 w-4 text-text-muted" />
                        {item.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-text-muted">
            更多文档（PRD、API 参考、SDK 指南等）正在整理中，暂未发布。
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
