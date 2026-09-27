import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '联系我们 — 咨询、合作与演示预约 | 衍策银龄 AI',
  description: '通过表单或邮箱联系我们，工作日 1-2 个工作日内回复。',
  alternates: { canonical: "/contact" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
