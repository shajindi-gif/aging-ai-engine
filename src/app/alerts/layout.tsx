import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '提醒中心 — 异常事件分级提醒 | 衍策银龄 AI',
  description: '健康与照护异常事件的分级提醒与处理（需登录）。',
  alternates: { canonical: "/alerts" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
