import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Check, X as XIcon, ArrowRight, Heart, Building2, Sparkles, Database, Globe } from "lucide-react";

// 说明：included=true 为当前版本已可使用的功能；included:"planned" 表示规划中、开通前会与您确认
const tiers = [
  {
    name: "免费演示版",
    price: "免费",
    priceNote: "永久免费",
    icon: Heart,
    desc: "注册即用，体验全部核心流程（当前开放）",
    highlight: false,
    cta: "立即体验",
    href: "/dashboard",
    features: [
      { text: "老人档案与照护记录（数量暂未限制）", included: true },
      { text: "政策库查询（演示数据 41 条）", included: true },
      { text: "补贴初筛与全部 10 个免费工具", included: true },
      { text: "订单与服务记录管理", included: true },
      { text: "健康 OS：活动测试/每日打卡/家属看板", included: true },
      { text: "AI 摘要（规则模式）", included: true },
      { text: "API 接口", included: false },
      { text: "数据导出", included: false },
    ],
    note: "试用条件：无需付费、无需绑定支付方式，注册即可用。",
  },
  {
    name: "小团队版",
    price: "¥980",
    priceNote: "/月（意向价，正式售卖前可谈）",
    icon: Globe,
    desc: "适合小型陪诊团队和社区服务站",
    highlight: false,
    cta: "联系咨询开通",
    href: "/contact",
    features: [
      { text: "免费版全部功能", included: true },
      { text: "团队成员协作（开发中）", included: "planned" },
      { text: "政策库扩容与更新（以实际收录为准）", included: true },
      { text: "API 接口（额度开通时约定）", included: "planned" },
      { text: "数据导出（开发中）", included: "planned" },
      { text: "专属技术支持", included: false },
    ],
    note: "试用条件：联系后人工开通，试用期与范围双方约定。",
  },
  {
    name: "专业版",
    price: "¥2,980",
    priceNote: "/月（意向价，正式售卖前可谈）",
    icon: Sparkles,
    desc: "适合中型护理团队",
    highlight: true,
    cta: "联系咨询开通",
    href: "/contact",
    features: [
      { text: "小团队版全部功能", included: true },
      { text: "AI Care Agent 摘要与任务/提醒（规则模式已上线，LLM 增强规划中）", included: true },
      { text: "家属看板与报告导出（报告导出开发中）", included: "planned" },
      { text: "批量管理与报表（开发中）", included: "planned" },
      { text: "在线技术支持（工单系统规划中，当前微信/邮件支持）", included: true },
    ],
    note: "试用条件：联系后人工开通，试用期与范围双方约定。",
  },
  {
    name: "数据库订阅版",
    price: "¥4,980",
    priceNote: "/月（意向价，正式售卖前可谈）",
    icon: Database,
    desc: "适合养老 SaaS 厂商和设备供应商",
    highlight: false,
    cta: "联系销售",
    href: "/contact",
    features: [
      { text: "养老机构线索库在线查询（演示数据 80 家）", included: true },
      { text: "机构数字化成熟度评分工具", included: true },
      { text: "政策数据 API（需联调）", included: "planned" },
      { text: "线索批量导出（开发中）", included: "planned" },
      { text: "定制报表（开发中）", included: "planned" },
    ],
    note: "试用条件：联系后提供测试数据样例与联调支持。",
  },
  {
    name: "园区/街道定制版",
    price: "联系销售",
    priceNote: "按项目报价",
    icon: Building2,
    desc: "适合大型养老集团、园区和街道",
    highlight: false,
    cta: "预约演示",
    href: "/contact",
    features: [
      { text: "定制化模块开发（需求评估后报价）", included: true },
      { text: "私有化部署（可评估实施）", included: true },
      { text: "SLA 与驻场支持（以合同约定为准）", included: true },
      { text: "自定义 Agent / API（评估后开发）", included: true },
    ],
    note: "交付周期：标准定制 4-8 周（视需求而定）。",
  },
];

const faqs = [
  { q: "怎么开通试用或购买？", a: "当前尚未开放自助付费与自动试用开通。免费演示版注册即可使用；付费版本请通过「联系咨询」提交需求，我们确认功能范围后人工开通并约定试用条件。" },
  { q: "数据安全如何保障？", a: "我们遵循《数据安全法》和《个人信息保护法》：传输 HTTPS 加密、敏感接口需登录访问、角色权限隔离；静态加密与等保认证在持续推进中，可按客户要求配合安全评估。企业版可评估私有化部署。" },
  { q: "数据库订阅版和专业版有什么区别？", a: "专业版面向服务提供方（陪诊公司、护理团队），包含完整的CRM和服务管理功能。数据库订阅版面向行业供应商（SaaS厂商、设备商），核心是机构线索库和政策数据API。" },
  { q: "可以从低版本升级吗？", a: "可以。目前通过联系我们完成升级配置，数据保留在您的账户中。" },
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
                      {feat.included === true ? (
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                      ) : feat.included === "planned" ? (
                        <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-[9px] font-bold text-gold-700">划</span>
                      ) : (
                        <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silver-300" />
                      )}
                      <span className={feat.included === true ? "text-text-secondary" : "text-text-muted"}>{feat.text}</span>
                    </li>
                  ))}
                </ul>
                {tier.note && (
                  <p className="mt-4 rounded-lg bg-silver-50 px-3 py-2 text-[11px] leading-relaxed text-text-muted">{tier.note}</p>
                )}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-text-muted">
            图例：<Check className="inline h-3.5 w-3.5 text-brand-500" /> 当前版本已可用 ·
            <span className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-100 text-[9px] font-bold text-gold-700 align-middle">划</span> 规划中（开通前会与您确认时间表）·
            <XIcon className="ml-1 inline h-3.5 w-3.5 text-silver-300" /> 暂不提供。销售路径：各套餐按钮均进入联系表单，1-2 个工作日回复。
          </p>
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
