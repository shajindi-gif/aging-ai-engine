"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(params.get("email") || "");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const inputCls = "w-full min-h-12 rounded-lg border border-border bg-white px-4 text-base outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  async function send() {
    setError(""); setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, purpose: "email_verify" }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) { setCountdown(60); const t = setInterval(() => setCountdown((c) => { if (c <= 1) clearInterval(t); return c - 1; }), 1000); }
      else setError(d.error || "发送失败");
    } catch { setError("网络异常"); } finally { setSending(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) { setDone(true); setTimeout(() => router.push("/account/settings"), 1200); }
      else setError(d.error || "验证失败");
    } catch { setError("网络异常"); } finally { setBusy(false); }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-secondary">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white">龄</span>
          <span className="text-lg font-semibold text-text-primary">衍策银龄</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">验证邮箱</h1>
          <p className="mt-1.5 text-sm text-text-secondary">验证后可用于找回密码与接收重要通知</p>
          {done ? (
            <div className="mt-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
              <p className="mt-3 text-lg font-semibold">验证成功，正在跳转…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="ve-email" className="mb-1.5 block text-sm font-medium text-text-primary">邮箱</label>
                <input id="ve-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
              </div>
              <div>
                <label htmlFor="ve-code" className="mb-1.5 block text-sm font-medium text-text-primary">验证码</label>
                <div className="flex gap-2">
                  <input id="ve-code" inputMode="numeric" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className={`${inputCls} flex-1 tracking-widest`} placeholder="6 位验证码" autoComplete="one-time-code" />
                  <button type="button" onClick={send} disabled={sending || countdown > 0 || !email} className="min-h-12 shrink-0 rounded-lg border border-brand-300 px-4 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50">
                    {sending ? "发送中…" : countdown > 0 ? `${countdown}s` : "获取验证码"}
                  </button>
                </div>
              </div>
              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#9c3a31]">{error}</p>}
              <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-base font-medium text-white hover:bg-brand-700 disabled:opacity-60">
                {busy && <Loader2 className="h-5 w-5 animate-spin" />}完成验证
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() { return <Suspense fallback={null}><VerifyContent /></Suspense>; }
