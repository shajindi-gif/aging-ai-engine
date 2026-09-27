import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '服务订单管理 | 衍策银龄 AI',
  description: '陪诊与护理订单的创建、派单与状态管理。',
  alternates: { canonical: "/care-orders" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
