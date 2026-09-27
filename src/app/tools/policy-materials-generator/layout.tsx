import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '政策申报材料清单生成器 — 一键了解补贴申请所需材料 | 衍策银龄 AI',
  description: '政策申报材料清单生成器：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/policy-materials-generator" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
