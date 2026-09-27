import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '系统入口导航 | 衍策银龄 AI',
  description: '各端入口总览（需登录）。',
  alternates: { canonical: "/admin" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
