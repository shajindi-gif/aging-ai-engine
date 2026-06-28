// @ts-nocheck
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Database,
  Users,
  Building2,
  Smartphone,
  MessageSquare,
  Bot,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";

const mvpProducts = [
  {
    icon: Database,
    title: "银发经济政策数据库",
    subtitle: "MVP 1",
    color: "bg-brand-50 text-brand-600",
    badgeColor: "yc-badge-brand",
    targetUsers: ["政府部门", "社区服务站", "养老公司", "老人家庭"],
    description:
      "覆盖全国200+城市养老政策，AI智能匹配补贴资格，一键生成申请指南。帮助老人家庭快速找到可享受的政策福利。",
    features: [
      "覆盖200+城市养老政策法规",
      "AI智能补贴资格匹配引擎",
      "一键生成申请清单和材料列表",
      "政策变更实时推送通知",
      "多维度筛选和搜索",
      "政策详情结构化展示",
    ],
    pricingHint: "社区版免费 / 专业版 ¥2,980/月",
    cta: "查看政策库",
    ctaHref: "/policies",
  },
  {
    icon: Users,
    title: "陪诊护理服务 CRM",
    subtitle: "MVP 2",
    color: "bg-gold-50 text-gold-600",
    badgeColor: "yc-badge-gold",
    targetUsers: ["陪诊公司", "护理团队", "居家服务机构"],
    description:
      "全流程陪诊护理服务管理，从订单派发到服务记录、健康风险评估、家属报告，提升服务质量和客户满意度。",
    features: [
      "服务工单全流程管理",
      "AI健康风险评估和预警",
      "智能排班与自动派单",
      "家属端实时服务报告",
      "老人健康档案数字化",
      "风险事件实时预警",
    ],
    pricingHint: "社区版免费 / 专业版 ¥2,980/月",
    cta: "进入CRM",
    ctaHref: "/care-crm",
  },
  {
    icon: Building2,
    title: "养老机构销售线索库",
    subtitle: "MVP 3",
    color: "bg-blue-50 text-blue-600",
    badgeColor: "yc-badge-brand",
    targetUsers: ["养老SaaS厂商", "设备供应商", "行业投资人"],
    description:
      "基于机构数字化成熟度评分和行业数据聚合，精准发现潜在客户，智能跟进管理，提升销售转化率。",
    features: [
      "机构数字化成熟度五维评分",
      "行业数据聚合自动生成线索",
      "Pipeline看板可视化",
      "智能跟进提醒和建议",
      "ROI可预测模型",
      "线索导出和批量管理",
    ],
    pricingHint: "数据库订阅版 ¥4,980/月",
    cta: "查看线索库",
    ctaHref: "/institutions",
  },
];

const plannedProducts = [
  { icon: Smartphone, label: "微信小程序", desc: "老人和家属移动端入口", status: "规划中" },
  { icon: Smartphone, label: "移动端 App", desc: "iOS/Android 原生应用", status: "规划中" },
  { icon: MessageSquare, label: "飞书 / 钉钉 Bot", desc: "企业IM集成服务助手", status: "开发中" },
  { icon: Bot, label: "MCP Agent 服务", desc: "标准化Agent API接口", status: "已上线" },
];

export default function ProductsPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">产品矩阵</span>
          <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            产品矩阵
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            衍策银龄 AI 聚焦养老服务三大核心场景，提供从政策查询到服务管理再到商业拓展的完整解决方案
          </p>
        </div>
      </section>

      {/* MVP Products */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {mvpProducts.map((product) => (
              <div key={product.title} className="yc-card flex flex-col">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${product.color}`}
                  >
                    <product.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className={`yc-badge ${product.badgeColor} text-xs`}>
                      {product.subtitle}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {product.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {product.description}
                </p>

                <div className="mt-4">
                  <p className="text-xs font-medium text-text-muted mb-2">目标用户</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.targetUsers.map((user) => (
                      <span key={user} className="yc-badge yc-badge-brand text-xs">
                        {user}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="mt-5 flex-1 space-y-2">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-xs text-text-muted mb-3">{product.pricingHint}</p>
                  <Link
                    href={product.ctaHref}
                    className="yc-btn-primary w-full justify-center text-sm"
                  >
                    {product.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planned Products */}
      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="yc-badge yc-badge-gold">更多入口</span>
            <h2 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">
              规划中的产品与渠道
            </h2>
            <p className="mt-3 text-text-secondary">
              多端分发网络，覆盖养老服务全场景
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plannedProducts.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:border-brand-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-silver-100">
                  <item.icon className="h-5 w-5 text-silver-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                  <span
                    className={`text-xs mt-1 inline-block ${
                      item.status === "已上线"
                        ? "text-success"
                        : item.status === "开发中"
                        ? "text-gold-600"
                        : "text-text-muted"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="yc-gradient-brand py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            开始使用衍策银龄 AI
          </h2>
          <p className="mt-3 text-brand-100">
            选择适合您业务的产品，立即体验 AI 驱动的养老服务基础设施
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50"
            >
              免费试用
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              查看定价
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
