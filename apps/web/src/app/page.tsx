import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Heart,
  Database,
  Users,
  Building2,
  Bot,
  Smartphone,
  Shield,
  TrendingUp,
  Lock,
  Globe,
  Globe2,
  Puzzle,
  Code2,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Star,
  Layers,
  BookOpen,
  BarChart3,
  AlertTriangle,
  FileSearch,
  RefreshCw,
  Quote,
} from "lucide-react";

// ═══════════════════════════════════════════════
// Landing Page — 衍策银龄 AI
// ═══════════════════════════════════════════════

export default function LandingPage() {
  return (
    <>
      <Header />

      {/* ── Hero Section ────────────────────────── */}
      <section className="yc-gradient-hero relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
                <Heart className="h-3.5 w-3.5 text-brand-600" />
                <span className="text-xs font-medium text-brand-700">
                  养老服务 AI 基础设施
                </span>
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                AI 驱动的
                <br />
                <span className="yc-text-gradient">养老服务基础设施</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-text-secondary">
                为老人家庭、陪诊团队、护理机构和社区服务站提供智能工作助手
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard" className="yc-btn-primary text-base px-6 py-3">
                  免费试用
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#contact" className="yc-btn-secondary text-base px-6 py-3">
                  预约演示
                </Link>
              </div>
            </div>

            {/* Right: dashboard preview card */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-2xl shadow-brand-600/5">
                {/* Fake dashboard header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-brand-500" />
                    <span className="text-sm font-medium text-text-primary">
                      工作台概览
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">今日</span>
                </div>
                {/* Stats row */}
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "活跃工单", value: "47", color: "text-brand-600" },
                    { label: "风险预警", value: "8", color: "text-danger" },
                    { label: "本月完成", value: "186", color: "text-success" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border bg-silver-50 p-3"
                    >
                      <p className={`text-xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Fake chart area */}
                <div className="rounded-lg border border-border bg-silver-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-brand-600" />
                    <span className="text-xs font-medium text-text-secondary">
                      服务趋势（近30天）
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    {[40, 55, 35, 65, 50, 75, 60, 80, 70, 85, 90, 78].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-brand-500/70"
                          style={{ height: `${h * 0.6}px` }}
                        />
                      )
                    )}
                  </div>
                </div>
                {/* Fake recent orders */}
                <div className="mt-4 space-y-2">
                  {[
                    { name: "张秀兰", type: "陪诊", status: "已完成" },
                    { name: "王德明", type: "陪伴", status: "进行中" },
                  ].map((order) => (
                    <div
                      key={order.name}
                      className="flex items-center justify-between rounded-lg border border-border p-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-700">
                          {order.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-text-primary">
                            {order.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {order.type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs ${
                          order.status === "已完成"
                            ? "text-success"
                            : "text-brand-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative blur */}
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gold-200/30 blur-3xl" />
              <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-brand-200/30 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: "10,000+", label: "老人档案" },
              { value: "500+", label: "养老机构" },
              { value: "200+", label: "政策覆盖城市" },
              { value: "98%", label: "补贴匹配准确率" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-600 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem Section ─────────────────────── */}
      <section className="bg-surface-secondary py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              中国养老服务行业面临的真实挑战
            </h2>
            <p className="mt-4 text-text-secondary">
              2.8亿老年人口，4万亿市场，却缺乏有效的数字化工具支撑
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileSearch,
                title: "信息碎片化",
                desc: "政策散落在数百个政府网站，家属和服务商难以获取完整信息",
              },
              {
                icon: RefreshCw,
                title: "服务难追踪",
                desc: "陪诊、护理服务依赖纸质记录或微信群，缺乏标准化跟踪",
              },
              {
                icon: AlertTriangle,
                title: "政策不透明",
                desc: "补贴资格复杂、申请流程不清晰，符合条件的老人无法享受",
              },
              {
                icon: Layers,
                title: "供需不匹配",
                desc: "养老机构找不到客户，家庭找不到合适机构，信息严重不对称",
              },
            ].map((item) => (
              <div key={item.title} className="yc-card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50">
                  <item.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Matrix ──────────────────────── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="yc-badge yc-badge-brand">产品矩阵</span>
            <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">
              三大商业 MVP
            </h2>
            <p className="mt-4 text-text-secondary">
              聚焦养老核心场景，逐步构建行业基础设施
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Database,
                title: "MVP1: 银发经济政策数据库与补贴匹配",
                color: "bg-brand-50 text-brand-600",
                target: "目标用户：老人家庭、社区服务站",
                features: [
                  "覆盖200+城市养老政策",
                  "AI智能补贴资格匹配",
                  "一键生成申请指南",
                  "政策变更实时推送",
                ],
              },
              {
                icon: Users,
                title: "MVP2: 陪诊护理服务 CRM",
                color: "bg-gold-50 text-gold-600",
                target: "目标用户：陪诊公司、护理团队",
                features: [
                  "服务工单全流程管理",
                  "AI健康风险评估",
                  "智能排班与派单",
                  "家属端实时服务报告",
                ],
              },
              {
                icon: Building2,
                title: "MVP3: 养老机构销售线索库",
                color: "bg-info/10 text-info",
                target: "目标用户：养老机构、SaaS销售团队",
                features: [
                  "机构数字化成熟度评分",
                  "行业数据聚合线索",
                  "智能跟进提醒",
                  "ROI可预测模型",
                ],
              },
            ].map((mvp) => (
              <div
                key={mvp.title}
                className="yc-card flex flex-col"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${mvp.color}`}
                >
                  <mvp.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {mvp.title}
                </h3>
                <p className="mt-1 text-xs text-text-muted">{mvp.target}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {mvp.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ──────────────────── */}
      <section className="bg-surface-secondary py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              为什么选择衍策银龄 AI
            </h2>
            <p className="mt-4 text-text-secondary">
              深度行业理解 + 前沿 AI 技术 = 真正解决问题的产品
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Bot,
                title: "AI Agent 工作台",
                desc: "内置多种行业专属 Agent，自动执行政策匹配、健康摘要、风险评估等任务",
              },
              {
                icon: Smartphone,
                title: "多端入口",
                desc: "Web、Chrome 插件、MCP Server、飞书/钉钉 Bot 等多端覆盖，无缝触达用户",
              },
              {
                icon: Shield,
                title: "合规安全",
                desc: "严格遵循数据安全法、个人信息保护法，医疗信息合规，明确免责声明",
              },
              {
                icon: TrendingUp,
                title: "数据资产复利",
                desc: "服务数据持续积累，形成行业数据壁垒，AI 模型越用越准",
              },
              {
                icon: Lock,
                title: "行业数据壁垒",
                desc: "养老行业数据高度碎片化，我们通过聚合构建独特的数据护城河",
              },
              {
                icon: Layers,
                title: "SaaS 订阅",
                desc: "灵活订阅模式，从免费社区版到企业定制版，按需付费",
              },
            ].map((feature) => (
              <div key={feature.title} className="yc-card">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <feature.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integration Section ─────────────────── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="yc-badge yc-badge-gold">分发网络</span>
            <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">
              多端分发网络
            </h2>
            <p className="mt-4 text-text-secondary">
              一套 AI 引擎，多端触达，覆盖养老服务全场景
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, label: "Web 官网", status: "已上线" },
              { icon: BookOpen, label: "SaaS 后台", status: "已上线" },
              { icon: Puzzle, label: "Chrome 插件", status: "已上线" },
              { icon: Code2, label: "MCP Server", status: "已上线" },
              { icon: Code2, label: "SDK", status: "已上线" },
              { icon: Smartphone, label: "微信小程序", status: "规划中" },
              { icon: Smartphone, label: "移动端 App", status: "规划中" },
              { icon: MessageSquare, label: "飞书/钉钉 Bot", status: "已上线" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 transition-all hover:border-brand-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-silver-100">
                  <item.icon className="h-5 w-5 text-silver-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.label}
                  </p>
                  <span
                    className={`text-xs ${
                      item.status === "已上线"
                        ? "text-success"
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

      {/* ── Testimonial Section ─────────────────── */}
      <section className="bg-surface-secondary py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              客户怎么说
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                quote:
                  "之前我们用微信群接单，经常漏单、忘记回访。用了银龄 AI 工作台后，每一单都有完整记录，客户满意度提升了40%。",
                name: "张磊",
                role: "某陪诊公司 CEO",
                stars: 5,
              },
              {
                quote:
                  "政策匹配功能太实用了。我们社区很多老人不知道自己能申请哪些补贴，现在一键就能查，大大提升了服务效率。",
                name: "李芳",
                role: "某社区养老服务站站长",
                stars: 5,
              },
              {
                quote:
                  "销售线索库帮我们精准找到了有数字化需求的机构，转化周期从3个月缩短到了6周。",
                name: "陈明远",
                role: "某养老机构运营总监",
                stars: 5,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="yc-card">
                <Quote className="mb-4 h-6 w-6 text-brand-200" />
                <p className="text-sm leading-relaxed text-text-secondary">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 text-gold-500"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────── */}
      <section className="yc-gradient-brand py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            开始构建您的养老服务数字化体系
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-brand-100">
            加入数百家养老服务机构，用 AI 提升服务质量和运营效率
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
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              预约演示
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
