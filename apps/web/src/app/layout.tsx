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
  title: "衍策银龄 AI — AI驱动的养老服务基础设施",
  description:
    "为老人家庭、陪诊团队、护理机构和社区服务站提供智能工作助手。涵盖养老政策数据库、补贴匹配、陪诊CRM、健康档案管理、养老机构销售线索等核心功能。",
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
