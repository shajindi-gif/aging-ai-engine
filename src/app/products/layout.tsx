import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '产品矩阵 — 政策库·CRM·线索库 | 衍策银龄 AI',
  description: '了解衍策银龄 AI 的三条产品线与各自功能范围。',
  alternates: { canonical: "/products" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
