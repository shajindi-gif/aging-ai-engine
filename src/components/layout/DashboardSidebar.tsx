"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Coins,
  ClipboardList,
  HeartPulse,
  Building2,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "工作台", href: "/dashboard", icon: LayoutDashboard },
  { label: "政策数据库", href: "/dashboard/policy-database", icon: BookOpen },
  { label: "补贴匹配", href: "/dashboard/subsidy-matching", icon: Coins },
  { label: "陪诊护理 CRM", href: "/dashboard/care-crm", icon: ClipboardList },
  { label: "健康档案", href: "/dashboard/health-records", icon: HeartPulse },
  { label: "销售线索", href: "/dashboard/sales-leads", icon: Building2 },
  { label: "AI Agent 工作台", href: "/dashboard/agent-workbench", icon: Bot },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-surface h-screen sticky top-0 transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg yc-gradient-brand flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">YC</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-semibold text-sm text-text-primary whitespace-nowrap">
              衍策银龄 AI
            </h1>
            <p className="text-xs text-text-muted whitespace-nowrap">Aging AI Engine</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700 border border-brand-200"
                  : "text-text-secondary hover:bg-silver-100 hover:text-text-primary border border-transparent"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-2 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-silver-100 transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>系统设置</span>}
        </Link>
        <button
          onClick={onToggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-text-muted hover:bg-silver-100 transition-colors mt-1"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span>收起侧栏</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
