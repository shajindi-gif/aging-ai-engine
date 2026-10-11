"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, RefreshCw, Smartphone, QrCode } from "lucide-react";

export default function CheckoutPage() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const returnFlag = useSearchParams().get("paid");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState<"alipay" | "wechat" | null>(null);
  const [wxQr, setWxQr] = useState<string | null>(null); // 二维码 dataURL
  const [mockMode, setMockMode] = useState(false);
  const [simulateResult, setSimulateResult] = useState("");

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/pay/status?orderNo=${orderNo}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success) { setOrder(json.data); setError(""); return json.data.status; }
    else setError(json.error || "订单加载失败");
    return null;
  }, [orderNo]);

  useEffect(() => { refresh().finally(() => setLoading(false)); }, [refresh]);

  // 微信二维码出现后轮询订单状态（支付成功自动切换）
  useEffect(() => {
    if (!wxQr || order?.status === "PAID") return;
    const t = setInterval(async () => {
      const s = await refresh();
      if (s === "PAID") clearInterval(t);
    }, 3000);
    return () => clearInterval(t);
  }, [wxQr, order?.status, refresh]);

  async function goAlipay() {
    setPaying("alipay"); setError("");
    try {
      const res = await fetch("/api/pay/alipay/pay", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, origin: window.location.origin }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && json.data?.payUrl) {
        window.location.href = json.data.payUrl; // 跳支付宝收银台
      } else if (json.mockMode) { setMockMode(true); setError(json.error); }
      else setError(json.error || "发起支付失败，请重试");
    } catch { setError("网络异常，请重试"); }
    finally { setPaying(null); }
  }

  async function goWechat() {
    setPaying("wechat"); setError(""); setWxQr(null);
    try {
      const res = await fetch("/api/pay/wechat/pay", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && json.data?.qrDataUrl) {
        setWxQr(json.data.qrDataUrl);
      } else if (json.mockMode) { setMockMode(true); setError(json.error); }
      else setError(json.error || "微信下单失败，请重试或改用支付宝");
    } catch { setError("网络异常，请重试"); }
    finally { setPaying(null); }
  }

  async function simulatePay() {
    setPaying("wechat");
    try {
      const res = await fetch("/api/pay/test/simulate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo }),
      });
      const json = await res.json().catch(() => ({}));
      setSimulateResult(json?.data?.result === "processed" ? "已模拟支付成功并开通权益" : json?.data?.result || json.error || "失败");
      await refresh();
    } finally { setPaying(null); }
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
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/family" className="yc-btn-primary">进入工作台</Link>
                <Link href="/" className="yc-btn-secondary">返回首页</Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-text-secondary">{order.productName}</span>
                <span className="text-2xl font-bold text-text-primary">¥{(order.amountFen / 100).toFixed(2)}</span>
              </div>
              <div className="py-3 text-xs text-text-muted">订单号：{order.orderNo} · 15 分钟内有效</div>

              {wxQr ? (
                <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-6 text-center">
                  <QrCode className="mx-auto h-6 w-6 text-brand-600" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-text-primary">请使用微信扫码支付</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={wxQr} alt="微信支付二维码" width={220} height={220} className="mx-auto mt-3 rounded-lg bg-white p-2" />
                  <p className="mt-2 text-xs text-text-muted">支付后本页自动跳转；也可 <button onClick={() => refresh()} className="text-brand-700 underline">手动刷新</button></p>
                  <button onClick={() => setWxQr(null)} className="mt-3 text-xs text-text-secondary underline">返回选择其他支付方式</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={goAlipay} disabled={!!paying} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677ff] py-3.5 text-base font-medium text-white transition hover:opacity-90 disabled:opacity-60">
                    <Smartphone className="h-5 w-5" aria-hidden="true" /> {paying === "alipay" ? "跳转中…" : "支付宝支付（推荐）"}
                  </button>
                  <button onClick={goWechat} disabled={!!paying} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07c160] py-3.5 text-base font-medium text-white transition hover:opacity-90 disabled:opacity-60">
                    <QrCode className="h-5 w-5" aria-hidden="true" /> {paying === "wechat" ? "生成二维码…" : "微信扫码支付"}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-lg border border-gold-200 bg-gold-50 px-3 py-2.5">
                  <p className="text-xs leading-relaxed text-text-secondary">{error}</p>
                  {mockMode && (
                    <button onClick={simulatePay} disabled={!!paying} className="yc-btn-secondary mt-2 w-full justify-center py-2 text-xs">
                      <RefreshCw className="h-3.5 w-3.5" /> 模拟支付成功（测试模式，非真实收款）
                    </button>
                  )}
                </div>
              )}
              {simulateResult && <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800">{simulateResult}（测试模式）</p>}
              <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
                支付由支付宝/微信支付提供，付款状态以渠道异步通知与服务端查单为准。退款与开票规则见《服务条款》。
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
