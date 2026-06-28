"use client";
import { SiteHeader, SiteFooter, CTASection } from "@/components/shared";
import { mockTrustItems } from "@/lib/mock/growth-data";

const CATEGORY_LABELS: Record<string, string> = { medical: "医疗边界", privacy: "隐私保护", security: "数据安全", compliance: "合规透明" };
const CATEGORY_ICONS: Record<string, string> = { medical: "🏥", privacy: "🔒", security: "🛡️", compliance: "✅" };

export default function TrustPage() {
  const categories = ["medical", "privacy", "security", "compliance"] as const;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-silver-50)]/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">信任与安全</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              衍策银龄 AI 在医疗边界、隐私保护、数据安全和合规透明方面的承诺与实践
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {categories.map((cat) => {
            const items = mockTrustItems.filter((t) => t.category === cat);
            return (
              <section key={cat} className="mb-10">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((item) => (
                    <div key={item.id} className="yc-card p-5">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Medical disclaimer full text */}
          <section className="mb-10">
            <div className="yc-disclaimer yc-disclaimer-medical p-6">
              <h3 className="mb-2 text-sm font-semibold">完整医疗边界声明</h3>
              <p className="text-sm leading-relaxed">
                本系统仅用于健康信息整理、服务记录和风险提示，不替代医生诊断、治疗建议或医疗决策。具体诊疗请咨询执业医生。
                所有 AI 生成的健康相关内容由算法模型辅助生成，不保证医学准确性。涉及诊断、用药、手术等医疗决策的内容，
                必须经执业医师确认后方可参考。
              </p>
            </div>
          </section>

          {/* Policy disclaimer full text */}
          <section className="mb-10">
            <div className="yc-disclaimer p-6">
              <h3 className="mb-2 text-sm font-semibold">完整政策匹配免责声明</h3>
              <p className="text-sm leading-relaxed">
                政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。
                本系统收录的政策信息来源于公开渠道，可能存在时效性差异。建议在办理前向相关部门确认最新政策。
              </p>
            </div>
          </section>

          {/* Enterprise features planning */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">企业级安全特性（规划中）</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: "SSO 单点登录", desc: "支持企业级 SAML/OIDC 集成" },
                { title: "私有化部署", desc: "支持本地部署和数据隔离" },
                { title: "SLA 保障", desc: "99.9% 可用性承诺" },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-silver-50)] p-5 text-center">
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <CTASection variant="light" />
      </main>
      <SiteFooter />
    </>
  );
}
