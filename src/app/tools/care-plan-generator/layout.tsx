import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '居家照护计划生成器 — AI定制老人居家护理方案 | 衍策银龄 AI',
  description: '居家照护计划生成器：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/care-plan-generator" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
