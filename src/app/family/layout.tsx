import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '家属看板 — 家人健康状况一目了然 | 衍策银龄 AI',
  description: '查看老人最近指标、风险趋势、AI 摘要与今日任务（需登录，演示数据已标注）。',
  alternates: { canonical: "/family" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
