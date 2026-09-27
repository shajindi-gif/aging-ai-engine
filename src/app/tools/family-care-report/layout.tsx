import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '家属照护报告生成器 — 自动生成老人健康周报，让子女安心 | 衍策银龄 AI',
  description: '家属照护报告生成器：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/family-care-report" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
