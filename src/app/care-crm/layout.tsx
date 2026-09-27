import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '陪诊护理服务 CRM — 订单、服务记录与家属通知 | 衍策银龄 AI',
  description: '面向陪诊/护理团队的服务管理系统：老人档案、订单管理、服务记录、家属通知一站式闭环。',
  alternates: { canonical: "/care-crm" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
