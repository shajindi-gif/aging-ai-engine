"use client";
import { SiteHeader, SiteFooter, CTASection } from "@/components/shared";

const CODE_EXAMPLES = [
  { title: "查询政策", code: `import { AgingAI } from '@aging-ai/sdk';

const client = new AgingAI({ apiKey: 'your-api-key' });
const policies = await client.policies.list({ region: '上海' });
console.log(policies);` },
  { title: "匹配补贴", code: `const result = await client.agents.policyMatch({
  region: '上海',
  age: 78,
  livingStatus: 'alone',
  careLevel: 'semi_dependent',
});
// result.matchedPolicies, result.matchScore` },
  { title: "生成家属报告", code: `const report = await client.agents.elderReport('elder-001');
// report.healthSummary
// report.riskAlerts
// report.familyFriendlySummary` },
  { title: "创建护理记录", code: `await client.careRecords.create({
  careOrderId: 'order-001',
  elderId: 'elder-001',
  recordType: 'vital_check',
  content: '血压 130/85mmHg，体温 36.5°C',
  riskLevel: 'none',
});` },
  { title: "查询机构线索", code: `const institutions = await client.institutions.list({
  region: '上海',
  institutionType: 'nursing_home',
});
// institutions[].digitalMaturityScore
// institutions[].purchaseIntentScore` },
];

const MCP_TOOLS = [
  "search_aging_policy", "match_elder_subsidy", "summarize_policy",
  "generate_application_materials", "search_aging_institution",
  "profile_aging_institution", "create_care_record",
  "generate_elder_family_report", "detect_elder_risk",
  "generate_care_service_summary", "generate_sales_followup_plan",
  "search_silver_economy_leads",
];

export default function DevelopersPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">开发者平台</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              TypeScript SDK、REST API、MCP Server、Chrome 插件 — 快速集成养老服务 AI 能力
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 真实状态总览 */}
          <section className="mb-10">
            <div className="rounded-xl border border-gold-200 bg-gold-50 px-5 py-4">
              <p className="text-sm font-semibold text-gold-800">当前真实可用状态（如实说明）</p>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-text-secondary">
                <li>· REST API：本站 <code className="rounded bg-white px-1">/api/policies</code> 等只读接口可直接调用（无需密钥，公开数据）；写操作与个人数据接口需登录会话。</li>
                <li>· TypeScript SDK / MCP Server：源码已开发，<strong>尚未发布到 npm</strong>，安装命令暂不可用；需通过联系我们获取源码包与接入说明。</li>
                <li>· 商业化 API Key / 计量计费：规划中，未上线。</li>
              </ul>
            </div>
          </section>

          {/* API Overview */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">API Overview</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="yc-card p-5">
                <h3 className="text-sm font-semibold">REST API <span className="yc-badge yc-badge-success ml-1">已可用</span></h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">公开数据只读接口，JSON 格式，无需密钥</p>
                <code className="mt-2 block rounded bg-[var(--color-silver-900)] p-2 text-xs text-green-400">GET https://&lt;本站域名&gt;/api/policies</code>
              </div>
              <div className="yc-card p-5">
                <h3 className="text-sm font-semibold">TypeScript SDK <span className="yc-badge yc-badge-gold ml-1">内测·未发布 npm</span></h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">源码已开发，联系获取源码包后本地构建使用</p>
                <code className="mt-2 block rounded bg-[var(--color-silver-900)] p-2 text-xs text-green-400">联系我们获取 → npm run build</code>
              </div>
              <div className="yc-card p-5">
                <h3 className="text-sm font-semibold">MCP Server <span className="yc-badge yc-badge-gold ml-1">内测·未发布 npm</span></h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">源码已开发（stdio 传输），联系获取后本地运行</p>
                <code className="mt-2 block rounded bg-[var(--color-silver-900)] p-2 text-xs text-green-400">联系我们获取 → node dist/index.js</code>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">快速开始（REST API，立即可用）</h2>
            <div className="yc-card p-6">
              <div className="rounded-lg bg-[var(--color-silver-900)] p-4 text-sm text-silver-200">
                <pre className="overflow-x-auto text-xs text-[#a5f3fc]">{`# 1. 查询政策库（公开只读接口，无需密钥）
curl "https://yanglaoai999.com/api/policies?city=上海&page=1&pageSize=10"

# 2. 查询机构库
curl "https://yanglaoai999.com/api/institutions?page=1&pageSize=10"

# 3. SDK / MCP Server（内测）：联系我们获取源码包
#    获取后：解压 → npm install → npm run build → 按包内 README 接入`}</pre>
              </div>
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">说明：涉及个人数据或写操作的接口需登录会话，暂不对外开放 API Key。</p>
            </div>
          </section>

          {/* Code examples */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">示例代码</h2>
            <div className="space-y-4">
              {CODE_EXAMPLES.map((ex) => (
                <div key={ex.title} className="yc-card p-5">
                  <h3 className="mb-2 text-sm font-semibold">{ex.title}</h3>
                  <pre className="overflow-x-auto rounded-lg bg-[var(--color-silver-900)] p-4 text-xs text-[#a5f3fc]">{ex.code}</pre>
                </div>
              ))}
            </div>
          </section>

          {/* MCP Server */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">MCP Server</h2>
            <div className="yc-card p-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                衍策银龄 AI MCP Server 提供 12 个 AI 工具，可通过 stdio 传输协议集成到 Claude Desktop、Cursor 或其他支持 MCP 的客户端。
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {MCP_TOOLS.map((tool) => (
                  <div key={tool} className="flex items-center gap-2 rounded-lg bg-[var(--color-silver-50)] p-2.5">
                    <span className="text-xs text-[var(--color-brand-500)]">⚡</span>
                    <code className="text-xs text-[var(--color-text-primary)]">{tool}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Chrome Extension */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">Chrome 插件</h2>
            <div className="yc-card p-6">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Aging AI Engine Web Clipper — 浏览政策网页时一键摘要与保存，浏览养老机构网页时一键生成销售线索。
                Manifest V3，支持 popup 和 sidepanel 两种交互模式。
              </p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                插件尚未公开发布商店安装包；如需在内测阶段试用，请通过联系表单索取安装包与说明。
              </p>
              <div className="mt-4 flex gap-3">
                <a href="/contact" className="yc-btn-primary text-xs">联系我们获取插件</a>
                <a href="/contact" className="yc-btn-secondary text-xs">咨询接入说明</a>
              </div>
            </div>
          </section>

          {/* Webhook */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">Webhook（规划中）</h2>
            <div className="rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-silver-50)] p-8 text-center">
              <span className="text-3xl">🔗</span>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Webhook 功能正在规划中，支持风险事件通知、订单状态变更、政策更新等实时推送。
              </p>
              <a href="/contact" className="yc-btn-secondary mt-3 inline-block text-xs">提前预约</a>
            </div>
          </section>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-3 rounded-2xl bg-[var(--color-silver-900)] p-8 text-center text-white">
            <a href="/docs" className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-silver-900)]">查看文档</a>
            <a href="/contact" className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white">申请 API 试用</a>
            <a href="/contact" className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white">联系合作</a>
          </div>
        </div>

        <CTASection variant="light" />
      </main>
      <SiteFooter />
    </>
  );
}
