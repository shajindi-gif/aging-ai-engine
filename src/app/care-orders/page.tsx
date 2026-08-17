// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils/cn";
import { Plus, ChevronLeft, ChevronRight, Loader2, AlertCircle, FileText } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { fetchCareOrders } from "@/lib/api";

const orderStatusLabels: Record<string, string> = {
  pending: "待确认", PENDING: "待确认",
  confirmed: "已确认", CONFIRMED: "已确认",
  in_progress: "进行中", IN_PROGRESS: "进行中",
  completed: "已完成", COMPLETED: "已完成",
  cancelled: "已取消", CANCELLED: "已取消",
};
const orderStatusColors: Record<string, string> = {
  pending: "bg-gold-50 text-gold-700", PENDING: "bg-gold-50 text-gold-700",
  confirmed: "bg-blue-50 text-blue-700", CONFIRMED: "bg-blue-50 text-blue-700",
  in_progress: "bg-brand-50 text-brand-700", IN_PROGRESS: "bg-brand-50 text-brand-700",
  completed: "bg-green-50 text-green-700", COMPLETED: "bg-green-50 text-green-700",
  cancelled: "bg-silver-100 text-silver-600", CANCELLED: "bg-silver-100 text-silver-600",
};
const typeLabels: Record<string, string> = {
  escort: "陪诊", ESCORT: "陪诊",
  nursing: "护理", NURSING: "护理",
  rehabilitation: "康复", REHABILITATION: "康复",
  companion: "陪伴", COMPANION: "陪伴",
  bathing: "助浴", BATHING: "助浴",
  meal: "助餐", MEAL: "助餐",
  cleaning: "清洁", CLEANING: "清洁",
  medication_reminder: "用药提醒", MEDICATION_REMINDER: "用药提醒",
  followup: "随访", FOLLOWUP: "随访",
  post_surgery: "术后护理", POST_SURGERY: "术后护理",
};
const typeFilters = [
  { label: "全部", value: "all" },
  { label: "陪诊", value: "ESCORT" },
  { label: "护理", value: "NURSING" },
  { label: "康复", value: "REHABILITATION" },
  { label: "陪伴", value: "COMPANION" },
  { label: "助浴", value: "BATHING" },
];
const PER_PAGE = 20;

export default function CareOrdersPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: orders, loading, error, meta } = useApi<any[]>(
    () => fetchCareOrders({
      serviceType: typeFilter !== "all" ? typeFilter : undefined,
      page,
      pageSize: PER_PAGE,
    }),
    [typeFilter, page]
  );

  const items = orders ?? [];
  const total = meta?.total ?? items.length;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(total / PER_PAGE));

  // Compute stats from the returned data (or use meta if available)
  const pending = items.filter((o: any) => (o.status ?? "").toUpperCase() === "PENDING").length;
  const inProgress = items.filter((o: any) => (o.status ?? "").toUpperCase() === "IN_PROGRESS").length;
  const completed = items.filter((o: any) => (o.status ?? "").toUpperCase() === "COMPLETED").length;

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="yc-badge yc-badge-gold">订单管理</span>
              <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">陪诊护理订单</h1>
            </div>
            <button className="yc-btn-primary text-sm"><Plus className="h-4 w-4" /> 新建订单</button>
          </div>
        </div>
      </section>

      <section className="bg-surface py-4 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-text-primary">{total}</p><p className="text-xs text-text-muted">总订单</p></div>
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-gold-600">{pending}</p><p className="text-xs text-text-muted">待确认</p></div>
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-brand-600">{inProgress}</p><p className="text-xs text-text-muted">进行中</p></div>
            <div className="yc-card !p-3 text-center"><p className="text-xl font-bold text-success">{completed}</p><p className="text-xs text-text-muted">已完成</p></div>
          </div>
        </div>
      </section>

      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            {typeFilters.map((t) => (
              <button key={t.value} onClick={() => { setTypeFilter(t.value); setPage(1); }}
                className={cn("whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors",
                  typeFilter === t.value ? "border-brand-600 text-brand-600" : "border-transparent text-text-muted hover:text-text-primary"
                )}>{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              <span className="ml-3 text-sm text-text-muted">加载订单数据...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="yc-card !p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                      <th className="px-4 py-3 font-medium">订单号</th>
                      <th className="px-4 py-3 font-medium">老人</th>
                      <th className="px-4 py-3 font-medium">服务类型</th>
                      <th className="px-4 py-3 font-medium">状态</th>
                      <th className="px-4 py-3 font-medium">预约时间</th>
                      <th className="px-4 py-3 font-medium">服务人员</th>
                      <th className="px-4 py-3 font-medium">金额</th>
                      <th className="px-4 py-3 font-medium">家属通知</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((o: any) => {
                      const scheduled = o.scheduledAt ? new Date(o.scheduledAt) : null;
                      return (
                        <tr key={o.id} className="border-b border-border last:border-0 hover:bg-silver-50/50">
                          <td className="px-4 py-3 text-text-primary font-medium">{o.orderNo}</td>
                          <td className="px-4 py-3 text-text-primary">{o.elderlyName}</td>
                          <td className="px-4 py-3 text-text-secondary">{typeLabels[o.type] ?? typeLabels[o.serviceType] ?? o.type}</td>
                          <td className="px-4 py-3"><span className={cn("yc-badge text-xs", orderStatusColors[o.status] ?? "bg-silver-100")}>{orderStatusLabels[o.status] ?? o.status}</span></td>
                          <td className="px-4 py-3 text-text-muted text-xs">{scheduled ? scheduled.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                          <td className="px-4 py-3 text-text-secondary">{o.caregiverName ?? "待分配"}</td>
                          <td className="px-4 py-3 text-text-primary">¥{o.price ?? 0}</td>
                          <td className="px-4 py-3">
                            <span className={cn("text-xs", o.familyNotified ? "text-success" : "text-gold-600")}>
                              {o.familyNotified ? "已通知" : "未通知"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {items.length === 0 && (
                <div className="py-20 text-center text-text-muted">
                  <FileText className="mx-auto h-12 w-12 mb-4 text-silver-300" />
                  <p>暂无订单数据</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                    className="rounded-lg border border-border p-2 text-sm text-text-secondary hover:border-brand-300 disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-text-muted">{page} / {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                    className="rounded-lg border border-border p-2 text-sm text-text-secondary hover:border-brand-300 disabled:opacity-40">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
