import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '服务模板库 — 报告/通知/清单模板 | 衍策银龄 AI',
  description: '养老服务报告、通知与清单模板，一键生成专业文档。',
  alternates: { canonical: "/templates" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
