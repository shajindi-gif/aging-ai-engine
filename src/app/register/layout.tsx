import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '注册 | 衍策银龄 AI',
  description: '注册免费演示版，无需付费即可体验全部核心流程。',
  alternates: { canonical: "/register" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
