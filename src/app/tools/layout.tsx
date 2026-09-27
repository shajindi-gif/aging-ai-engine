import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '免费工具 — 10 个养老服务生成器 | 衍策银龄 AI',
  description: '补贴初筛、照护报告、陪诊记录、风险初筛等 10 个免费工具；结果由规则模板生成（虚构样例演示）。',
  alternates: { canonical: "/tools" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
