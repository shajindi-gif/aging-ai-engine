import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '护理服务记录 | 衍策银龄 AI',
  description: '记录每次陪诊/护理服务的详细内容与观察。',
  alternates: { canonical: "/care-records" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
