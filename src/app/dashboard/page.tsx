// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import {
  Users,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Plus,
  UserPlus,
  BookOpen,
  FileBarChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDashboardStats, fetchCareOrders } from "@/lib/api";

const colorMap: Record<string, { bg: string; icon: string; trend: string }> = {
  brand: { bg: "bg-brand-50", icon: "text-brand-600", trend: "text-brand-600" },
  info: { bg: "bg-blue-50", icon: "text-blue-600", trend: "text-blue-600" },
  danger: { bg: "bg-red-50", icon: "text-red-600", trend: "text-red-600" },
  gold: { bg: "bg-gold-50", icon: "text-gold-600", trend: "text-gold-600" },
};

const statusBadge: Record<string, string> = {
  pending: "yc-badge-warning", PENDING: "yc-badge-warning",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200", CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-200",
  in_progress: "yc-badge-brand", IN_PROGRESS: "yc-badge-brand",
  completed: "yc-badge-success", COMPLETED: "yc-badge-success",
  cancelled: "yc-badge-danger", CANCELLED: "yc-badge-danger",
};

const statusLabel: Record<string, string> = {
  pending: "待确认", PENDING: "待确认",
  confirmed: "已确认", CONFIRMED: "已确认",
  in_progress: "服务中", IN_PROGRESS: "服务中",
  completed: "已完成", COMPLETED: "已完成",
  cancelled: "已取消", CANCELLED: "已取消",
};

const typeLabel: Record<string, string> = {
  escort: "陪诊", ESCORT: "陪诊",
  nursing: "护理", NURSING: "护理",
  rehabilitation: "康复", REHABILITATION: "康复",
  companion: "陪伴", COMPANION: "陪伴",
  bathing: "助浴", BATHING: "助浴",
  meal: "助餐", MEAL: "助餐",
  cleaning: "清洁", CLEANING: "清洁",
};

function fmtCurrency(n: number) {
  return n >= 10000 ? `¥${(n / 10000).toFixed(1)}万` : `¥${n.toLocaleString()}`;
}

function fmtDate(d: string | Date) {
  if (!d) return "-";
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const { data: stats, loading: statsLoading } = useApi<any>(
    () => fetchDashboardStats(),
    []
  );
  const { data: recentOrders, loading: ordersLoading } = useApi<any[]>(
    () => fetchCareOrders({ pageSize: 5 }),
    []
  );

  const s = stats ?? { totalElderly: 0, activeOrders: 0, riskAlerts: 0, revenueThisMonth: 0 };
  const orders = recentOrders ?? [];

  const statsConfig = [
    { key: "totalElderly", label: "老人总数", icon: Users, trend: 5.2, trendUp: true, color: "brand", value: s.totalElderly.toLocaleString() },
    { key: "activeOrders", label: "活跃订单", icon: ClipboardList, trend: 12.3, trendUp: true, color: "info", value: s.activeOrders.toLocaleString() },
    { key: "riskAlerts", label: "风险预警", icon: AlertTriangle, trend: 3.1, trendUp: false, color: "danger", value: s.riskAlerts.toLocaleString() },
    { key: "revenue", label: "本月营收", icon: TrendingUp, trend: 8.7, trendUp: true, color: "gold", value: fmtCurrency(s.revenueThisMonth) },
  ];

  const loading = statsLoading || ordersLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">早上好，管理员</h1>
        <p className="text-sm text-text-muted mt-1">今天是 {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}，祝您工作顺利</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          const colors = colorMap[stat.color];
          return (
            <div key={stat.key} className="yc-card flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {loading ? "-" : stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trendUp ? <ArrowUpRight className={cn("w-4 h-4", colors.trend)} /> : <ArrowDownRight className={cn("w-4 h-4", colors.trend)} />}
                  <span className={cn("text-xs font-medium", colors.trend)}>{stat.trend}%</span>
                  <span className="text-xs text-text-muted">较上月</span>
                </div>
              </div>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
                <Icon className={cn("w-5 h-5", colors.icon)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 yc-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">最近订单</h2>
            <a href="/dashboard/care-crm" className="text-sm text-brand-600 hover:text-brand-700 font-medium">查看全部</a>
          </div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 px-3 text-text-muted font-medium">订单号</th>
                    <th className="text-left py-2.5 px-3 text-text-muted font-medium">老人</th>
                    <th className="text-left py-2.5 px-3 text-text-muted font-medium">类型</th>
                    <th className="text-left py-2.5 px-3 text-text-muted font-medium">状态</th>
                    <th className="text-left py-2.5 px-3 text-text-muted font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-silver-50">
                      <td className="py-3 px-3 font-mono text-xs text-text-secondary">{order.orderNo}</td>
                      <td className="py-3 px-3 font-medium text-text-primary">{order.elderlyName}</td>
                      <td className="py-3 px-3 text-text-secondary">{typeLabel[order.type] ?? order.type}</td>
                      <td className="py-3 px-3">
                        <span className={cn("yc-badge", statusBadge[order.status] ?? "yc-badge-warning")}>
                          {statusLabel[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-text-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {fmtDate(order.scheduledAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-center py-8 text-sm text-text-muted">暂无订单数据</p>}
            </div>
          )}
        </div>

        {/* Risk Alerts */}
        <div className="yc-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">风险预警</h2>
            <span className="yc-badge yc-badge-danger">{s.riskAlerts} 条</span>
          </div>
          <div className="space-y-3">
            {s.riskAlerts === 0 ? (
              <p className="text-center py-8 text-sm text-text-muted">暂无风险预警</p>
            ) : (
              <p className="text-sm text-text-secondary">共 {s.riskAlerts} 条未处理风险预警，请前往健康档案查看</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="yc-card">
        <h2 className="text-lg font-semibold text-text-primary mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "新建订单", icon: Plus, href: "/dashboard/care-crm", variant: "primary" },
            { label: "添加老人", icon: UserPlus, href: "/dashboard/health-records", variant: "secondary" },
            { label: "政策查询", icon: BookOpen, href: "/dashboard/policy-database", variant: "secondary" },
            { label: "生成报告", icon: FileBarChart, href: "/dashboard/agent-workbench", variant: "secondary" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <a key={action.label} href={action.href}
                className={cn("flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                  action.variant === "primary" ? "yc-btn-primary flex-col gap-2 py-5" : "border-border hover:border-brand-300 hover:text-brand-700 text-text-secondary"
                )}>
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
