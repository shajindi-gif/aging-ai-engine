import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '养老政策数据库 — 检索各地养老政策与补贴 | 衍策银龄 AI',
  description: '检索各地养老政策、补贴与长护险信息，支持按城市、类型、级别筛选（演示数据已标注）。',
  alternates: { canonical: "/policies" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
