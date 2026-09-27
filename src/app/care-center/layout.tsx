import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '机构看板 — 护理对象总览 | 衍策银龄 AI',
  description: '按综合状态排序的护理对象总览与筛选（需登录，基础版）。',
  alternates: { canonical: "/care-center" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
