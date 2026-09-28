"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, CreditCard, ExternalLink, RefreshCw } from "lucide-react";

export default function CheckoutPage() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const returnFlag = useSearchParams().get("paid");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [simulateResult, setSimulateResult] = useState("");

  useEffect(() => { refresh(); }, [orderNo]);

  async function refresh() {
    const res = await fetch(`/api/pay/status?orderNo=${orderNo}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success) { setOrder(json.data); setError(""); }
    else setError(json.error || "订单加载失败");
    setLoading(false);
  }

  async function goPay() {
    setPaying(true);
    setError("");
    try {
      const res = await fetch("/api/pay/alipay/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, origin: window.location.origin }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && json.data?.payUrl) {
        window.location.href = json.data.payUrl; // 302 到支付宝收银台
      } else if (json.mockMode) {
        setMockMode(true);
        setError(json.error);
      } else {
        setError(json.error || "发起支付失败，请重试");
      }
    } catch {
      setError("网络异常，请重试");
    } finally {
      setPaying(false);
    }
  }

  async function simulatePay() {
    setPaying(true);
    try {
      const res = await fetch("/api/pay/test/simulate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo }),
      });
      const json = await res.json().catch(() => ({}));
      setSimulateResult(json?.data?.result === "processed" ? "已模拟支付成功并开通权益" : json?.data?.result || json.error || "失败");
      await refresh();
    } finally { setPaying(false); }
  }

  const paid = order?.status === "PAID";

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
          <span className="yc-eyebrow">收银台</span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">订单支付</h1>

          {loading ? (
            <p className="mt-8 text-sm text-text-secondary">加载中…</p>
          ) : error && !order ? (
            <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : paid ? (
            <div className="mt-8 rounded-2xl border border-success/30 bg-white p-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-text-primary">支付成功</h2>
              <p className="mt-2 text-sm text-text-secondary">{order.productName} 已开通，权益有效期以站内说明为准。</p>
              <Link href="/family" className="yc-btn-primary mt-6">进入工作台</Link>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-text-secondary">{order.productName}</span>
                <span className="text-2xl font-bold text-text-primary">¥{(order.amountFen / 100).toFixed(2)}</span>
              </div>
              <div className="py-3 text-xs text-text-muted">订单号：{order.orderNo}</div>
              <button onClick={goPay} disabled={paying} className="yc-btn-primary w-full justify-center py-3 disabled:opacity-60">
                <CreditCard className="h-5 w-5" /> {paying ? "跳转中…" : "去支付宝支付"}
              </button>
              {error && (
                <div className="mt-4 rounded-lg border border-gold-200 bg-gold-50 px-3 py-2.5">
                  <p className="text-xs leading-relaxed text-text-secondary">{error}</p>
                  {mockMode && (
                    <button onClick={simulatePay} disabled={paying} className="yc-btn-secondary mt-2 w-full justify-center py-2 text-xs">
                      <RefreshCw className="h-3.5 w-3.5" /> 模拟支付成功（测试模式，非真实收款）
                    </button>
                  )}
                </div>
              )}
              {simulateResult && <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800">{simulateResult}（测试模式）</p>}
              <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
                支付由支付宝提供，付款状态以支付宝异步通知与服务端查单为准。退款与开票规则见《服务条款》；有疑问请通过联系表单咨询。
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
