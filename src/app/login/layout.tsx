import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '登录 | 衍策银龄 AI',
  description: '登录衍策银龄 AI 工作台。',
  alternates: { canonical: "/login" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
