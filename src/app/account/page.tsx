"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MEDICAL_DISCLAIMER_TEXT } from "@/lib/silvercare/ui";
import { Receipt, Crown, UserCircle2, ArrowRight, ShieldAlert } from "lucide-react";

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "待支付", cls: "yc-badge yc-badge-warning" },
  PAID: { label: "已支付", cls: "yc-badge yc-badge-success" },
  CANCELLED: { label: "已取消", cls: "yc-badge" },
  REFUNDED: { label: "已退款", cls: "yc-badge" },
  EXPIRED: { label: "已过期", cls: "yc-badge" },
};

const FEATURE_LABEL: Record<string, string> = {
  "silvercare.pro": "专业版权益",
  "silvercare.team": "小团队版权益",
  "silvercare.test": "联调测试权益",
};

export default function AccountPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/account/overview", { cache: "no-store" })
      .then((r) => (r.status === 401 ? null : r.json()))
      .then((d) => {
        if (d === null) { setError("请先登录后查看"); }
        else if (d.success) setData(d.data);
        else setError(d.error || "加载失败");
      })
      .catch(() => setError("网络异常"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <section className="border-b border-border bg-white py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <span className="yc-eyebrow">个人中心</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">我的账户</h1>
            <p className="mt-2 text-sm text-text-secondary">订单、会员权益与账户信息一站式查看。</p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {loading ? <p className="text-sm text-text-secondary">加载中…</p> : error ? (
            <div className="yc-card p-6 text-center">
              <p className="text-sm text-text-secondary">{error}</p>
              <Link href="/login?callbackUrl=/account" className="yc-btn-primary mt-4">去登录</Link>
            </div>
          ) : (
            <>
              {/* 会员权益 */}
              <section className="yc-card">
                <h2 className="flex items-center gap-2 text-base font-bold text-text-primary"><Crown className="h-5 w-5 text-gold-600" aria-hidden="true" /> 会员权益</h2>
                {data.entitlements.length === 0 ? (
                  <div className="mt-4 rounded-lg bg-silver-50 p-4 text-sm text-text-secondary">
                    暂无有效权益。<Link href="/pricing" className="text-brand-700 hover:underline">查看套餐 →</Link>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {data.entitlements.map((e: any, i: number) => {
                      const days = e.expiresAt ? Math.max(0, Math.ceil((new Date(e.expiresAt).getTime() - Date.now()) / 86400000)) : null;
                      return (
                        <div key={i} className="rounded-xl border border-gold-200 bg-gold-50 p-4">
                          <p className="text-sm font-semibold text-text-primary">{FEATURE_LABEL[e.featureKey] || e.featureKey}</p>
                          <p className="mt-1 text-xs text-text-secondary">状态：{e.status === "ACTIVE" ? "生效中" : e.status} · {days != null ? `剩余 ${days} 天（${new Date(e.expiresAt).toLocaleDateString("zh-CN")} 到期）` : "长期有效"}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* 订单记录 */}
              <section className="yc-card">
                <h2 className="flex items-center gap-2 text-base font-bold text-text-primary"><Receipt className="h-5 w-5 text-brand-600" aria-hidden="true" /> 订单记录</h2>
                {data.orders.length === 0 ? (
                  <p className="mt-4 rounded-lg bg-silver-50 p-4 text-sm text-text-secondary">暂无订单。</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                          <th className="px-3 py-2 font-medium">订单号</th>
                          <th className="px-3 py-2 font-medium">商品</th>
                          <th className="px-3 py-2 font-medium">金额</th>
                          <th className="px-3 py-2 font-medium">状态</th>
                          <th className="px-3 py-2 font-medium">时间</th>
                          <th className="px-3 py-2 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.orders.map((o: any) => (
                          <tr key={o.orderNo} className="border-b border-border last:border-0">
                            <td className="px-3 py-2.5 font-mono text-xs">{o.orderNo}</td>
                            <td className="px-3 py-2.5">{o.productName}</td>
                            <td className="px-3 py-2.5">¥{(o.amountFen / 100).toFixed(2)}</td>
                            <td className="px-3 py-2.5"><span className={ORDER_STATUS[o.status]?.cls || "yc-badge"}>{ORDER_STATUS[o.status]?.label || o.status}</span></td>
                            <td className="px-3 py-2.5 text-xs text-text-muted">{new Date(o.createdAt).toLocaleString("zh-CN")}</td>
                            <td className="px-3 py-2.5">
                              {o.status === "PENDING" ? (
                                <Link href={`/checkout/${o.orderNo}`} className="text-brand-700 hover:underline">继续支付 <ArrowRight className="inline h-3 w-3" /></Link>
                              ) : (
                                <span className="text-xs text-text-muted">{o.provider === "WECHAT_PAY" ? "微信支付" : o.provider === "ALIPAY" ? "支付宝" : o.provider}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* 账户信息 */}
              <section className="yc-card">
                <h2 className="flex items-center gap-2 text-base font-bold text-text-primary"><UserCircle2 className="h-5 w-5 text-brand-600" aria-hidden="true" /> 账户信息</h2>
                <div className="mt-4 space-y-2 text-sm text-text-secondary">
                  <p>数据权利：账户与个人信息处理规则见<Link href="/privacy" className="text-brand-700 hover:underline">《隐私政策》</Link>；注销与数据删除可通过<Link href="/contact" className="text-brand-700 hover:underline">联系表单</Link>申请（人工核实后处理）。</p>
                  <p>支付与发票规则见<Link href="/terms" className="text-brand-700 hover:underline">《服务条款》</Link>。已支付订单可在<Link href="/account/invoices" className="text-brand-700 hover:underline">发票管理</Link>申请电子发票。</p>
                </div>
              </section>

              <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-text-secondary">{MEDICAL_DISCLAIMER_TEXT}</p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
