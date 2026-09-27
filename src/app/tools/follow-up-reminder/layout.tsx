import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '复诊提醒生成器 — 不再错过重要复诊 | 衍策银龄 AI',
  description: '复诊提醒生成器：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/follow-up-reminder" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
