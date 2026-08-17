// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils/cn";
import { Users, ClipboardList, TrendingUp, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { fetchElders, fetchCareOrders } from "@/lib/api";

const statusLabel: Record<string, string> = {
  pending: "待确认", PENDING: "待确认", confirmed: "已确认", CONFIRMED: "已确认",
  in_progress: "进行中", IN_PROGRESS: "进行中", completed: "已完成", COMPLETED: "已完成",
  cancelled: "已取消", CANCELLED: "已取消",
};
const statusColor: Record<string, string> = {
  pending: "bg-gold-50 text-gold-700", PENDING: "bg-gold-50 text-gold-700",
  confirmed: "bg-blue-50 text-blue-700", CONFIRMED: "bg-blue-50 text-blue-700",
  in_progress: "bg-brand-50 text-brand-700", IN_PROGRESS: "bg-brand-50 text-brand-700",
  completed: "bg-green-50 text-green-700", COMPLETED: "bg-green-50 text-green-700",
  cancelled: "bg-silver-100 text-silver-600", CANCELLED: "bg-silver-100 text-silver-600",
};

export default function CareCRMPage() {
  const { data: elders, loading: eldLoading } = useApi<any[]>(() => fetchElders({ pageSize: 50 }), []);
  const { data: orders, loading: ordLoading } = useApi<any[]>(() => fetchCareOrders({ pageSize: 100 }), []);

  const loading = eldLoading || ordLoading;
  const elderList = elders ?? [];
  const orderList = orders ?? [];

  const stats = useMemo(() => ({
    totalElders: elderList.length,
    totalOrders: orderList.length,
    activeOrders: orderList.filter((o: any) => ["CONFIRMED", "IN_PROGRESS"].includes((o.status ?? "").toUpperCase())).length,
    completedOrders: orderList.filter((o: any) => (o.status ?? "").toUpperCase() === "COMPLETED").length,
  }), [elderList, orderList]);

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <span className="yc-badge yc-badge-brand">CRM</span>
            <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">养老服务 CRM</h1>
            <p className="mt-2 text-text-secondary">老人档案与服务订单统一管理</p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-6 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-brand-600">{stats.totalElders}</p><p className="text-xs text-text-muted">老人总数</p></div>
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-text-primary">{stats.totalOrders}</p><p className="text-xs text-text-muted">总订单</p></div>
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-brand-600">{stats.activeOrders}</p><p className="text-xs text-text-muted">活跃订单</p></div>
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-success">{stats.completedOrders}</p><p className="text-xs text-text-muted">已完成</p></div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              <span className="ml-3 text-sm text-text-muted">加载数据...</span>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Elders */}
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-500" /> 最近添加的老人
                </h3>
                <div className="space-y-2">
                  {elderList.slice(0, 8).map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {e.name?.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{e.name}</p>
                          <p className="text-xs text-text-muted">{e.city ?? ""} {e.province ?? ""}</p>
                        </div>
                      </div>
                      <span className="text-xs text-text-muted">{e.careLevel}</span>
                    </div>
                  ))}
                  {elderList.length === 0 && <p className="text-sm text-text-muted py-4 text-center">暂无数据</p>}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-gold-500" /> 最近订单
                </h3>
                <div className="space-y-2">
                  {orderList.slice(0, 8).map((o: any) => (
                    <div key={o.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{o.elderlyName}</p>
                        <p className="text-xs text-text-muted">{o.orderNo}</p>
                      </div>
                      <span className={cn("yc-badge text-xs", statusColor[o.status] ?? "bg-silver-100")}>
                        {statusLabel[o.status] ?? o.status}
                      </span>
                    </div>
                  ))}
                  {orderList.length === 0 && <p className="text-sm text-text-muted py-4 text-center">暂无数据</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
