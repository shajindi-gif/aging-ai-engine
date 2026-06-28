"use client";
import { use } from "react";
import { ToolLayout, PolicyDisclaimer } from "@/components/shared";
import { mockSEOPages } from "@/lib/mock/growth-data";

export default function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const page = mockSEOPages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <ToolLayout title="页面未找到" description="该资源页面不存在">
        <a href="/resources" className="yc-btn-primary text-xs">返回资源中心</a>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title={page.title}
      description={page.description}
      breadcrumbs={[{ label: "资源中心", href: "/resources" }, { label: page.title, href: "#" }]}
    >
      <div className="prose max-w-none">
        <div className="yc-card p-8">
          <h2 className="text-lg font-semibold mb-4">{page.title}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{page.description}</p>
          <div className="mt-6 rounded-lg bg-[var(--color-silver-50)] p-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              本专题内容由衍策银龄 AI 团队整理，涵盖国家及各省市最新政策、行业数据和专业分析。
              内容持续更新中，欢迎反馈和建议。
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <h3 className="text-base font-semibold">核心内容</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {["政策梳理与解读", "数据与趋势分析", "实践案例参考", "工具与模板推荐"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg bg-[var(--color-brand-50)] p-3 text-sm">
                  <span className="text-[var(--color-brand-500)]">✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <PolicyDisclaimer />
        </div>
      </div>
    </ToolLayout>
  );
}
