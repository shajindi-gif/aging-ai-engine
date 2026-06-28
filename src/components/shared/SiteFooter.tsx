"use client";

const FOOTER_LINKS = [
  { title: "产品", links: [
    { label: "免费工具", href: "/tools" },
    { label: "模板库", href: "/templates" },
    { label: "政策数据库", href: "/policies" },
    { label: "护理 CRM", href: "/care-crm" },
    { label: "机构线索库", href: "/institutions" },
  ]},
  { title: "解决方案", links: [
    { label: "老人家庭", href: "/solutions/elder-family" },
    { label: "陪诊公司", href: "/solutions/medical-companion-company" },
    { label: "社区服务站", href: "/solutions/community-care-station" },
    { label: "养老机构", href: "/solutions/nursing-home" },
    { label: "政府/园区", href: "/solutions/government-park" },
  ]},
  { title: "资源", links: [
    { label: "城市政策", href: "/resources/city-aging-policy" },
    { label: "长护险专题", href: "/resources/long-term-care-insurance" },
    { label: "居家养老", href: "/resources/home-care" },
    { label: "银发经济", href: "/resources/silver-economy" },
    { label: "子女照护指南", href: "/resources/elder-family-guide" },
  ]},
  { title: "开发者", links: [
    { label: "API 文档", href: "/developers" },
    { label: "SDK", href: "/developers" },
    { label: "MCP Server", href: "/developers" },
    { label: "Chrome 插件", href: "/developers" },
    { label: "Webhook", href: "/developers" },
  ]},
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-silver-50)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[var(--color-brand-600)] to-[var(--color-brand-500)] px-8 py-8 text-center text-white">
          <h3 className="text-xl font-semibold">开始用 AI 升级您的养老服务</h3>
          <p className="mt-2 text-sm text-[var(--color-brand-100)]">免费注册，立即体验养老补贴匹配、家属报告生成等 AI 工具</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="/tools/subsidy-checker" className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-brand-700)] shadow-sm transition hover:bg-[var(--color-brand-50)]">免费试用</a>
            <a href="/demo" className="inline-flex items-center rounded-md border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">预约演示</a>
            <a href="/pricing" className="inline-flex items-center rounded-md border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">查看定价</a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-brand-600)]">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-[var(--color-text-muted)] sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; 2026 上海衍策引擎人工智能科技有限公司 &middot; 衍策银龄 AI</p>
          <div className="flex gap-4">
            <a href="/compliance" className="hover:text-[var(--color-brand-600)]">合规与隐私</a>
            <a href="/trust" className="hover:text-[var(--color-brand-600)]">信任与安全</a>
            <a href="/contact" className="hover:text-[var(--color-brand-600)]">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
