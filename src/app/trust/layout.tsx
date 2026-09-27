import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '信任与安全 — 医疗边界与数据安全 | 衍策银龄 AI',
  description: 'AI 生成内容的边界说明与数据安全实践。',
  alternates: { canonical: "/trust" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
