// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mockElders, mockCareOrders, mockProviders, mockDashboardStats } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";
import {
  Users,
  Calendar,
  Bell,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Star,
  Clock,
  ChevronRight,
  FileText,
  CheckCircle2,
} from "lucide-react";

const tabs = ["概览", "订单", "人员", "风险"] as const;

const careLevelLabels: Record<string, string> = {
  independent: "自理",
  semi_dependent: "半自理",
  dependent: "失能",
  critical: "危重",
};
const careLevelColors: Record<string, string> = {
  independent: "bg-green-50 text-green-700",
  semi_dependent: "bg-brand-50 text-brand-700",
  dependent: "bg-gold-50 text-gold-700",
  critical: "bg-red-50 text-red-700",
};
const orderStatusLabels: Record<string, string> = {
  pending: "待确认",
  confirmed: "已确认",
  in_progress: "进行中",
  completed: "已完成",
  cancelled: "已取消",
};
const orderStatusColors: Record<string, string> = {
  pending: "bg-gold-50 text-gold-700",
  confirmed: "bg-blue-50 text-blue-700",
  in_progress: "bg-brand-50 text-brand-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-silver-100 text-silver-600",
};
const providerStatusLabels: Record<string, string> = {
  available: "空闲",
  on_duty: "在岗",
  off_duty: "休息",
  leave: "请假",
};
const providerStatusColors: Record<string, string> = {
  available: "bg-green-50 text-green-700",
  on_duty: "bg-brand-50 text-brand-700",
  off_duty: "bg-silver-100 text-silver-600",
  leave: "bg-gold-50 text-gold-700",
};

export default function CareCrmPage() {
  const elders = mockElders ?? [];
  const orders = mockCareOrders ?? [];
  const providers = mockProviders ?? [];
  const stats = mockDashboardStats ?? {};
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("概览");

  const todayOrders = orders.filter((o) => o.status === "in_progress" || o.status === "confirmed");
  const pendingNotify = orders.filter((o) => !o.familyNotified);
  const riskOrders = orders.filter((o) => (o.riskEvents?.length ?? 0) > 0);

  const statCards = [
    { label: "今日订单", value: todayOrders.length, icon: ShoppingCart, color: "text-brand-600 bg-brand-50" },
    { label: "服务人员", value: providers.length, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "待通知家属", value: pendingNotify.length, icon: Bell, color: "text-gold-600 bg-gold-50" },
    { label: "待复诊提醒", value: 3, icon: Calendar, color: "text-purple-600 bg-purple-50" },
    { label: "风险事件", value: riskOrders.length, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "本月营收", value: `¥${(stats.revenueThisMonth ?? 0).toLocaleString()}`, icon: TrendingUp, color: "text-success bg-green-50" },
  ];

  return (
    <>
      <Header />

      {/* Header */}
      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="yc-badge yc-badge-gold">CRM</span>
              <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">
                陪诊护理服务 CRM
              </h1>
            </div>
            <button className="yc-btn-primary text-sm">
              <FileText className="h-4 w-4" /> AI 生成服务报告
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface py-6 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map((card) => (
              <div key={card.label} className="yc-card !p-4 text-center">
                <div className={cn("mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg", card.color)}>
                  <card.icon className="h-4 w-4" />
                </div>
                <p className="text-lg font-bold text-text-primary">{card.value}</p>
                <p className="text-xs text-text-muted">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "border-b-2 py-3 text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-text-muted hover:text-text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeTab === "概览" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="yc-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-text-primary">老人客户列表</h3>
                  <Link href="/elders" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                    查看全部 <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {elders.slice(0, 8).map((elder: any) => (
                    <Link key={elder.id} href={`/elders/${elder.id}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-silver-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                          {elder.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{elder.name}</p>
                          <p className="text-xs text-text-muted">{elder.city} · {elder.updatedAt}</p>
                        </div>
                      </div>
                      <span className={cn("yc-badge text-xs", careLevelColors[elder.careLevel])}>
                        {careLevelLabels[elder.careLevel]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="yc-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-text-primary">今日服务订单</h3>
                  <Link href="/care-orders" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                    查看全部 <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {(todayOrders.length > 0 ? todayOrders : orders.slice(0, 5)).map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{order.elderlyName}</p>
                        <p className="text-xs text-text-muted">{order.orderNo} · {order.caregiverName ?? "待分配"}</p>
                      </div>
                      <span className={cn("yc-badge text-xs", orderStatusColors[order.status])}>
                        {orderStatusLabels[order.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4">待通知家属</h3>
                {pendingNotify.length > 0 ? (
                  <div className="space-y-2">
                    {pendingNotify.map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-lg border border-gold-200 bg-gold-50/30 p-3">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{order.elderlyName}</p>
                          <p className="text-xs text-text-muted">{order.notes ?? "服务完成后通知家属"}</p>
                        </div>
                        <Bell className="h-4 w-4 text-gold-600" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted text-center py-6">暂无待通知家属</p>
                )}
              </div>

              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4">风险事件</h3>
                {riskOrders.length > 0 ? (
                  <div className="space-y-2">
                    {riskOrders.map((order) =>
                      (order.riskEvents ?? []).map((re) => (
                        <div key={re.id} className="rounded-lg border border-red-200 bg-red-50/30 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-text-primary">{order.elderlyName}</p>
                            <span className={cn("yc-badge text-xs", re.severity === "high" ? "bg-red-100 text-red-700" : "bg-gold-50 text-gold-700")}>
                              {re.severity === "high" ? "高" : "中"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-text-secondary">{re.description}</p>
                          {re.resolution && <p className="mt-1 text-xs text-success">处理: {re.resolution}</p>}
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted text-center py-6">暂无风险事件</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "订单" && (
            <div className="yc-card">
              <h3 className="text-sm font-semibold text-text-primary mb-4">全部订单</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-text-muted">
                      <th className="pb-2 font-medium">订单号</th>
                      <th className="pb-2 font-medium">老人</th>
                      <th className="pb-2 font-medium">状态</th>
                      <th className="pb-2 font-medium">服务人员</th>
                      <th className="pb-2 font-medium">金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="py-2.5 text-text-primary">{o.orderNo}</td>
                        <td className="py-2.5 text-text-primary">{o.elderlyName}</td>
                        <td className="py-2.5"><span className={cn("yc-badge text-xs", orderStatusColors[o.status])}>{orderStatusLabels[o.status]}</span></td>
                        <td className="py-2.5 text-text-secondary">{o.caregiverName ?? "待分配"}</td>
                        <td className="py-2.5 text-text-primary">¥{o.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "人员" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((p: any) => (
                <div key={p.id} className="yc-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
                      {p.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{p.name}</p>
                      <span className={cn("yc-badge text-xs", providerStatusColors[p.status])}>
                        {providerStatusLabels[p.status]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-gold-500" fill="currentColor" /> {p.rating}
                    </span>
                    <span>{p.completedOrders} 单</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.specialties.slice(0, 3).map((s: string) => (
                      <span key={s} className="rounded bg-silver-50 px-1.5 py-0.5 text-xs text-text-muted">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "风险" && (
            <div className="yc-card">
              <h3 className="text-sm font-semibold text-text-primary mb-4">风险事件记录</h3>
              {riskOrders.length > 0 ? (
                <div className="space-y-3">
                  {riskOrders.map((order) =>
                    (order.riskEvents ?? []).map((re) => (
                      <div key={re.id} className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium text-text-primary">{order.elderlyName}</span>
                            <span className="mx-2 text-xs text-text-muted">{re.type}</span>
                          </div>
                          <span className={cn("yc-badge text-xs", re.severity === "high" ? "bg-red-100 text-red-700" : "bg-gold-50 text-gold-700")}>
                            {re.severity === "high" ? "高风险" : "中风险"}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{re.description}</p>
                        {re.resolution && (
                          <p className="mt-2 text-xs text-success flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {re.resolution}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-text-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {re.occurredAt.replace("T", " ")} · 处理人: {re.handledBy ?? "无"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-sm text-text-muted text-center py-8">暂无风险事件</p>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
