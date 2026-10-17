"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, Loader2, CheckCircle2 } from "lucide-react";

const INV_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "待开具", cls: "yc-badge yc-badge-warning" },
  ISSUED: { label: "已开具", cls: "yc-badge yc-badge-success" },
  REJECTED: { label: "已驳回", cls: "yc-badge yc-badge-danger" },
};

const inputCls = "w-full min-h-11 rounded-lg border border-border bg-white px-3.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function InvoicesPage() {
  const [account, setAccount] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState({ orderNo: "", titleType: "company", title: "", taxNo: "", email: "", remark: "" });

  const load = useCallback(async () => {
    const [acc, inv] = await Promise.all([
      fetch("/api/account/overview", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/invoice/mine", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
    if (acc?.success) setAccount(acc.data);
    if (inv?.success) setInvoices(inv.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // 已申请过发票的订单号集合
  const invoicedOrderNos = new Set(invoices.map((i) => i.orderNo));
  const payableOrders = (account?.orders || []).filter((o: any) => o.status === "PAID" && !invoicedOrderNos.has(o.orderNo));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/invoice/request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) {
        setMsg({ type: "ok", text: d.message });
        setForm({ ...form, title: "", taxNo: "", remark: "" });
        load();
      } else setMsg({ type: "err", text: d.error || "提交失败" });
    } catch { setMsg({ type: "err", text: "网络异常" }); }
    finally { setBusy(false); }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <Link href="/account" className="text-sm text-brand-700 hover:underline">← 返回个人中心</Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary">
            <FileText className="h-6 w-6 text-brand-600" aria-hidden="true" /> 发票管理
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            电子普通发票，付款后可在此申请。开具后 3-5 个工作日内发送至你填写的邮箱。
          </p>

          {msg && <p className={`mt-4 rounded-lg px-4 py-2.5 text-sm ${msg.type === "ok" ? "bg-brand-50 text-brand-800" : "bg-red-50 text-[#9c3a31]"}`} role="status">{msg.text}</p>}

          {loading ? (
            <p className="mt-8 flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="h-4 w-4 animate-spin" />加载中…</p>
          ) : (
            <>
              {/* 申请表单 */}
              <section className="mt-6 rounded-2xl border border-border bg-white p-6">
                <h2 className="text-base font-bold text-text-primary">申请开票</h2>
                {payableOrders.length === 0 ? (
                  <p className="mt-3 text-sm text-text-secondary">暂无可开票订单（需已支付且未申请过发票的订单）。<Link href="/pricing" className="text-brand-700 hover:underline">查看套餐 →</Link></p>
                ) : (
                  <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">选择订单 *</label>
                      <select value={form.orderNo} onChange={(e) => setForm({ ...form, orderNo: e.target.value })} className={inputCls} required>
                        <option value="">请选择已支付订单</option>
                        {payableOrders.map((o: any) => (
                          <option key={o.orderNo} value={o.orderNo}>
                            {o.orderNo} · {o.productName} · ¥{(o.amountFen / 100).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">抬头类型</label>
                      <div className="flex gap-2">
                        {[{ v: "company", l: "企业单位" }, { v: "personal", l: "个人/非企业" }].map((t) => (
                          <button key={t.v} type="button" onClick={() => setForm({ ...form, titleType: t.v })}
                            className={`min-h-10 flex-1 rounded-lg border text-sm font-medium transition ${form.titleType === t.v ? "border-brand-400 bg-brand-50 text-brand-700" : "border-border text-text-secondary"}`}>
                            {t.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">发票抬头 *</label>
                      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder={form.titleType === "company" ? "公司全称" : "个人姓名"} required maxLength={100} />
                    </div>
                    {form.titleType === "company" && (
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">纳税人识别号 *</label>
                        <input value={form.taxNo} onChange={(e) => setForm({ ...form, taxNo: e.target.value })} className={inputCls} placeholder="15-20 位税号" maxLength={40} required />
                      </div>
                    )}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">接收邮箱 *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="电子发票将发送到此邮箱" required />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">备注（选填）</label>
                      <input value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} className={inputCls} placeholder="如开票内容、其他要求" maxLength={200} />
                    </div>
                    <button type="submit" disabled={busy || !form.orderNo} className="yc-btn-primary w-full justify-center disabled:opacity-60">
                      {busy ? "提交中…" : "提交开票申请"}
                    </button>
                  </form>
                )}
              </section>

              {/* 我的申请 */}
              <section className="mt-6 rounded-2xl border border-border bg-white p-6">
                <h2 className="text-base font-bold text-text-primary">我的开票申请</h2>
                {invoices.length === 0 ? (
                  <p className="mt-3 text-sm text-text-secondary">暂无申请记录。</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {invoices.map((i) => (
                      <li key={i.invoiceNo} className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-text-muted">{i.invoiceNo}</span>
                          <span className={INV_STATUS[i.status]?.cls || "yc-badge"}>{INV_STATUS[i.status]?.label || i.status}</span>
                        </div>
                        <p className="mt-2 text-sm text-text-primary">
                          {i.title}（{i.titleType === "company" ? "企业" : "个人"}）· ¥{(i.amountFen / 100).toFixed(2)}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">订单 {i.orderNo} · 发送至 {i.email}</p>
                        {i.status === "ISSUED" && i.invoiceCode && (
                          <p className="mt-2 flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />已开具，发票号 {i.invoiceCode}（已/将发送至邮箱）</p>
                        )}
                        {i.status === "REJECTED" && i.rejectReason && <p className="mt-2 text-xs text-[#9c3a31]">驳回原因：{i.rejectReason}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
