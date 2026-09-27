import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '建立老人健康档案 | 衍策银龄 AI',
  description: '填写基本信息快速建立老人档案并开始健康评估。',
  alternates: { canonical: "/onboarding" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
