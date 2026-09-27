import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '服务条款 | 衍策银龄 AI',
  description: '使用衍策银龄 AI 的服务条款与免责边界。',
  alternates: { canonical: "/terms" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
