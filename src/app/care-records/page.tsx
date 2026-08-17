// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils/cn";
import { Search, Filter, Calendar, Clock, CheckCircle, Loader2, AlertCircle, FileText, ClipboardList } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { fetchCareRecords } from "@/lib/api";

const statusLabels: Record<string, string> = {
  pending: "待执行", PENDING: "待执行",
  in_progress: "进行中", IN_PROGRESS: "进行中",
  completed: "已完成", COMPLETED: "已完成",
  cancelled: "已取消", CANCELLED: "已取消",
};
const statusColors: Record<string, string> = {
  pending: "bg-gold-50 text-gold-700", PENDING: "bg-gold-50 text-gold-700",
  in_progress: "bg-brand-50 text-brand-700", IN_PROGRESS: "bg-brand-50 text-brand-700",
  completed: "bg-green-50 text-green-700", COMPLETED: "bg-green-50 text-green-700",
  cancelled: "bg-silver-100 text-silver-600", CANCELLED: "bg-silver-100 text-silver-600",
};

export default function CareRecordsPage() {
  const [search, setSearch] = useState("");

  const { data: records, loading, error, meta } = useApi<any[]>(
    () => fetchCareRecords({ pageSize: 100 }),
    []
  );

  const items = records ?? [];

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((r: any) =>
      (r.elderlyName ?? "").toLowerCase().includes(q) ||
      (r.caregiverName ?? "").toLowerCase().includes(q) ||
      (r.content ?? r.notes ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <span className="yc-badge yc-badge-brand">服务记录</span>
            <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">护理服务记录</h1>
            <p className="mt-2 text-text-secondary">服务过程全程追踪与质量记录</p>
          </div>
        </div>
      </section>

      <section className="bg-surface border-b border-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索老人、护理人员、内容..."
              className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              <span className="ml-3 text-sm text-text-muted">加载服务记录...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-text-muted">共 {filtered.length} 条记录</p>
              <div className="space-y-3">
                {filtered.map((r: any) => {
                  const recordedAt = r.recordedAt ? new Date(r.recordedAt) : r.createdAt ? new Date(r.createdAt) : null;
                  return (
                    <div key={r.id} className="yc-card flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
                        <ClipboardList className="h-5 w-5 text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-text-primary">{r.elderlyName ?? "未知老人"}</p>
                          <span className={cn("yc-badge text-xs", statusColors[r.status] ?? "bg-silver-100")}>
                            {statusLabels[r.status] ?? r.status}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{r.content ?? r.notes ?? r.description ?? "无记录内容"}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                          {r.caregiverName && (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> {r.caregiverName}
                            </span>
                          )}
                          {recordedAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {recordedAt.toLocaleString("zh-CN")}
                            </span>
                          )}
                          {r.orderNo && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" /> {r.orderNo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <div className="py-20 text-center text-text-muted">
                  <ClipboardList className="mx-auto h-12 w-12 mb-4 text-silver-300" />
                  <p>暂无服务记录</p>
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
