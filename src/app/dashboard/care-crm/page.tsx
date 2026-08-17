// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import {
  Plus, Search, Eye, Edit3, CheckCircle, X, Clock, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useApi } from "@/lib/hooks/use-api";
import { fetchCareOrders } from "@/lib/api";

const typeTabs = [
  { value: "", label: "全部订单" },
  { value: "ESCORT", label: "陪诊" },
  { value: "NURSING", label: "护理" },
  { value: "REHABILITATION", label: "康复" },
  { value: "COMPANION", label: "陪伴" },
];

const typeLabel: Record<string, string> = {
  escort: "陪诊", ESCORT: "陪诊", nursing: "护理", NURSING: "护理",
  rehabilitation: "康复", REHABILITATION: "康复", companion: "陪伴", COMPANION: "陪伴",
  bathing: "助浴", BATHING: "助浴", meal: "助餐", MEAL: "助餐", cleaning: "清洁", CLEANING: "清洁",
};

const statusBadge: Record<string, string> = {
  pending: "yc-badge-warning", PENDING: "yc-badge-warning",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200", CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-200",
  in_progress: "yc-badge-brand", IN_PROGRESS: "yc-badge-brand",
  completed: "yc-badge-success", COMPLETED: "yc-badge-success",
  cancelled: "yc-badge-danger", CANCELLED: "yc-badge-danger",
};

const statusLabel: Record<string, string> = {
  pending: "待确认", PENDING: "待确认", confirmed: "已确认", CONFIRMED: "已确认",
  in_progress: "服务中", IN_PROGRESS: "服务中", completed: "已完成", COMPLETED: "已完成",
  cancelled: "已取消", CANCELLED: "已取消",
};

function fmtDate(d: string | Date) {
  if (!d) return "-";
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

export default function CareCRMPage() {
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, loading, error } = useApi<any[]>(
    () => fetchCareOrders({
      serviceType: tab || undefined,
      pageSize: 100,
    }),
    [tab]
  );

  const items = orders ?? [];

  const filtered = useMemo(() => {
    if (!search) return items;
    return items.filter((o: any) =>
      (o.elderlyName ?? "").includes(search) || (o.orderNo ?? "").includes(search)
    );
  }, [items, search]);

  const stats = useMemo(() => ({
    pending: items.filter((o: any) => (o.status ?? "").toUpperCase() === "PENDING").length,
    inProgress: items.filter((o: any) => (o.status ?? "").toUpperCase() === "IN_PROGRESS").length,
    completed: items.filter((o: any) => (o.status ?? "").toUpperCase() === "COMPLETED").length,
    total: items.length,
  }), [items]);

  const statCards = [
    { label: "总订单", value: stats.total, color: "bg-brand-50 text-brand-700" },
    { label: "待确认", value: stats.pending, color: "bg-gold-50 text-gold-700" },
    { label: "服务中", value: stats.inProgress, color: "bg-blue-50 text-blue-700" },
    { label: "已完成", value: stats.completed, color: "bg-green-50 text-green-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">陪诊护理 CRM</h1>
          <p className="text-sm text-text-muted mt-1">管理所有陪诊、护理、康复和陪伴服务订单</p>
        </div>
        <button className="yc-btn-primary"><Plus className="w-4 h-4" /> 新建订单</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="yc-card flex items-center justify-between">
            <span className="text-sm text-text-secondary">{s.label}</span>
            <span className={cn("text-2xl font-bold px-3 py-1 rounded-lg", s.color)}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {typeTabs.map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={cn("px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t.value ? "border-brand-600 text-brand-700" : "border-transparent text-text-muted hover:text-text-secondary"
            )}>{t.label}</button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索订单号或老人姓名..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="yc-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left py-3 px-4 text-text-muted font-medium">订单号</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">老人姓名</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">服务类型</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">状态</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">预约时间</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">服务人员</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-silver-50">
                  <td className="py-3 px-4 font-mono text-xs text-text-secondary">{order.orderNo}</td>
                  <td className="py-3 px-4 font-medium text-text-primary">{order.elderlyName}</td>
                  <td className="py-3 px-4 text-text-secondary">{typeLabel[order.type] ?? order.type}</td>
                  <td className="py-3 px-4">
                    <span className={cn("yc-badge", statusBadge[order.status] ?? "yc-badge-warning")}>
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-muted text-xs flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 shrink-0" /> {fmtDate(order.scheduledAt)}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{order.caregiverName ?? "-"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded hover:bg-silver-100 text-text-muted hover:text-brand-600 transition-colors" title="查看">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-silver-100 text-text-muted hover:text-blue-600 transition-colors" title="编辑">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">未找到匹配的订单</p>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-lg bg-surface h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-text-primary">订单详情</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-silver-100 transition-colors">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="p-4 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">订单号</span>
                  <span className="font-mono text-sm font-medium">{selectedOrder.orderNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">状态</span>
                  <span className={cn("yc-badge", statusBadge[selectedOrder.status] ?? "yc-badge-warning")}>
                    {statusLabel[selectedOrder.status] ?? selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">服务类型</span>
                  <span className="text-sm font-medium">{typeLabel[selectedOrder.type] ?? selectedOrder.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">费用</span>
                  <span className="text-sm font-semibold text-gold-600">¥{selectedOrder.price ?? 0}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-secondary border border-border space-y-2">
                <p className="text-sm font-semibold text-text-primary">{selectedOrder.elderlyName}</p>
                <p className="text-xs text-text-muted">{selectedOrder.location ?? "-"}</p>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-xs text-text-muted">预约时间</p><p className="text-text-secondary">{fmtDate(selectedOrder.scheduledAt)}</p></div>
                  <div><p className="text-xs text-text-muted">服务人员</p><p className="text-text-secondary">{selectedOrder.caregiverName ?? "待分配"}</p></div>
                </div>
                {selectedOrder.notes && <p className="text-sm text-text-secondary mt-2">{selectedOrder.notes}</p>}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border">
                <span className="text-sm text-text-secondary">家属通知</span>
                <span className={cn("yc-badge text-xs", selectedOrder.familyNotified ? "yc-badge-success" : "yc-badge-warning")}>
                  {selectedOrder.familyNotified ? "已通知" : "未通知"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
