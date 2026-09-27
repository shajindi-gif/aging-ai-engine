import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '隐私政策 | 衍策银龄 AI',
  description: '我们如何收集、使用、存储与保护您的个人信息，以及您可行使的权利。',
  alternates: { canonical: "/privacy" },
};

export default function ToolPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
