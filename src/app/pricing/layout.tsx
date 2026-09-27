import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '产品定价 — 免费演示版与团队方案 | 衍策银龄 AI',
  description: '免费演示版注册即用；团队版与定制版联系开通。每档功能如实标注当前可用与规划中。',
  alternates: { canonical: "/pricing" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
