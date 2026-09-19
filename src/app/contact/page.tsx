// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Building2, Send, CheckCircle2, Calendar } from "lucide-react";

const productOptions = [
  "银发经济政策数据库",
  "陪诊护理服务 CRM",
  "养老机构销售线索库",
  "Agent 工作台",
  "MCP Server / SDK",
  "定制化开发",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", message: "",
    products: [] as string[], website: "", // website = honeypot, hidden from users
  });
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleProduct = (p: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(p) ? prev.products.filter((x) => x !== p) : [...prev.products, p],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("请先阅读并勾选同意《隐私政策》与《服务条款》");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          message: form.message,
          products: form.products,
          consent,
          source: "/contact",
          type: "DEMO",
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setSubmitted(true);
      } else {
        setError(data?.error || "提交失败，请稍后重试或通过电话/邮箱联系我们");
      }
    } catch {
      setError("网络异常，提交未成功，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">联系我们</span>
          <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">联系我们</h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            无论您是潜在客户、合作伙伴还是媒体，我们都乐意与您交流
          </p>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="yc-card text-center py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
                  <h2 className="mt-4 text-lg font-bold text-text-primary">提交成功</h2>
                  <p className="mt-2 text-text-secondary">我们会在 1-2 个工作日内与您联系</p>
                </div>
              ) : (
                <form id="inquiry-form" onSubmit={handleSubmit} className="yc-card space-y-5 scroll-mt-24">
                  <h2 className="text-lg font-semibold text-text-primary">发送消息</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">姓名 *</label>
                      <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">公司</label>
                      <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">邮箱 *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">电话</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">感兴趣的产品</label>
                    <div className="flex flex-wrap gap-2">
                      {productOptions.map((p) => (
                        <button key={p} type="button" onClick={() => toggleProduct(p)}
                          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                            form.products.includes(p)
                              ? "border-brand-400 bg-brand-50 text-brand-700"
                              : "border-border text-text-secondary hover:border-brand-200"
                          }`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">留言 *</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none resize-none" />
                  </div>
                  {/* honeypot — hidden from humans, deters bots */}
                  <input
                    type="text" name="website" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                    aria-hidden="true" className="hidden"
                    style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
                  />
                  <label className="flex items-start gap-2 text-sm text-text-secondary">
                    <input
                      type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-brand-600 focus:ring-brand-400"
                    />
                    <span>
                      我已阅读并同意
                      <a href="/privacy" className="text-brand-600 hover:underline">《隐私政策》</a>
                      与
                      <a href="/terms" className="text-brand-600 hover:underline">《服务条款》</a>
                      ，同意平台为响应本次咨询处理我提交的联系信息。
                    </span>
                  </label>
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="yc-btn-primary w-full justify-center disabled:opacity-60">
                    <Send className="h-4 w-4" /> {loading ? "提交中…" : "提交"}
                  </button>
                </form>
              )}
            </div>

            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4">公司信息</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">上海衍策引擎人工智能科技有限公司</p>
                      <p className="text-xs text-text-muted">Aging AI Engine</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-brand-500 shrink-0" />
                    <p className="text-sm text-text-secondary">contact@yanglaoai999.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-brand-500 shrink-0" />
                    <p className="text-sm text-text-secondary">上海市浦东新区</p>
                  </div>
                </div>
              </div>

              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-2">响应与处理时效</h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  通过本页表单或上述邮箱提交后，我们在工作日 1–2 个工作日内回复。涉及个人数据查询、更正或删除的请求，将在身份核实后按《隐私政策》处理。
                </p>
              </div>

              <div className="yc-card bg-brand-600 border-brand-600 text-white">
                <Calendar className="h-8 w-8 mb-3 text-brand-200" />
                <h3 className="text-lg font-bold">预约产品演示</h3>
                <p className="mt-2 text-sm text-brand-100">
                  填写上方表单并选择感兴趣的产品，我们会尽快与您联系安排一对一演示。
                </p>
                <a href="#inquiry-form" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
                  填写咨询表单 <Send className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
