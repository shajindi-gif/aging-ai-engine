import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '养老补贴匹配 — 政策资格初筛 | 衍策银龄 AI',
  description: '输入老人基本情况，快速初筛可能适用的养老补贴政策方向；结果仅供参考，以主管部门审核为准。',
  alternates: { canonical: "/policy-match" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
