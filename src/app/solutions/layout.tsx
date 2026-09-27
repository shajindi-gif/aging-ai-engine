import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '解决方案 — 按客群场景 | 衍策银龄 AI',
  description: '陪诊公司、社区服务站、养老机构、适老化企业与政府园区的解决方案。',
  alternates: { canonical: "/solutions" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
