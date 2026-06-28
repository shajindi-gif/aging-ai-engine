import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Check, X as XIcon, ArrowRight, Heart, Building2, Sparkles, Database, Globe } from "lucide-react";

const tiers = [
  {
    name: "免费演示版",
    price: "免费",
    priceNote: "永久免费",
    icon: Heart,
    desc: "快速体验核心功能，适合个人了解和演示",
    highlight: false,
    cta: "立即体验",
    href: "/dashboard",
    features: [
      { text: "10 个老人档案", included: true },
      { text: "政策库基础查询（12条）", included: true },
      { text: "AI 补贴匹配（3次/月）", included: true },
      { text: "基础订单管理", included: true },
      { text: "Agent 体验（1个Agent）", included: true },
      { text: "API 接口", included: false },
      { text: "数据导出", included: false },
      { text: "技术支持", included: false },
    ],
  },
  {
    name: "小团队版",
    price: "¥980",
    priceNote: "/月",
    icon: Globe,
    desc: "适合小型陪诊团队和社区服务站",
    highlight: false,
    cta: "免费试用 14 天",
    href: "/dashboard",
    features: [
      { text: "100 个老人档案", included: true },
      { text: "全量政策数据库", included: true },
      { text: "AI 补贴匹配（50次/月）", included: true },
      { text: "完整 CRM 功能", included: true },
      { text: "Agent 工作台（3个Agent）", included: true },
      { text: "基础 API 接口（1,000次/月）", included: true },
      { text: "数据导出", included: false },
      { text: "专属技术支持", included: false },
    ],
  },
  {
    name: "专业版",
    price: "¥2,980",
    priceNote: "/月",
    icon: Sparkles,
    desc: "适合中型护理团队，解锁全部 AI 能力",
    highlight: true,
    cta: "免费试用 14 天",
    href: "/dashboard",
    features: [
      { text: "500 个老人档案", included: true },
      { text: "全量政策数据库 + 实时更新", included: true },
      { text: "无限 AI 补贴匹配", included: true },
      { text: "完整 CRM + 智能派单", included: true },
      { text: "全部 9 个 Agent", included: true },
      { text: "API 接口（10,000次/月）", included: true },
      { text: "数据导出 + 报表", included: true },
      { text: "工单 + 在线技术支持", included: true },
    ],
  },
  {
    name: "数据库订阅版",
    price: "¥4,980",
    priceNote: "/月",
    icon: Database,
    desc: "适合养老SaaS厂商和设备供应商",
    highlight: false,
    cta: "联系销售",
    href: "/contact",
    features: [
      { text: "养老机构销售线索库", included: true },
      { text: "机构数字化成熟度评分", included: true },
      { text: "全量政策数据 API 访问", included: true },
      { text: "线索批量导出", included: true },
      { text: "Pipeline 看板 + 智能跟进", included: true },
      { text: "API 接口（50,000次/月）", included: true },
      { text: "数据定制报表", included: true },
      { text: "专属客户成功经理", included: true },
    ],
  },
  {
    name: "园区/街道定制版",
    price: "联系销售",
    priceNote: "",
    icon: Building2,
    desc: "适合大型养老集团、园区和街道",
    highlight: false,
    cta: "预约演示",
    href: "/contact",
    features: [
      { text: "无限老人档案", included: true },
      { text: "全量功能 + 定制化模块", included: true },
      { text: "专属部署（私有云/混合云）", included: true },
      { text: "SLA 保障（99.9%）", included: true },
      { text: "自定义 Agent 开发", included: true },
      { text: "API 无限制调用", included: true },
      { text: "数据合规审计支持", included: true },
      { text: "专属客户经理 + 驻场支持", included: true },
    ],
  },
];

const faqs = [
  { q: "免费试用需要绑定信用卡吗？", a: "不需要。免费演示版永久免费，小团队版和专业版提供14天免费试用，无需绑定任何支付方式。" },
  { q: "数据安全如何保障？", a: "我们严格遵循《数据安全法》和《个人信息保护法》，所有数据加密存储，通过等保三级认证。企业版支持私有化部署。" },
  { q: "数据库订阅版和专业版有什么区别？", a: "专业版面向服务提供方（陪诊公司、护理团队），包含完整的CRM和服务管理功能。数据库订阅版面向行业供应商（SaaS厂商、设备商），核心是机构线索库和政策数据API。" },
  { q: "可以从低版本升级吗？", a: "当然可以。升级即时生效，数据无缝迁移。我们会帮助您完成配置和培训。" },
  { q: "定制版的交付周期是多久？", a: "标准定制项目通常4-8周交付，包含需求调研、开发、测试和培训。具体周期视需求复杂度而定。" },
];

export default function PricingPage() {
  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">定价方案</span>
          <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">选择适合您的方案</h1>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            从免费演示版到园区定制版，满足不同规模组织的需求
          </p>
        </div>
      </section>

      <section className="bg-surface-secondary pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {tiers.map((tier) => (
              <div key={tier.name} className={`relative rounded-2xl border bg-white p-6 ${
                tier.highlight ? "border-brand-300 shadow-xl shadow-brand-600/10 ring-1 ring-brand-200" : "border-border"
              }`}>
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-600 px-4 py-1 text-xs font-medium text-white">最受欢迎</span>
                  </div>
                )}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tier.highlight ? "bg-brand-600" : "bg-silver-100"}`}>
                    <tier.icon className={`h-5 w-5 ${tier.highlight ? "text-white" : "text-silver-500"}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">{tier.name}</h3>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-text-primary">{tier.price}</span>
                  <span className="text-sm text-text-muted">{tier.priceNote}</span>
                </div>
                <p className="mb-4 text-xs text-text-secondary">{tier.desc}</p>
                <Link href={tier.href} className={`mb-6 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                  tier.highlight ? "bg-brand-600 text-white hover:bg-brand-700" : "border border-border text-text-primary hover:border-brand-300 hover:text-brand-700"
                }`}>
                  {tier.cta} <ArrowRight className="h-4 w-4" />
                </Link>
                <ul className="space-y-2">
                  {tier.features.map((feat) => (
                    <li key={feat.text} className="flex items-start gap-2 text-xs">
                      {feat.included ? (
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                      ) : (
                        <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silver-300" />
                      )}
                      <span className={feat.included ? "text-text-secondary" : "text-text-muted"}>{feat.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-secondary py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">常见问题</h2>
          <div className="mt-10 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
