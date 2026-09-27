import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '老人档案管理 | 衍策银龄 AI',
  description: '老人基本信息、照护等级与健康基线档案管理。',
  alternates: { canonical: "/elders" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
