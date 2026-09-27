import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '陪诊记录总结器 — 一键生成结构化陪诊报告 | 衍策银龄 AI',
  description: '陪诊记录总结器：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/medical-companion-summary" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
