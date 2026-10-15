"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Loader2, ShieldCheck, LogOut, CreditCard, UserRound, Lock } from "lucide-react";

type Tab = "profile" | "security" | "billing";

const EVENT_LABEL: Record<string, string> = {
  login_success: "登录成功", login_failed: "登录失败", password_reset: "密码变更", logout_all: "退出所有设备",
};

const inputCls = "w-full min-h-11 rounded-lg border border-border bg-white px-3.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // profile
  const [name, setName] = useState("");
  // security ops
  const [bindTarget, setBindTarget] = useState("");
  const [bindCode, setBindCode] = useState("");
  const [bindBusy, setBindBusy] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const load = useCallback(() => {
    fetch("/api/account/security", { cache: "no-store" })
      .then((r) => (r.status === 401 ? null : r.json()))
      .then((d) => {
        if (!d) { router.push("/login?callbackUrl=/account/settings"); return; }
        setData(d.data);
        setName(d.data.profile?.name || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function post(url: string, body: Record<string, unknown>, okText: string) {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) {
        setMsg({ type: "ok", text: d.message || okText });
        if (d.reauthRequired) { setTimeout(() => signOut({ callbackUrl: "/login" }), 1500); }
        else load();
        return true;
      }
      setMsg({ type: "err", text: d.error || "操作失败" });
      return false;
    } catch { setMsg({ type: "err", text: "网络异常" }); return false; }
    finally { setBusy(false); }
  }

  async function sendBindCode() {
    setMsg(null);
    const res = await fetch("/api/auth/send-code", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: bindTarget, purpose: bindTarget.includes("@") ? "email_verify" : "phone_verify" }),
    });
    const d = await res.json().catch(() => ({}));
    setMsg(d.success ? { type: "ok", text: d.message } : { type: "err", text: d.error || "发送失败" });
  }

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "profile", label: "基本资料", icon: UserRound },
    { key: "security", label: "账户安全", icon: Lock },
    { key: "billing", label: "订单与会员", icon: CreditCard },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">账户设置</h1>

          <div className="mt-6 flex gap-1 rounded-lg bg-silver-100 p-1 sm:w-fit" role="tablist">
            {TABS.map((t) => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
                className={`flex min-h-10 items-center gap-1.5 rounded-md px-4 text-sm font-medium transition ${tab === t.key ? "bg-white text-text-primary shadow-sm" : "text-text-secondary"}`}>
                <t.icon className="h-4 w-4" aria-hidden="true" />{t.label}
              </button>
            ))}
          </div>

          {msg && <p className={`mt-4 rounded-lg px-4 py-2.5 text-sm ${msg.type === "ok" ? "bg-brand-50 text-brand-800" : "bg-red-50 text-[#9c3a31]"}`} role="status">{msg.text}</p>}

          {loading || !data ? (
            <p className="mt-8 flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="h-4 w-4 animate-spin" />加载中…</p>
          ) : (
            <div className="mt-6 space-y-6">
              {/* ── 基本资料 ── */}
              {tab === "profile" && (
                <section className="rounded-2xl border border-border bg-white p-6">
                  <h2 className="text-base font-bold text-text-primary">基本资料</h2>
                  <dl className="mt-4 space-y-1 text-sm text-text-secondary">
                    <div className="flex justify-between py-1.5"><dt className="text-text-muted">注册时间</dt><dd>{new Date(data.profile.createdAt).toLocaleDateString("zh-CN")}</dd></div>
                    <div className="flex justify-between py-1.5"><dt className="text-text-muted">上次登录</dt><dd>{data.profile.lastLoginAt ? new Date(data.profile.lastLoginAt).toLocaleString("zh-CN") : "—"}</dd></div>
                  </dl>
                  <label className="mt-4 block text-sm font-medium text-text-primary">昵称</label>
                  <input className={`${inputCls} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} placeholder="怎么称呼您" maxLength={50} />
                  <button onClick={() => post("/api/account/profile", { name }, "已保存")} disabled={busy} className="yc-btn-primary mt-4 min-h-11 disabled:opacity-60">保存</button>
                </section>
              )}

              {/* ── 账户安全 ── */}
              {tab === "security" && (
                <>
                  <section className="rounded-2xl border border-border bg-white p-6">
                    <h2 className="text-base font-bold text-text-primary">已绑定的登录方式</h2>
                    <ul className="mt-4 space-y-2">
                      {data.identities.map((i: any, idx: number) => (
                        <li key={idx} className="flex items-center justify-between rounded-lg bg-silver-50 px-4 py-3 text-sm">
                          <span className="font-medium text-text-primary">{i.type === "email" ? "邮箱" : "手机号"} · {i.masked}</span>
                          <span className={i.verified ? "yc-badge yc-badge-success" : "yc-badge yc-badge-warning"}>{i.verified ? "已验证" : "未验证"}</span>
                        </li>
                      ))}
                      {data.identities.length === 0 && <li className="text-sm text-text-muted">尚未绑定（当前账户通过旧方式登录）</li>}
                    </ul>
                    {!data.emailVerified && data.identities.some((i: any) => i.type === "email" && !i.verified) && (
                      <Link href="/verify-email" className="mt-3 inline-block text-sm text-brand-700 hover:underline">去验证邮箱 →</Link>
                    )}
                    <div className="mt-5 border-t border-border pt-5">
                      <h3 className="text-sm font-semibold text-text-primary">绑定或更换</h3>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <input className={inputCls} placeholder="新邮箱或手机号" value={bindTarget} onChange={(e) => setBindTarget(e.target.value)} />
                        <button onClick={sendBindCode} disabled={!bindTarget} className="yc-btn-secondary min-h-11 shrink-0 disabled:opacity-50">获取验证码</button>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input className={`${inputCls} flex-1 tracking-widest`} inputMode="numeric" maxLength={6} placeholder="6 位验证码" value={bindCode} onChange={(e) => setBindCode(e.target.value.replace(/\D/g, ""))} />
                        <button onClick={() => post("/api/account/bind", { target: bindTarget, code: bindCode }, "绑定成功")} disabled={busy || !bindCode} className="yc-btn-primary min-h-11 shrink-0 disabled:opacity-50">确认绑定</button>
                      </div>
                      <p className="mt-2 text-xs text-text-muted">出于安全考虑，更换后所有设备需要重新登录；同一联系方式不能重复绑定多个账户。</p>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border bg-white p-6">
                    <h2 className="text-base font-bold text-text-primary">修改密码</h2>
                    <div className="mt-4 space-y-3">
                      <input type="password" autoComplete="current-password" className={inputCls} placeholder="原密码（未设过密码可留空，用验证码验证）" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
                      <input type="password" autoComplete="new-password" className={inputCls} placeholder="新密码（至少 15 个字符）" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                      <button onClick={() => post("/api/account/change-password", { oldPassword: oldPwd, newPassword: newPwd }, "密码已修改")} disabled={busy || !newPwd} className="yc-btn-primary min-h-11 disabled:opacity-60">修改密码</button>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border bg-white p-6">
                    <h2 className="text-base font-bold text-text-primary">登录记录</h2>
                    <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
                      {data.recentEvents.slice(0, 6).map((r: any, i: number) => (
                        <li key={i} className="flex justify-between border-b border-border py-2 last:border-0">
                          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-text-muted" aria-hidden="true" />{EVENT_LABEL[r.event] || r.event}</span>
                          <span className="text-xs text-text-muted">{new Date(r.at).toLocaleString("zh-CN")}</span>
                        </li>
                      ))}
                      {data.recentEvents.length === 0 && <li className="py-2 text-text-muted">暂无记录</li>}
                    </ul>
                    <button onClick={() => post("/api/account/logout-all", {}, "已退出所有设备")} disabled={busy} className="yc-btn-secondary mt-4 min-h-11 text-[#9c3a31]">
                      <LogOut className="h-4 w-4" aria-hidden="true" />退出所有设备
                    </button>
                  </section>
                </>
              )}

              {/* ── 订单与会员 ── */}
              {tab === "billing" && (
                <section className="rounded-2xl border border-border bg-white p-6">
                  <h2 className="text-base font-bold text-text-primary">订单与会员权益</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">订单记录、支付状态与会员权益有效期，请在「个人中心」查看。</p>
                  <Link href="/account" className="yc-btn-primary mt-4 inline-flex min-h-11 items-center">前往个人中心</Link>
                  <p className="mt-4 text-xs text-text-muted">退款与发票申请请通过<Link href="/contact" className="text-brand-700 hover:underline"> 联系我们 </Link>提交，工作日 1-2 个工作日内处理。</p>
                </section>
              )}

              {/* 注销入口 */}
              <section className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-base font-bold text-text-primary">注销账户</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  注销将删除您的账户与关联数据（订单与支付记录按法规要求保留必要期限）。该操作需要人工核实身份，请通过联系表单提交「注销账户」申请，注明注册邮箱/手机号。
                </p>
                <Link href="/contact" className="yc-btn-secondary mt-4 inline-flex min-h-11 items-center">提交注销申请</Link>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
