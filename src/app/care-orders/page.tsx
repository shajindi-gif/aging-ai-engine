// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mockCareOrders } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";
import { Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const orderStatusLabels: Record<string, string> = {
  pending: "待确认", confirmed: "已确认", in_progress: "进行中", completed: "已完成", cancelled: "已取消",
};
const orderStatusColors: Record<string, string> = {
  pending: "bg-gold-50 text-gold-700", confirmed: "bg-blue-50 text-blue-700",
  in_progress: "bg-brand-50 text-brand-700", completed: "bg-green-50 text-green-700", cancelled: "bg-silver-100 text-silver-600",
};
const typeLabels: Record<string, string> = {
  escort: "陪诊", nursing: "护理", rehabilitation: "康复", companion: "陪伴",
  bathing: "助浴", meal: "助餐", cleaning: "清洁",
};
const typeFilters = ["全部", "陪诊", "护理", "康复", "陪伴", "助浴"];
const PER_PAGE = 20;

export default function CareOrdersPage() {
  const orders = mockCareOrders ?? [];
  const [typeFilter, setTypeFilter] = useState("全部");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (typeFilter === "全部") return orders;
    const typeMap: Record<string, string> = { "陪诊": "escort", "护理": "nursing", "康复": "rehabilitation", "陪伴": "companion", "助浴": "bathing" };
    return orders.filter((o) => o.serviceType === typeMap[typeFilter]);
  }, [orders, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const inProgress = orders.filter((o) => o.status === "in_progress").length;
  const completed = orders.filter((o) => o.status === "completed").length;

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
              <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                className={cn("whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors",
                  typeFilter === t ? "border-brand-600 text-brand-600" : "border-transparent text-text-muted hover:text-text-primary"
                )}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                {paged.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-silver-50/50">
                    <td className="px-4 py-3 text-text-primary font-medium">{o.orderNo}</td>
                    <td className="px-4 py-3 text-text-primary">{o.elderlyName}</td>
                    <td className="px-4 py-3 text-text-secondary">{typeLabels[o.type] ?? o.serviceType}</td>
                    <td className="px-4 py-3"><span className={cn("yc-badge text-xs", orderStatusColors[o.status])}>{orderStatusLabels[o.status]}</span></td>
                    <td className="px-4 py-3 text-text-muted text-xs">{o.scheduledAt.replace("T", " ")}</td>
                    <td className="px-4 py-3 text-text-secondary">{o.caregiverName ?? "待分配"}</td>
                    <td className="px-4 py-3 text-text-primary">¥{o.price}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs", o.familyNotified ? "text-success" : "text-gold-600")}>
                        {o.familyNotified ? "已通知" : "未通知"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        </div>
      </section>

      <Footer />
    </>
  );
}
