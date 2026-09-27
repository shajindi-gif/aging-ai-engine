import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '养老机构销售线索库 — 机构画像与数字化评分 | 衍策银龄 AI',
  description: '浏览养老机构档案与数字化成熟度评分，管理销售线索（演示数据已标注）。',
  alternates: { canonical: "/institutions" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
