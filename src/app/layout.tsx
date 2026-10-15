export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://yanglaoai999.com"
  ),
  title: "衍策银龄 — 养老政策查询与照护管理服务",
  description:
    "帮家庭查清父母能享受的养老补贴与政策，帮陪诊护理机构管好档案、订单和家属沟通。衍策银龄，让养老照护更有条理。",
  keywords: [
    "养老服务",
    "AI",
    "老年人",
    "陪诊",
    "护理",
    "养老政策",
    "补贴匹配",
    "健康档案",
    "养老机构",
    "银发经济",
    "衍策银龄",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "衍策银龄",
    title: "衍策银龄 — 养老政策查询与照护管理服务",
    description:
      "帮家庭查清父母能享受的养老补贴与政策，帮陪诊护理机构管好档案、订单和家属沟通。",
  },
  twitter: {
    card: "summary",
    title: "衍策银龄 — 养老政策查询与照护管理服务",
    description: "养老政策查询、陪诊护理管理、家属报告——让养老照护更有条理。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
