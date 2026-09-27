import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '开发者 — REST API / SDK / MCP（内测） | 衍策银龄 AI',
  description: 'REST 公开接口立即可用；SDK 与 MCP Server 内测中，联系获取。如实标注当前可用状态。',
  alternates: { canonical: "/developers" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
