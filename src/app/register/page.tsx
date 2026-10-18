"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { PWD_MIN_HINT } from "@/lib/authz/pwd-hint";

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"code" | "password">("code");
  const [form, setForm] = useState({ email: "", password: "", name: "", code: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(false);

  const inputCls = "w-full min-h-12 rounded-lg border border-border bg-white px-4 text-base outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  async function sendCode() {
    setError(""); setNotice("");
    if (!form.email.trim()) { setError("请先输入邮箱"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.email, purpose: "login" }),
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
    setError("");
    if (!agree) { setError("请先阅读并同意服务条款与隐私政策"); return; }
    setBusy(true);
    try {
      if (mode === "code") {
        // 验证码即注册：验证通过自动创建账户并登录
        const r = await signIn("code", { identifier: form.email, code: form.code, redirect: false });
        if (r?.error) { setError("验证码不正确或已失效，请重新获取"); return; }
        setDone(true);
        fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "signup_success" }) }).catch(() => {});
        setTimeout(() => router.push("/onboarding"), 600);
        return;
      }
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) { setError(d.error || "注册失败，请稍后重试"); return; }
      setDone(true);
      fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "signup_success" }) }).catch(() => {});
      const r = await signIn("password", { identifier: form.email, password: form.password, redirect: false });
      if (!r?.error) setTimeout(() => router.push("/onboarding"), 600);
      else setTimeout(() => router.push("/login"), 900);
    } catch { setError("网络异常，请重试"); }
    finally { setBusy(false); }
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
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">创建账户</h1>
            <p className="mt-1.5 text-sm text-text-secondary">输入邮箱、填一个验证码即可注册登录，无需设置密码。</p>

            {done ? (
              <div className="mt-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
                <p className="mt-3 text-lg font-semibold text-text-primary">注册成功</p>
                <p className="mt-1 text-sm text-text-secondary">邮箱已验证，正在进入…</p>
              </div>
            ) : (
              <>
                <div className="mt-6 mb-5 grid grid-cols-2 gap-1 rounded-lg bg-surface-secondary p-1" role="tablist">
                  <button type="button" role="tab" aria-selected={mode === "code"} onClick={() => { setMode("code"); setError(""); }}
                    className={`min-h-10 rounded-md text-sm font-medium transition ${mode === "code" ? "bg-white text-brand-700 shadow-sm" : "text-text-secondary"}`}>
                    验证码注册（推荐）
                  </button>
                  <button type="button" role="tab" aria-selected={mode === "password"} onClick={() => { setMode("password"); setError(""); }}
                    className={`min-h-10 rounded-md text-sm font-medium transition ${mode === "password" ? "bg-white text-brand-700 shadow-sm" : "text-text-secondary"}`}>
                    邮箱 + 密码
                  </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-text-primary">邮箱 *</label>
                    <input id="reg-email" type="email" autoComplete="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="用于登录和接收通知" className={inputCls} />
                  </div>

                  {mode === "code" ? (
                    <div>
                      <label htmlFor="reg-code" className="mb-1.5 block text-sm font-medium text-text-primary">验证码 *</label>
                      <div className="flex gap-2">
                        <input id="reg-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={form.code}
                          onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, "") })}
                          placeholder="6 位验证码" className={`${inputCls} flex-1 tracking-widest`} />
                        <button type="button" onClick={sendCode} disabled={sending || countdown > 0}
                          className="min-h-12 shrink-0 rounded-lg border border-brand-300 px-4 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50">
                          {sending ? "发送中…" : countdown > 0 ? `${countdown}s` : "获取验证码"}
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs text-text-muted">{notice || "验证码 5 分钟内有效；未注册邮箱将自动创建账户"}</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="reg-pwd" className="mb-1.5 block text-sm font-medium text-text-primary">密码 *</label>
                        <input id="reg-pwd" type="password" autoComplete="new-password" required={mode === "password"} value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          aria-describedby="reg-pwd-hint" placeholder="设置登录密码" className={inputCls} />
                        <p id="reg-pwd-hint" className="mt-1.5 text-xs text-text-muted">{PWD_MIN_HINT}；建议使用密码管理器生成</p>
                      </div>
                      <div>
                        <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-text-primary">昵称 <span className="font-normal text-text-muted">（选填）</span></label>
                        <input id="reg-name" autoComplete="nickname" value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="怎么称呼您" className={inputCls} />
                      </div>
                    </>
                  )}

                  <label className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 rounded border-border accent-[#1d6f67]" />
                    <span>我已阅读并同意 <Link href="/terms" className="text-brand-700 hover:underline">服务条款</Link> 与 <Link href="/privacy" className="text-brand-700 hover:underline">隐私政策</Link></span>
                  </label>

                  {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#9c3a31]">{error}</p>}

                  <button type="submit" disabled={busy}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-base font-medium text-white transition hover:bg-brand-700 disabled:opacity-60">
                    {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                    {busy ? "创建中…" : mode === "code" ? "注册并登录" : "注册并登录"}
                  </button>
                </form>
              </>
            )}

            {!done && (
              <p className="mt-6 text-center text-sm text-text-secondary">
                已有账户？<Link href="/login" className="font-medium text-brand-700 hover:underline">直接登录</Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
