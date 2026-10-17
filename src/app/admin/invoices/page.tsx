"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";

const INV_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "待开具", cls: "yc-badge yc-badge-warning" },
  ISSUED: { label: "已开具", cls: "yc-badge yc-badge-success" },
  REJECTED: { label: "已驳回", cls: "yc-badge yc-badge-danger" },
};

export default function AdminInvoicesPage() {
  const [list, setList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/invoices", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (d.success) { setList(d.data); setStats(d.stats); } else setErr(d.error || "加载失败"); })
      .catch(() => setErr("网络异常"))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function act(id: string, action: "ISSUE" | "REJECT", extra?: Record<string, string>) {
    setBusyId(id + action);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, ...extra }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) load();
      else alert(d.error || "操作失败");
    } finally { setBusyId(""); }
  }

  function doIssue(id: string) {
    const code = window.prompt("输入税务发票号码（开具后请通过邮件发送 PDF 给客户）");
    if (code && code.trim()) act(id, "ISSUE", { invoiceCode: code.trim() });
  }
  function doReject(id: string) {
    const reason = window.prompt("输入驳回原因");
    if (reason && reason.trim()) act(id, "REJECT", { rejectReason: reason.trim() });
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link href="/admin/ops" className="text-sm text-brand-700 hover:underline">← 返回运营后台</Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary">
            <FileText className="h-6 w-6 text-brand-600" aria-hidden="true" /> 发票申请管理
          </h1>
          <p className="mt-2 text-sm text-text-secondary">待开具 {stats.pending ?? 0} · 已开具 {stats.issued ?? 0}。操作记录写入审计日志。</p>

          {loading ? <p className="mt-8 flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="h-4 w-4 animate-spin" />加载中…</p> : err ? (
            <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{err}（需管理员登录）</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                    <th className="px-3 py-2 font-medium">申请单号</th>
                    <th className="px-3 py-2 font-medium">申请人</th>
                    <th className="px-3 py-2 font-medium">抬头/税号</th>
                    <th className="px-3 py-2 font-medium">金额</th>
                    <th className="px-3 py-2 font-medium">接收邮箱</th>
                    <th className="px-3 py-2 font-medium">状态</th>
                    <th className="px-3 py-2 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((i) => (
                    <tr key={i.id} className="border-b border-border last:border-0 align-top">
                      <td className="px-3 py-3 font-mono text-xs">{i.invoiceNo}<div className="mt-1 text-[11px] text-text-muted">{new Date(i.createdAt).toLocaleString("zh-CN")}</div></td>
                      <td className="px-3 py-3 text-xs">{i.applicant}</td>
                      <td className="px-3 py-3 text-xs">
                        <div className="font-medium text-text-primary">{i.title}</div>
                        <div className="text-text-muted">{i.titleType === "company" ? "企业" : "个人"}{i.taxNo ? ` · ${i.taxNo}` : ""}</div>
                        {i.remark && <div className="mt-1 text-[11px] text-text-muted">备注：{i.remark}</div>}
                      </td>
                      <td className="px-3 py-3">¥{(i.amountFen / 100).toFixed(2)}</td>
                      <td className="px-3 py-3 text-xs">{i.email}</td>
                      <td className="px-3 py-3">
                        <span className={INV_STATUS[i.status]?.cls}>{INV_STATUS[i.status]?.label || i.status}</span>
                        {i.invoiceCode && <div className="mt-1 text-[11px] text-text-muted">发票号 {i.invoiceCode}</div>}
                        {i.rejectReason && <div className="mt-1 text-[11px] text-[#9c3a31]">{i.rejectReason}</div>}
                      </td>
                      <td className="px-3 py-3">
                        {i.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <button onClick={() => doIssue(i.id)} disabled={!!busyId} className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50">
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />已开具
                            </button>
                            <button onClick={() => doReject(i.id)} disabled={!!busyId} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-[#9c3a31] hover:bg-red-50 disabled:opacity-50">
                              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />驳回
                            </button>
                          </div>
                        ) : <span className="text-xs text-text-muted">已处理</span>}
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-text-muted">暂无发票申请</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
