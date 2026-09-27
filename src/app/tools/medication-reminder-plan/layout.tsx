import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '用药提醒计划生成器 — 智能老人用药管理 | 衍策银龄 AI',
  description: '用药提醒计划生成器：结果由规则模板根据您的输入生成（虚构样例演示），计算在本页完成，数据不上传。',
  alternates: { canonical: "/tools/medication-reminder-plan" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
