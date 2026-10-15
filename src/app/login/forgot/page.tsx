"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PWD_MIN_HINT } from "@/lib/authz/pwd-hint";

function ForgotContent() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const inputCls = "w-full min-h-12 rounded-lg border border-border bg-white px-4 text-base outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  async function sendCode() {
    setError(""); setNotice("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, purpose: "password_reset" }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) {
        setNotice(d.message || "验证码已发送"); setStep(2);
        setCountdown(60);
        const t = setInterval(() => setCountdown((c) => { if (c <= 1) clearInterval(t); return c - 1; }), 1000);
      } else setError(d.error || "发送失败");
    } catch { setError("网络异常"); } finally { setBusy(false); }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code, newPassword: pwd }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) {
        fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "password_reset_success" }) }).catch(() => {});
        router.push("/login?mode=password");
      } else setError(d.error || "重置失败");
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
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">重置密码</h1>
            <p className="mt-1.5 text-sm text-text-secondary">{step === 1 ? "输入注册时使用的邮箱或手机号" : "验证码已发送，请查收并设置新密码"}</p>

            {step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); sendCode(); }} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="fp-id" className="mb-1.5 block text-sm font-medium text-text-primary">邮箱或手机号</label>
                  <input id="fp-id" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputCls} placeholder="用于接收验证码" autoComplete="username" />
                </div>
                {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#9c3a31]">{error}</p>}
                <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-base font-medium text-white hover:bg-brand-700 disabled:opacity-60">
                  {busy && <Loader2 className="h-5 w-5 animate-spin" />}发送验证码
                </button>
              </form>
            ) : (
              <form onSubmit={reset} className="mt-6 space-y-4">
                {notice && <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">{notice}</p>}
                <div>
                  <label htmlFor="fp-code" className="mb-1.5 block text-sm font-medium text-text-primary">验证码</label>
                  <div className="flex gap-2">
                    <input id="fp-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className={`${inputCls} flex-1 tracking-widest`} placeholder="6 位验证码" />
                    <button type="button" onClick={sendCode} disabled={countdown > 0 || busy}
                      className="min-h-12 shrink-0 rounded-lg border border-brand-300 px-4 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50">
                      {countdown > 0 ? `${countdown}s` : "重新发送"}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="fp-pwd" className="mb-1.5 block text-sm font-medium text-text-primary">新密码</label>
                  <input id="fp-pwd" type="password" autoComplete="new-password" required value={pwd} onChange={(e) => setPwd(e.target.value)} className={inputCls} />
                  <p className="mt-1.5 text-xs text-text-muted">{PWD_MIN_HINT}</p>
                </div>
                {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#9c3a31]">{error}</p>}
                <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-base font-medium text-white hover:bg-brand-700 disabled:opacity-60">
                  {busy && <Loader2 className="h-5 w-5 animate-spin" />}重置密码
                </button>
              </form>
            )}
            <p className="mt-6 text-center text-sm"><Link href="/login" className="text-brand-700 hover:underline">返回登录</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ForgotPage() { return <Suspense fallback={null}><ForgotContent /></Suspense>; }
