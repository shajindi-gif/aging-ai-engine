"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = (() => {
    const c = params.get("callbackUrl") || "/dashboard";
    return c.startsWith("/") && !c.startsWith("//") ? c : "/dashboard"; // 防开放重定向
  })();

  const [mode, setMode] = useState<"code" | "password">(params.get("mode") === "password" ? "password" : "code");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function sendCode() {
    setError(""); setNotice("");
    if (!identifier.trim()) { setError("请先输入手机号或邮箱"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, purpose: "login" }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) {
        setNotice(d.message || "验证码已发送");
        setCountdown(60);
        const t = setInterval(() => setCountdown((c) => { if (c <= 1) clearInterval(t); return c - 1; }), 1000);
      } else setError(d.error || "发送失败，请稍后重试");
    } catch { setError("网络异常，请重试"); }
    finally { setSending(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const r = mode === "code"
        ? await signIn("code", { identifier, code, redirect: false })
        : await signIn("password", { identifier, password, redirect: false });
      if (r?.error) {
        setError(mode === "code" ? "验证码不正确或已失效" : "账号或密码错误");
      } else {
        router.push(callbackUrl); router.refresh();
      }
    } finally { setSubmitting(false); }
  }

  const inputCls = "w-full min-h-12 rounded-lg border border-border bg-white px-4 text-base outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

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
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">欢迎回来</h1>
            <p className="mt-1.5 text-sm text-text-secondary">登录以继续使用养老政策查询与照护管理服务</p>

            <div className="mt-6 grid grid-cols-2 rounded-lg bg-silver-100 p-1" role="tablist" aria-label="登录方式">
              {(["code", "password"] as const).map((m) => (
                <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setError(""); }}
                  className={`min-h-10 rounded-md text-sm font-medium transition ${mode === m ? "bg-white text-text-primary shadow-sm" : "text-text-secondary"}`}>
                  {m === "code" ? "验证码登录" : "密码登录"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="login-id" className="mb-1.5 block text-sm font-medium text-text-primary">手机号或邮箱</label>
                <input id="login-id" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="如 13800138000 或 you@example.com" className={inputCls} required />
              </div>

              {mode === "code" ? (
                <div>
                  <label htmlFor="login-code" className="mb-1.5 block text-sm font-medium text-text-primary">验证码</label>
                  <div className="flex gap-2">
                    <input id="login-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="6 位验证码"
                      className={`${inputCls} flex-1 tracking-widest`} required />
                    <button type="button" onClick={sendCode} disabled={sending || countdown > 0}
                      className="min-h-12 shrink-0 rounded-lg border border-brand-300 px-4 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50">
                      {sending ? "发送中…" : countdown > 0 ? `${countdown}s` : "获取验证码"}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-text-muted">验证码 5 分钟内有效；未注册的手机号验证后可直接登录</p>
                </div>
              ) : (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="login-pwd" className="block text-sm font-medium text-text-primary">密码</label>
                    <Link href="/login/forgot" className="text-sm text-brand-700 hover:underline">忘记密码？</Link>
                  </div>
                  <input id="login-pwd" type="password" autoComplete="current-password" value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="输入密码" className={inputCls} required />
                </div>
              )}

              {notice && <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">{notice}</p>}
              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#9c3a31]">{error}</p>}

              <button type="submit" disabled={submitting}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-base font-medium text-white transition hover:bg-brand-700 active:translate-y-px disabled:opacity-60">
                {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                {submitting ? "登录中…" : "登录"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              还没有账户？<Link href="/register" className="font-medium text-brand-700 hover:underline">注册</Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-text-muted">
            登录即代表同意 <Link href="/terms" className="underline hover:text-brand-700">服务条款</Link> 与 <Link href="/privacy" className="underline hover:text-brand-700">隐私政策</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginContent /></Suspense>;
}
