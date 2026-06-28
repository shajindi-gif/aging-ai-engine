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
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockDashboardStats, mockCareOrders, mockElderly } from "@/lib/mock";
import type { RiskFlag } from "@/lib/types";

const statsConfig = [
  {
    key: "totalElderly",
    label: "老人总数",
    icon: Users,
    trend: 5.2,
    trendUp: true,
    color: "brand",
    getValue: (s: typeof mockDashboardStats) => s.totalElderly.toLocaleString(),
  },
  {
    key: "activeOrders",
    label: "活跃订单",
    icon: ClipboardList,
    trend: 12.3,
    trendUp: true,
    color: "info",
    getValue: (s: typeof mockDashboardStats) => s.activeOrders.toLocaleString(),
  },
  {
    key: "riskAlerts",
    label: "风险预警",
    icon: AlertTriangle,
    trend: 3.1,
    trendUp: false,
    color: "danger",
    getValue: (s: typeof mockDashboardStats) => s.riskAlerts.toLocaleString(),
  },
  {
    key: "revenue",
    label: "本月营收",
    icon: TrendingUp,
    trend: 8.7,
    trendUp: true,
    color: "gold",
    getValue: (s: typeof mockDashboardStats) => formatCurrency(s.revenueThisMonth),
  },
];

const colorMap: Record<string, { bg: string; icon: string; trend: string }> = {
  brand: { bg: "bg-brand-50", icon: "text-brand-600", trend: "text-brand-600" },
  info: { bg: "bg-blue-50", icon: "text-blue-600", trend: "text-blue-600" },
  danger: { bg: "bg-red-50", icon: "text-red-600", trend: "text-red-600" },
  gold: { bg: "bg-gold-50", icon: "text-gold-600", trend: "text-gold-600" },
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

const typeLabel: Record<string, string> = {
  escort: "陪诊",
  nursing: "护理",
  rehabilitation: "康复",
  companion: "陪伴",
  bathing: "助浴",
  meal: "助餐",
  cleaning: "清洁",
};

const riskLevelColor: Record<string, string> = {
  low: "yc-badge-warning",
  medium: "bg-orange-50 text-orange-700 border border-orange-200",
  high: "yc-badge-danger",
  critical: "bg-red-100 text-red-800 border border-red-300",
};

const riskLevelLabel: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "紧急",
};

const riskTypeLabel: Record<string, string> = {
  fall: "跌倒",
  medication: "用药",
  vital: "体征",
  behavior: "行为",
  nutrition: "营养",
  other: "其他",
};

function getAllRiskFlags() {
  const flags: (RiskFlag & { elderlyName: string })[] = [];
  mockElderly.forEach((e) => {
    e.healthSummary.riskFlags.forEach((rf) => {
      flags.push({ ...rf, elderlyName: e.name });
    });
  });
  return flags.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.level] ?? 4) - (order[b.level] ?? 4);
  });
}

export default function DashboardPage() {
  const recentOrders = [...mockCareOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const riskFlags = getAllRiskFlags().slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">早上好，管理员</h1>
        <p className="text-sm text-text-muted mt-1">今天是 {formatDate(new Date().toISOString())}，祝您工作顺利</p>
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
                  {stat.getValue(mockDashboardStats)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trendUp ? (
                    <ArrowUpRight className={cn("w-4 h-4", colors.trend)} />
                  ) : (
                    <ArrowDownRight className={cn("w-4 h-4", colors.trend)} />
                  )}
                  <span className={cn("text-xs font-medium", colors.trend)}>
                    {stat.trend}%
                  </span>
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
        {/* Recent Orders - takes 2 cols */}
        <div className="lg:col-span-2 yc-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">最近订单</h2>
            <a href="/dashboard/care-crm" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              查看全部
            </a>
          </div>
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
                {recentOrders.map((order) => (
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
                      {formatDate(order.scheduledAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="yc-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">风险预警</h2>
            <span className="yc-badge yc-badge-danger">{riskFlags.length} 条</span>
          </div>
          <div className="space-y-3">
            {riskFlags.map((flag) => (
              <div
                key={flag.id}
                className="p-3 rounded-lg border border-border bg-surface-secondary hover:border-brand-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">{flag.elderlyName}</span>
                  <span className={cn("yc-badge text-xs", riskLevelColor[flag.level] ?? "yc-badge-warning")}>
                    {riskLevelLabel[flag.level] ?? flag.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="yc-badge yc-badge-brand text-xs">
                    {riskTypeLabel[flag.type] ?? flag.type}
                  </span>
                  <span className="text-xs text-text-muted">{formatDate(flag.detectedAt)}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{flag.description}</p>
              </div>
            ))}
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
              <a
                key={action.label}
                href={action.href}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                  action.variant === "primary"
                    ? "yc-btn-primary flex-col gap-2 py-5"
                    : "border-border hover:border-brand-300 hover:text-brand-700 text-text-secondary"
                )}
              >
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
