import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Check,
  X as XIcon,
  ArrowRight,
  Heart,
  Building2,
  Sparkles,
} from "lucide-react";

const tiers = [
  {
    name: "社区版",
    price: "免费",
    priceNote: "永久免费",
    icon: Heart,
    desc: "适合社区服务站和小型组织，快速上手基础功能",
    highlight: false,
    cta: "免费开始",
    features: [
      { text: "50 个老人档案", included: true },
      { text: "基础政策查询", included: true },
      { text: "简易工单管理", included: true },
      { text: "社区版 CRM", included: true },
      { text: "AI 补贴匹配（5次/月）", included: true },
      { text: "API 接口", included: false },
      { text: "Agent 工作台", included: false },
      { text: "数据导出", included: false },
    ],
  },
  {
    name: "专业版",
    price: "¥2,980",
    priceNote: "/月",
    icon: Sparkles,
    desc: "适合陪诊公司和中型护理团队，解锁全部 AI 能力",
    highlight: true,
    cta: "免费试用 14 天",
    features: [
      { text: "500 个老人档案", included: true },
      { text: "全量政策数据库", included: true },
      { text: "完整 CRM + 智能派单", included: true },
      { text: "AI 健康风险评估", included: true },
      { text: "无限 AI 补贴匹配", included: true },
      { text: "API 接口（10,000次/月）", included: true },
      { text: "Agent 工作台（全部 Agent）", included: true },
      { text: "数据导出 + 报表", included: true },
    ],
  },
  {
    name: "企业版",
    price: "联系销售",
    priceNote: "",
    icon: Building2,
    desc: "适合大型养老集团和连锁机构，定制化部署",
    highlight: false,
    cta: "预约演示",
    features: [
      { text: "无限老人档案", included: true },
      { text: "全量功能 + 定制化模块", included: true },
      { text: "专属部署（私有云/混合云）", included: true },
      { text: "SLA 保障（99.9%）", included: true },
      { text: "专属客户成功经理", included: true },
      { text: "API 无限制调用", included: true },
      { text: "自定义 Agent 开发", included: true },
      { text: "数据合规审计支持", included: true },
    ],
  },
];

const comparisonFeatures = [
  { feature: "老人档案数", community: "50", pro: "500", enterprise: "无限" },
  { feature: "政策数据库", community: "基础查询", pro: "全量", enterprise: "全量+定制" },
  { feature: "AI 补贴匹配", community: "5次/月", pro: "无限", enterprise: "无限" },
  { feature: "陪诊 CRM", community: "基础", pro: "完整+智能派单", enterprise: "完整+定制" },
  { feature: "健康风险评估", community: "-", pro: "AI 自动评估", enterprise: "AI+定制模型" },
  { feature: "Agent 工作台", community: "-", pro: "全部 Agent", enterprise: "全部+自定义" },
  { feature: "API 接口", community: "-", pro: "10,000次/月", enterprise: "无限制" },
  { feature: "数据导出", community: "-", pro: "支持", enterprise: "支持+定制报表" },
  { feature: "部署方式", community: "共享云", pro: "共享云", enterprise: "私有/混合云" },
  { feature: "技术支持", community: "社区", pro: "工单+在线", enterprise: "专属客户经理" },
  { feature: "SLA", community: "-", pro: "99.5%", enterprise: "99.9%" },
];

const faqs = [
  {
    q: "免费试用需要绑定信用卡吗？",
    a: "不需要。社区版永久免费，专业版提供14天免费试用，无需绑定任何支付方式。试用结束后如不升级，自动降级为社区版。",
  },
  {
    q: "数据安全如何保障？",
    a: "我们严格遵循《数据安全法》和《个人信息保护法》，所有数据加密存储，通过等保三级认证。健康信息处理有明确的合规流程和免责声明。企业版支持私有化部署。",
  },
  {
    q: "可以从社区版升级到专业版吗？",
    a: "当然可以。升级即时生效，数据无缝迁移。我们会帮助您完成配置和培训。",
  },
  {
    q: "API 接口可以用于对接现有系统吗？",
    a: "专业版和企业版提供 RESTful API，支持对接您现有的 HIS、CRM 或 ERP 系统。我们提供完整的 API 文档和 SDK。",
  },
  {
    q: "企业版的定制化开发包含哪些？",
    a: "包括但不限于：自定义 Agent 开发、定制化报表和仪表盘、与内部系统的深度集成、专属 UI 定制、数据模型调优等。具体需求请联系销售团队。",
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />

      {/* Header */}
      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">定价方案</span>
          <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            选择适合您的方案
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            从免费社区版到企业定制版，满足不同规模组织的需求
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-surface-secondary pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border bg-white p-8 ${
                  tier.highlight
                    ? "border-brand-300 shadow-xl shadow-brand-600/10 ring-1 ring-brand-200"
                    : "border-border"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-600 px-4 py-1 text-xs font-medium text-white">
                      最受欢迎
                    </span>
                  </div>
                )}
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      tier.highlight ? "bg-brand-600" : "bg-silver-100"
                    }`}
                  >
                    <tier.icon
                      className={`h-5 w-5 ${
                        tier.highlight ? "text-white" : "text-silver-500"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-text-primary">
                    {tier.price}
                  </span>
                  <span className="text-sm text-text-muted">
                    {tier.priceNote}
                  </span>
                </div>
                <p className="mb-6 text-sm text-text-secondary">{tier.desc}</p>

                <Link
                  href={tier.name === "企业版" ? "#contact" : "/dashboard"}
                  className={`mb-8 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    tier.highlight
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-border text-text-primary hover:border-brand-300 hover:text-brand-700"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <ul className="space-y-3">
                  {tier.features.map((feat) => (
                    <li
                      key={feat.text}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      {feat.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      ) : (
                        <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-silver-300" />
                      )}
                      <span
                        className={
                          feat.included
                            ? "text-text-secondary"
                            : "text-text-muted"
                        }
                      >
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">
            功能对比
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 pr-4 font-medium text-text-secondary">
                    功能
                  </th>
                  <th className="pb-4 px-4 text-center font-medium text-text-secondary">
                    社区版
                  </th>
                  <th className="pb-4 px-4 text-center font-semibold text-brand-600">
                    专业版
                  </th>
                  <th className="pb-4 pl-4 text-center font-medium text-text-secondary">
                    企业版
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i < comparisonFeatures.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="py-3.5 pr-4 font-medium text-text-primary">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 text-center text-text-muted">
                      {row.community}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-text-primary">
                      {row.pro}
                    </td>
                    <td className="py-3.5 pl-4 text-center text-text-secondary">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-surface-secondary py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">
            常见问题
          </h2>
          <div className="mt-10 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
