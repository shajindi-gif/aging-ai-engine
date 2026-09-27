import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '适老化改造清单生成器 — 居家养老改造方案一键生成 | 衍策银龄 AI',
  description: '适老化改造清单生成器：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/home-aging-modification-checklist" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
