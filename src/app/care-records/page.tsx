// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mockCareRecords } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";
import { Search, Filter, Clock, User, AlertTriangle } from "lucide-react";

const typeLabels: Record<string, string> = {
  escort: "陪诊", nursing: "护理", rehabilitation: "康复", companion: "陪伴",
  bathing: "助浴", meal: "助餐", cleaning: "清洁", health_check: "健康监测",
};
const riskColors: Record<string, string> = {
  none: "bg-green-50 text-green-700", low: "bg-brand-50 text-brand-700",
  medium: "bg-gold-50 text-gold-700", high: "bg-red-50 text-red-700",
};
const riskLabels: Record<string, string> = {
  none: "无风险", low: "低风险", medium: "中风险", high: "高风险",
};

export default function CareRecordsPage() {
  const records = mockCareRecords ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [familyVisibleOnly, setFamilyVisibleOnly] = useState(false);

  const filtered = useMemo(() => {
    return records.filter((r: any) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (riskFilter !== "all" && r.riskLevel !== riskFilter) return false;
      if (familyVisibleOnly && !r.familyVisible) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.elderlyName.toLowerCase().includes(q) || r.content.toLowerCase().includes(q);
      }
      return true;
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [records, search, typeFilter, riskFilter, familyVisibleOnly]);

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="yc-badge yc-badge-brand">服务记录</span>
          <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">服务记录</h1>
          <p className="mt-2 text-text-secondary">所有陪诊护理服务的时间线记录</p>
        </div>
      </section>

      <section className="bg-surface border-b border-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索老人姓名..." className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none" />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                <option value="all">全部类型</option>
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                <option value="all">全部风险</option>
                {Object.entries(riskLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <label className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm cursor-pointer">
                <input type="checkbox" checked={familyVisibleOnly} onChange={(e) => setFamilyVisibleOnly(e.target.checked)} className="h-3.5 w-3.5 rounded text-brand-600" />
                仅家属可见
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm text-text-muted">共 {filtered.length} 条记录</p>
          <div className="space-y-4">
            {filtered.map((rec: any) => (
              <div key={rec.id} className="relative pl-8">
                <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-100">
                  <Clock className="h-3 w-3 text-brand-600" />
                </div>
                <div className="absolute left-[11px] top-8 bottom-[-16px] w-0.5 bg-border" />
                <div className="yc-card">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-text-muted">{rec.createdAt.replace("T", " ")}</span>
                    <span className="yc-badge text-xs bg-brand-50 text-brand-700">{typeLabels[rec.type] ?? rec.type}</span>
                    <span className="yc-badge text-xs bg-silver-100 flex items-center gap-1"><User className="h-3 w-3" />{rec.providerName}</span>
                    <span className="yc-badge text-xs bg-blue-50 text-blue-700">{rec.elderlyName}</span>
                    {rec.riskLevel !== "none" && (
                      <span className={cn("yc-badge text-xs", riskColors[rec.riskLevel])}>{riskLabels[rec.riskLevel]}</span>
                    )}
                    {rec.familyVisible && <span className="text-xs text-success">家属可见</span>}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{rec.content}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center py-12 text-text-muted">暂无记录</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
