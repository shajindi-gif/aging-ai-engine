"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BarChart3, Receipt, Bell, Users, ShieldAlert } from "lucide-react";

export default function AdminOpsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/ops", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => (d.success ? setData(d.data) : setError(d.error || "加载失败")))
      .catch(() => setError("网络异常"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <section className="border-b border-border bg-white py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <span className="yc-eyebrow">运营后台</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">订单与支付运营</h1>
            <p className="mt-2 text-sm text-text-secondary">仅管理员可见：订单、支付回调、通知日志与核心统计。</p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {loading ? <p className="text-sm text-text-secondary">加载中…</p> : error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}（需管理员账号登录）</p>
          ) : (
            <>
              {/* 统计 */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { icon: Receipt, label: "订单总数", value: data.stats.totalOrders },
                  { icon: Receipt, label: "已支付", value: data.stats.paidOrders },
                  { icon: BarChart3, label: "收入合计", value: `¥${(data.stats.revenueFen / 100).toFixed(2)}` },
                  { icon: Users, label: "注册用户", value: data.stats.users },
                  { icon: Users, label: "有效权益", value: data.stats.activeEntitlements },
                ].map((s) => (
                  <div key={s.label} className="yc-card">
                    <s.icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                    <p className="mt-2 text-xs text-text-muted">{s.label}</p>
                    <p className="mt-1 text-xl font-bold text-text-primary">{s.value}</p>
                  </div>
                ))}
              </section>

              {/* 订单 */}
              <section className="yc-card">
                <h2 className="text-base font-bold text-text-primary">订单列表（最近 100）</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                        <th className="px-3 py-2 font-medium">订单号</th>
                        <th className="px-3 py-2 font-medium">用户</th>
                        <th className="px-3 py-2 font-medium">商品</th>
                        <th className="px-3 py-2 font-medium">金额</th>
                        <th className="px-3 py-2 font-medium">状态</th>
                        <th className="px-3 py-2 font-medium">渠道/流水号</th>
                        <th className="px-3 py-2 font-medium">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((o: any) => (
                        <tr key={o.orderNo} className="border-b border-border last:border-0">
                          <td className="px-3 py-2 font-mono text-xs">{o.orderNo}</td>
                          <td className="px-3 py-2 text-xs">{o.user}</td>
                          <td className="px-3 py-2 text-xs">{o.productName}</td>
                          <td className="px-3 py-2">¥{(o.amountFen / 100).toFixed(2)}</td>
                          <td className="px-3 py-2"><span className={o.status === "PAID" ? "yc-badge yc-badge-success" : "yc-badge yc-badge-warning"}>{o.status}</span></td>
                          <td className="px-3 py-2 text-xs">{o.provider} {o.txnId ? `· ${String(o.txnId).slice(0, 18)}` : ""}</td>
                          <td className="px-3 py-2 text-xs text-text-muted">{new Date(o.createdAt).toLocaleString("zh-CN")}</td>
                        </tr>
                      ))}
                      {data.orders.length === 0 && <tr><td colSpan={7} className="px-3 py-6 text-center text-text-muted">暂无订单</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 支付通知日志 */}
              <section className="yc-card">
                <h2 className="flex items-center gap-2 text-base font-bold text-text-primary"><Bell className="h-5 w-5 text-gold-600" aria-hidden="true" /> 支付回调日志（最近 100）</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                        <th className="px-3 py-2 font-medium">渠道</th>
                        <th className="px-3 py-2 font-medium">商户订单号</th>
                        <th className="px-3 py-2 font-medium">结果</th>
                        <th className="px-3 py-2 font-medium">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.notifyLogs.map((l: any, i: number) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-3 py-2 text-xs">{l.provider}</td>
                          <td className="px-3 py-2 font-mono text-xs">{l.outTradeNo || "—"}</td>
                          <td className="px-3 py-2 text-xs">
                            <span className={l.result === "processed" ? "yc-badge yc-badge-success" : l.result === "duplicate" ? "yc-badge" : "yc-badge yc-badge-warning"}>{l.result}</span>
                          </td>
                          <td className="px-3 py-2 text-xs text-text-muted">{new Date(l.createdAt).toLocaleString("zh-CN")}</td>
                        </tr>
                      ))}
                      {data.notifyLogs.length === 0 && <tr><td colSpan={4} className="px-3 py-6 text-center text-text-muted">暂无回调记录（生产支付成功后出现）</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="yc-card flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-text-primary">发票申请管理</h2>
                  <p className="mt-1 text-sm text-text-secondary">查看用户开票申请，人工开具后回填发票号。</p>
                </div>
                <Link href="/admin/invoices" className="yc-btn-primary shrink-0">进入发票管理</Link>
              </section>

              <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-text-secondary">高风险操作（退款、权限修改）需走专项审批与审计留痕，当前版本未开放线上退款按钮，退款经商户后台操作后同步状态。</p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
