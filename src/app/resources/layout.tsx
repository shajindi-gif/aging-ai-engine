import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '资源中心 — 城市政策专题与指南 | 衍策银龄 AI',
  description: '城市养老政策专题、行业指南与照护指南。',
  alternates: { canonical: "/resources" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
