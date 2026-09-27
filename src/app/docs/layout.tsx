import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '帮助文档 | 衍策银龄 AI',
  description: '产品使用帮助与常见问题。',
  alternates: { canonical: "/docs" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
