"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { PWD_MIN_HINT } from "@/lib/authz/pwd-hint";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const inputCls = "w-full min-h-12 rounded-lg border border-border bg-white px-4 text-base outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!agree) { setError("请先阅读并同意服务条款与隐私政策"); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) { setError(d.error || "注册失败，请稍后重试"); return; }
      setDone(true);
      fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "signup_success" }) }).catch(() => {});
      // 注册成功后自动登录并进入引导
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
            <p className="mt-1.5 text-sm text-text-secondary">只需邮箱，30 秒完成。姓名等信息可稍后补充。</p>

            {done ? (
              <div className="mt-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
                <p className="mt-3 text-lg font-semibold text-text-primary">注册成功</p>
                <p className="mt-1 text-sm text-text-secondary">正在进入…验证邮件已发送，可在账户设置中完成验证</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-text-primary">邮箱 *</label>
                  <input id="reg-email" type="email" autoComplete="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="用于登录和接收通知" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="reg-pwd" className="mb-1.5 block text-sm font-medium text-text-primary">密码 *</label>
                  <input id="reg-pwd" type="password" autoComplete="new-password" required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    aria-describedby="reg-pwd-hint" placeholder="设置登录密码" className={inputCls} />
                  <p id="reg-pwd-hint" className="mt-1.5 text-xs text-text-muted">{PWD_MIN_HINT}；建议使用密码管理器生成</p>
                </div>
                <div>
                  <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-text-primary">昵称 <span className="font-normal text-text-muted">（选填）</span></label>
                  <input id="reg-name" autoComplete="nickname" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="怎么称呼您" className={inputCls} />
                </div>

                <label className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-border accent-[#1d6f67]" />
                  <span>我已阅读并同意 <Link href="/terms" className="text-brand-700 hover:underline">服务条款</Link> 与 <Link href="/privacy" className="text-brand-700 hover:underline">隐私政策</Link></span>
                </label>

                {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#9c3a31]">{error}</p>}

                <button type="submit" disabled={busy}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-base font-medium text-white transition hover:bg-brand-700 disabled:opacity-60">
                  {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                  {busy ? "创建中…" : "注册并登录"}
                </button>
              </form>
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
