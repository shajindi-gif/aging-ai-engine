import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '产品演示 — 五分钟导览路线 | 衍策银龄 AI',
  description: '按虚构演示数据走完建档、服务记录、家属报告与家属看板的五分钟可重复路线。',
  alternates: { canonical: "/demo" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
