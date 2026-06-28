// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit3,
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils";
import { mockCareOrders } from "@/lib/mock";
import type { CareOrder } from "@/lib/types";

const typeTabs = [
  { value: "", label: "全部订单" },
  { value: "escort", label: "陪诊" },
  { value: "nursing", label: "护理" },
  { value: "rehabilitation", label: "康复" },
  { value: "companion", label: "陪伴" },
];

const typeLabel: Record<string, string> = {
  escort: "陪诊",
  nursing: "护理",
  rehabilitation: "康复",
  companion: "陪伴",
  bathing: "助浴",
  meal: "助餐",
  cleaning: "清洁",
};

const statusBadge: Record<string, string> = {
  pending: "yc-badge-warning",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  in_progress: "yc-badge-brand",
  completed: "yc-badge-success",
  cancelled: "yc-badge-danger",
};

const statusLabel: Record<string, string> = {
  pending: "待确认",
  confirmed: "已确认",
  in_progress: "服务中",
  completed: "已完成",
  cancelled: "已取消",
};

export default function CareCRMPage() {
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<CareOrder | null>(null);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      todayOrders: mockCareOrders.filter((o) => o.scheduledAt.slice(0, 10) === today || o.status === "in_progress").length || 3,
      weekCompleted: mockCareOrders.filter((o) => o.status === "completed").length,
      pending: mockCareOrders.filter((o) => o.status === "pending").length,
      inProgress: mockCareOrders.filter((o) => o.status === "in_progress").length,
    };
  }, []);

  const filtered = useMemo(() => {
    return mockCareOrders.filter((o) => {
      if (tab && o.type !== tab) return false;
      if (search && !o.elderlyName.includes(search) && !o.orderNo.includes(search))
        return false;
      return true;
    });
  }, [tab, search]);

  const statCards = [
    { label: "今日订单", value: stats.todayOrders, color: "bg-brand-50 text-brand-700" },
    { label: "本周完成", value: stats.weekCompleted, color: "bg-green-50 text-green-700" },
    { label: "待确认", value: stats.pending, color: "bg-gold-50 text-gold-700" },
    { label: "服务中", value: stats.inProgress, color: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">陪诊护理 CRM</h1>
          <p className="text-sm text-text-muted mt-1">管理所有陪诊、护理、康复和陪伴服务订单</p>
        </div>
        <button className="yc-btn-primary">
          <Plus className="w-4 h-4" />
          新建订单
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="yc-card flex items-center justify-between">
            <span className="text-sm text-text-secondary">{s.label}</span>
            <span className={cn("text-2xl font-bold px-3 py-1 rounded-lg", s.color)}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {typeTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t.value
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-text-muted hover:text-text-secondary"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search / Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索订单号或老人姓名..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      {/* Orders Table */}
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
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-silver-50">
                <td className="py-3 px-4 font-mono text-xs text-text-secondary">{order.orderNo}</td>
                <td className="py-3 px-4 font-medium text-text-primary">{order.elderlyName}</td>
                <td className="py-3 px-4 text-text-secondary">{typeLabel[order.type] ?? order.serviceType}</td>
                <td className="py-3 px-4">
                  <span className={cn("yc-badge", statusBadge[order.status])}>
                    {statusLabel[order.status]}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-muted text-xs flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {formatDate(order.scheduledAt)}
                </td>
                <td className="py-3 px-4 text-text-secondary">{order.caregiverName ?? "-"}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded hover:bg-silver-100 text-text-muted hover:text-brand-600 transition-colors"
                      title="查看"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-silver-100 text-text-muted hover:text-blue-600 transition-colors"
                      title="编辑"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {order.status === "in_progress" && (
                      <button
                        className="p-1.5 rounded hover:bg-silver-100 text-text-muted hover:text-success transition-colors"
                        title="完成"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
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

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-lg bg-surface h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-text-primary">订单详情</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-silver-100 transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="p-4 space-y-5">
              {/* Order Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">订单号</span>
                  <span className="font-mono text-sm font-medium">{selectedOrder.orderNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">状态</span>
                  <span className={cn("yc-badge", statusBadge[selectedOrder.status])}>
                    {statusLabel[selectedOrder.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">服务类型</span>
                  <span className="text-sm font-medium">{typeLabel[selectedOrder.type]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">费用</span>
                  <span className="text-sm font-semibold text-gold-600">¥{selectedOrder.price}</span>
                </div>
              </div>

              {/* Elderly Info */}
              <div className="p-3 rounded-lg bg-surface-secondary border border-border space-y-2">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-600" />
                  老人信息
                </h3>
                <p className="text-sm text-text-secondary">{selectedOrder.elderlyName}</p>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedOrder.location}
                </p>
              </div>

              {/* Service Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  服务详情
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-text-muted">预约时间</p>
                    <p className="text-text-secondary">{formatDate(selectedOrder.scheduledAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">服务人员</p>
                    <p className="text-text-secondary">{selectedOrder.caregiverName ?? "待分配"}</p>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-2">
                    <p className="text-xs text-text-muted mb-1">备注</p>
                    <p className="text-sm text-text-secondary">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Risk Events */}
              {selectedOrder.riskEvents.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                    风险事件
                  </h3>
                  {(selectedOrder.riskEvents ?? []).map((re) => (
                    <div key={re.id} className="p-3 rounded-lg border border-red-200 bg-red-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="yc-badge yc-badge-danger text-xs">{re.severity === "high" ? "高危" : re.severity === "medium" ? "中等" : "低"}</span>
                        <span className="text-xs text-text-muted">{formatDate(re.occurredAt)}</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-1">{re.description}</p>
                      {re.resolution && (
                        <p className="text-xs text-success">处理：{re.resolution}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Service Report */}
              {selectedOrder.serviceReport && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-600" />
                    服务报告
                  </h3>
                  <div className="p-3 rounded-lg bg-surface-secondary border border-border space-y-2">
                    <p className="text-sm text-text-secondary">{selectedOrder.serviceReport.summary}</p>
                    {selectedOrder.serviceReport.healthObservations.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-text-muted mb-1">健康观察</p>
                        <ul className="space-y-0.5">
                          {selectedOrder.serviceReport.healthObservations.map((o: any, i: number) => (
                            <li key={i} className="text-xs text-text-secondary flex items-start gap-1">
                              <span className="text-brand-600 mt-1">-</span> {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedOrder.serviceReport.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-text-muted mb-1">建议</p>
                        <ul className="space-y-0.5">
                          {selectedOrder.serviceReport.recommendations.map((r: any, i: number) => (
                            <li key={i} className="text-xs text-text-secondary flex items-start gap-1">
                              <span className="text-gold-600 mt-1">-</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-xs text-text-muted pt-1">
                      提交人：{selectedOrder.serviceReport.submittedBy} | {formatDate(selectedOrder.serviceReport.submittedAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Family Notification */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border">
                <span className="text-sm text-text-secondary flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-brand-600" />
                  家属通知
                </span>
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
