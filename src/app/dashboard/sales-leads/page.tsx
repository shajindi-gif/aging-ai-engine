// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import { Upload, LayoutGrid, Table, Phone, Calendar, TrendingUp, Filter, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useApi } from "@/lib/hooks/use-api";
import { fetchSalesLeads, fetchInstitutions } from "@/lib/api";

const statusPipeline = [
  { value: "NEW", label: "新线索", color: "bg-silver-200" },
  { value: "CONTACTED", label: "已联系", color: "bg-blue-200" },
  { value: "QUALIFIED", label: "已确认", color: "bg-brand-200" },
  { value: "PROPOSAL", label: "方案中", color: "bg-gold-200" },
  { value: "NEGOTIATION", label: "谈判中", color: "bg-orange-200" },
  { value: "WON", label: "已成交", color: "bg-green-200" },
];

const statusLabel: Record<string, string> = {
  new: "新线索", NEW: "新线索", contacted: "已联系", CONTACTED: "已联系",
  qualified: "已确认", QUALIFIED: "已确认", proposal: "方案中", PROPOSAL: "方案中",
  negotiation: "谈判中", NEGOTIATION: "谈判中", won: "已成交", WON: "已成交", lost: "已流失", LOST: "已流失",
};

const priorityLabel: Record<string, string> = {
  high: "高", HIGH: "高", medium: "中", MEDIUM: "中", low: "低", LOW: "低",
};
const priorityColor: Record<string, string> = {
  high: "yc-badge-danger", HIGH: "yc-badge-danger",
  medium: "yc-badge-warning", MEDIUM: "yc-badge-warning",
  low: "yc-badge-success", LOW: "yc-badge-success",
};

function fmtCurrency(n: number) {
  return n >= 10000 ? `¥${(n / 10000).toFixed(1)}万` : `¥${n.toLocaleString()}`;
}

export default function SalesLeadsPage() {
  const [view, setView] = useState<"pipeline" | "table">("table");
  const [search, setSearch] = useState("");

  const { data: leads, loading, error } = useApi<any[]>(
    () => fetchSalesLeads(),
    []
  );

  const items = leads ?? [];

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((l: any) =>
      (l.institutionName ?? "").toLowerCase().includes(q) ||
      (l.contactName ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const totalValue = items.reduce((sum: number, l: any) => sum + (l.estimatedValue ?? 0), 0);
  const wonValue = items.filter((l: any) => (l.status ?? "").toUpperCase() === "WON").reduce((sum: number, l: any) => sum + (l.estimatedValue ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">销售线索管理</h1>
          <p className="text-sm text-text-muted mt-1">管理养老机构销售线索，追踪商机转化</p>
        </div>
        <button className="yc-btn-secondary"><Upload className="w-4 h-4" /> 导入线索</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="yc-card flex items-center justify-between">
          <span className="text-sm text-text-secondary">总线索</span>
          <span className="text-2xl font-bold text-brand-600">{items.length}</span>
        </div>
        <div className="yc-card flex items-center justify-between">
          <span className="text-sm text-text-secondary">预估总额</span>
          <span className="text-2xl font-bold text-gold-600">{fmtCurrency(totalValue)}</span>
        </div>
        <div className="yc-card flex items-center justify-between">
          <span className="text-sm text-text-secondary">已成交</span>
          <span className="text-2xl font-bold text-success">{fmtCurrency(wonValue)}</span>
        </div>
        <div className="yc-card flex items-center justify-between">
          <span className="text-sm text-text-secondary">转化率</span>
          <span className="text-2xl font-bold text-brand-600">{items.length > 0 ? ((items.filter((l: any) => (l.status ?? "").toUpperCase() === "WON").length / items.length) * 100).toFixed(0) : 0}%</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索机构名、联系人..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400" />
        </div>
        <div className="flex rounded-lg border border-border">
          <button onClick={() => setView("pipeline")} className={cn("px-3 py-1.5 text-sm", view === "pipeline" ? "bg-brand-600 text-white" : "text-text-secondary")}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setView("table")} className={cn("px-3 py-1.5 text-sm", view === "table" ? "bg-brand-600 text-white" : "text-text-secondary")}>
            <Table className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-brand-500" /></div>
      ) : view === "pipeline" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusPipeline.map((s) => {
            const cards = filtered.filter((l: any) => (l.status ?? "").toUpperCase() === s.value);
            return (
              <div key={s.value} className="min-w-[220px] flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", s.color)} />
                    <span className="text-sm font-medium text-text-primary">{s.label}</span>
                  </div>
                  <span className="text-xs text-text-muted">{cards.length}</span>
                </div>
                <div className="space-y-2">
                  {cards.map((lead: any) => (
                    <div key={lead.id} className="yc-card !p-3 hover:shadow-md transition-shadow">
                      <p className="text-sm font-medium text-text-primary truncate">{lead.institutionName}</p>
                      <p className="text-xs text-text-muted mt-1">{lead.contactName ?? "-"} · {lead.contactRole ?? "-"}</p>
                      {lead.estimatedValue && <p className="text-xs text-brand-600 mt-1 font-medium">{fmtCurrency(lead.estimatedValue)}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <span className={cn("yc-badge text-xs", priorityColor[lead.priority] ?? "bg-silver-100")}>{priorityLabel[lead.priority] ?? lead.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="yc-card !p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left py-3 px-4 text-text-muted font-medium">机构名</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">联系人</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">来源</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">状态</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">优先级</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">预估金额</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead: any) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-silver-50">
                  <td className="py-3 px-4 font-medium text-text-primary">{lead.institutionName}</td>
                  <td className="py-3 px-4 text-text-secondary">{lead.contactName ?? "-"} <span className="text-xs text-text-muted">{lead.contactPhone ?? ""}</span></td>
                  <td className="py-3 px-4 text-text-muted text-xs">{lead.source ?? "-"}</td>
                  <td className="py-3 px-4"><span className="yc-badge text-xs">{statusLabel[lead.status] ?? lead.status}</span></td>
                  <td className="py-3 px-4"><span className={cn("yc-badge text-xs", priorityColor[lead.priority] ?? "bg-silver-100")}>{priorityLabel[lead.priority] ?? lead.priority}</span></td>
                  <td className="py-3 px-4 text-text-primary">{lead.estimatedValue ? fmtCurrency(lead.estimatedValue) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12"><Search className="w-8 h-8 text-text-muted mx-auto mb-2" /><p className="text-sm text-text-muted">暂无线索数据</p></div>}
        </div>
      )}
    </div>
  );
}
