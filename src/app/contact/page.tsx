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
    name: "", company: "", email: "", phone: "", message: "", products: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleProduct = (p: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(p) ? prev.products.filter((x) => x !== p) : [...prev.products, p],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                <form onSubmit={handleSubmit} className="yc-card space-y-5">
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
                  <button type="submit" className="yc-btn-primary w-full justify-center">
                    <Send className="h-4 w-4" /> 提交
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
                    <p className="text-sm text-text-secondary">contact@yance.ai</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-brand-500 shrink-0" />
                    <p className="text-sm text-text-secondary">021-8888-9999</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-brand-500 shrink-0" />
                    <p className="text-sm text-text-secondary">上海市浦东新区</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-silver-50 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-silver-300" />
                  <p className="mt-2 text-xs text-text-muted">地图占位</p>
                </div>
              </div>

              <div className="yc-card bg-brand-600 border-brand-600 text-white">
                <Calendar className="h-8 w-8 mb-3 text-brand-200" />
                <h3 className="text-lg font-bold">预约产品演示</h3>
                <p className="mt-2 text-sm text-brand-100">
                  预约一对一产品演示，了解衍策银龄 AI 如何帮助您的业务
                </p>
                <a href="mailto:demo@yance.ai" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
                  预约演示 <Mail className="h-4 w-4" />
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
