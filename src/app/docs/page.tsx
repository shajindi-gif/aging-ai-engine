// @ts-nocheck
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  BookOpen, Code2, Briefcase, Shield, Search, ArrowRight,
  FileText, Database, Settings, Globe,
} from "lucide-react";

const categories = [
  {
    icon: BookOpen,
    title: "产品文档",
    color: "bg-brand-50 text-brand-600",
    desc: "产品需求文档、MVP范围定义、数据模型设计",
    items: [
      { label: "产品需求文档 (PRD)", href: "/docs/prd" },
      { label: "MVP 功能范围", href: "/docs/mvp-scope" },
      { label: "数据模型设计", href: "/docs/data-model" },
      { label: "用户故事地图", href: "/docs/user-stories" },
    ],
  },
  {
    icon: Code2,
    title: "技术文档",
    color: "bg-blue-50 text-blue-600",
    desc: "API接口文档、SDK使用指南、MCP Server配置",
    items: [
      { label: "API 接口参考", href: "/docs/api-reference" },
      { label: "SDK 使用指南", href: "/docs/sdk-guide" },
      { label: "MCP Server 配置", href: "/docs/mcp-server" },
      { label: "Chrome 插件文档", href: "/docs/chrome-extension" },
    ],
  },
  {
    icon: Briefcase,
    title: "商业文档",
    color: "bg-gold-50 text-gold-600",
    desc: "商业模式、定价策略、市场推广计划",
    items: [
      { label: "商业模式画布", href: "/docs/business-model" },
      { label: "定价策略", href: "/pricing" },
      { label: "GTM 市场推广", href: "/docs/go-to-market" },
      { label: "竞争分析", href: "/docs/competitive-analysis" },
    ],
  },
  {
    icon: Shield,
    title: "合规文档",
    color: "bg-red-50 text-red-600",
    desc: "医疗免责声明、隐私政策、数据安全",
    items: [
      { label: "合规声明", href: "/compliance" },
      { label: "隐私政策", href: "/docs/privacy" },
      { label: "数据安全白皮书", href: "/docs/data-security" },
      { label: "医疗合规指南", href: "/docs/medical-compliance" },
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
            查阅产品、技术、商业和合规相关的完整文档
          </p>
          <div className="mt-6 mx-auto max-w-md relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="搜索文档..." disabled
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted opacity-60" />
          </div>
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
        </div>
      </section>

      <Footer />
    </>
  );
}
