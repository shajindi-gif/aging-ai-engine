import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '养老机构线索评分工具 — 快速评估B2B销售线索 | 衍策银龄 AI',
  description: '养老机构线索评分工具：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/nursing-home-lead-score" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
