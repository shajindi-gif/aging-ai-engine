import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '养老补贴资格初筛 — 免费查询可申请的高龄津贴、长护险、适老化改造补贴 | 衍策银龄 AI',
  description: '养老补贴资格初筛工具：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/subsidy-checker" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
