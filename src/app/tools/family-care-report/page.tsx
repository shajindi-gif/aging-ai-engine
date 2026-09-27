"use client";
import { ToolLayout } from "@/components/shared";
import ToolRunner from "@/components/tools/ToolRunner";
import { mockTools } from "@/lib/mock/tools";

export default function ToolPage() {
  const tool = mockTools.find((t) => t.slug === "family-care-report");
  if (!tool) return null;
  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      breadcrumbs={[{ label: "免费工具", href: "/tools" }, { label: tool.name, href: "#" }]}
    >
      <ToolRunner tool={tool} />
      <div className="mt-10">
        <h3 className="mb-4 text-sm font-semibold">相关工具</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tool.relatedTools.map((rSlug) => {
            const related = mockTools.find((t) => t.slug === rSlug);
            if (!related) return null;
            return (
              <a key={rSlug} href={"/tools/" + rSlug} className="yc-card p-4 transition hover:border-[var(--color-brand-300)]">
                <h4 className="text-sm font-medium">{related.name}</h4>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{related.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
