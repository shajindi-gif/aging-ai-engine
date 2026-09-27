import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '合规声明 — 数据安全与医疗边界 | 衍策银龄 AI',
  description: '我们在数据合规、医疗边界、隐私保护方面的实践与承诺（区分已实现与持续建设项）。',
  alternates: { canonical: "/compliance" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
