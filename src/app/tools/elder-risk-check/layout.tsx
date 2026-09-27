import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '老人照护风险初筛 — 免费评估居家养老安全风险 | 衍策银龄 AI',
  description: '老人照护风险初筛工具：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/elder-risk-check" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
