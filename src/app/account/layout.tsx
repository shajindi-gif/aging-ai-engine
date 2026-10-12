import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "个人中心 — 订单与会员权益 | 衍策银龄 AI",
  description: "查看订单记录、会员权益有效期与账户数据权利。",
  alternates: { canonical: "/account" },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
