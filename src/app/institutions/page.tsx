// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils/cn";
import { Building2, Download, LayoutGrid, Table, Star, Phone, MapPin, X, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { fetchInstitutions, fetchSalesLeads } from "@/lib/api";

const typeLabels: Record<string, string> = {
  nursing_home: "养老院", NURSING_HOME: "养老院",
  community_day_care: "社区日照", COMMUNITY_DAY_CARE: "社区日照",
  home_care_agency: "居家服务", HOME_CARE_AGENCY: "居家服务",
  rehabilitation_center: "康复中心", REHABILITATION_CENTER: "康复中心",
  hospice: "安宁疗护", HOSPICE: "安宁疗护",
  assisted_living: "辅助生活", ASSISTED_LIVING: "辅助生活",
  escort_company: "陪诊公司", ESCORT_COMPANY: "陪诊公司",
  renovation_vendor: "适老化改造", RENOVATION_VENDOR: "适老化改造",
  day_care_center: "日托中心", DAY_CARE_CENTER: "日托中心",
};
const statusLabels: Record<string, string> = {
  new: "新线索", NEW: "新线索",
  contacted: "已联系", CONTACTED: "已联系",
  qualified: "已确认", QUALIFIED: "已确认",
  proposal: "方案中", PROPOSAL: "方案中",
  negotiation: "谈判中", NEGOTIATION: "谈判中",
  won: "已成交", WON: "已成交",
  lost: "已流失", LOST: "已流失",
};
const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700", NEW: "bg-blue-50 text-blue-700",
  contacted: "bg-brand-50 text-brand-700", CONTACTED: "bg-brand-50 text-brand-700",
  qualified: "bg-green-50 text-green-700", QUALIFIED: "bg-green-50 text-green-700",
  proposal: "bg-gold-50 text-gold-700", PROPOSAL: "bg-gold-50 text-gold-700",
  negotiation: "bg-purple-50 text-purple-700", NEGOTIATION: "bg-purple-50 text-purple-700",
  won: "bg-green-100 text-green-800", WON: "bg-green-100 text-green-800",
  lost: "bg-silver-100 text-silver-600", LOST: "bg-silver-100 text-silver-600",
};
const pipelineStatuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON"];

export default function InstitutionsPage() {
  const [view, setView] = useState<"pipeline" | "table">("table");
  const [region, setRegion] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: institutions, loading: instLoading, error: instError } = useApi<any[]>(
    () => fetchInstitutions({ province: region !== "all" ? region : undefined }),
    [region]
  );
  const { data: leads, loading: leadsLoading } = useApi<any[]>(
    () => fetchSalesLeads(),
    []
  );

  const instList = institutions ?? [];
  const leadList = leads ?? [];
  const loading = instLoading || leadsLoading;

  const enriched = useMemo(() => {
    return leadList.map((lead: any) => {
      const inst = instList.find((i: any) => i.id === lead.institutionId);
      return { ...lead, institution: inst };
    });
  }, [leadList, instList]);

  const filtered = useMemo(() => {
    if (region === "all") return enriched;
    return enriched.filter((l: any) => l.institution?.province === region || l.institution?.city === region);
  }, [enriched, region]);

  const regions = Array.from(new Set(instList.map((i: any) => i.province)));
  const detail = selectedId ? instList.find((i: any) => i.id === selectedId) : null;
  const detailLead = selectedId ? leadList.find((l: any) => l.institutionId === selectedId) : null;

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="yc-badge yc-badge-brand">销售线索</span>
              <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">养老机构销售线索库</h1>
            </div>
            <button className="yc-btn-secondary text-sm"><Download className="h-4 w-4" /> 导出线索</button>
          </div>
        </div>
      </section>

      <section className="bg-surface border-b border-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                <option value="all">全部区域</option>
                {regions.map((r: string) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex rounded-lg border border-border">
              <button onClick={() => setView("pipeline")} className={cn("px-3 py-1.5 text-sm font-medium transition-colors", view === "pipeline" ? "bg-brand-600 text-white" : "text-text-secondary hover:text-text-primary")}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setView("table")} className={cn("px-3 py-1.5 text-sm font-medium transition-colors", view === "table" ? "bg-brand-600 text-white" : "text-text-secondary hover:text-text-primary")}>
                <Table className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              <span className="ml-3 text-sm text-text-muted">加载线索数据...</span>
            </div>
          ) : instError ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
              <p className="text-sm text-red-500">{instError}</p>
            </div>
          ) : view === "pipeline" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {pipelineStatuses.map((status) => {
                const cards = filtered.filter((l: any) => (l.status ?? "").toUpperCase() === status);
                return (
                  <div key={status} className="min-w-[240px] flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn("yc-badge text-xs", statusColors[status])}>{statusLabels[status]}</span>
                      <span className="text-xs text-text-muted">{cards.length}</span>
                    </div>
                    <div className="space-y-2">
                      {cards.map((lead: any) => (
                        <div key={lead.id} onClick={() => setSelectedId(lead.institutionId)}
                          className="yc-card cursor-pointer hover:shadow-md transition-shadow !p-3">
                          <p className="text-sm font-medium text-text-primary truncate">{lead.institutionName}</p>
                          <p className="text-xs text-text-muted mt-1">{lead.contactName} · {lead.contactRole}</p>
                          {lead.estimatedValue && (
                            <p className="text-xs text-brand-600 mt-1 font-medium">¥{lead.estimatedValue.toLocaleString()}</p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(lead.productInterest ?? []).slice(0, 2).map((p: string) => (
                              <span key={p} className="rounded bg-silver-50 px-1.5 py-0.5 text-xs text-text-muted">{p}</span>
                            ))}
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
                  <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                    <th className="px-4 py-3 font-medium">机构名</th>
                    <th className="px-4 py-3 font-medium">区域</th>
                    <th className="px-4 py-3 font-medium">类型</th>
                    <th className="px-4 py-3 font-medium">床位</th>
                    <th className="px-4 py-3 font-medium">跟进状态</th>
                    <th className="px-4 py-3 font-medium">预估金额</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead: any) => (
                    <tr key={lead.id} onClick={() => setSelectedId(lead.institutionId)}
                      className="border-b border-border last:border-0 hover:bg-silver-50/50 cursor-pointer">
                      <td className="px-4 py-3 text-text-primary font-medium">{lead.institutionName}</td>
                      <td className="px-4 py-3 text-text-secondary">{lead.institution?.city ?? "-"}</td>
                      <td className="px-4 py-3 text-text-secondary">{lead.institution ? (typeLabels[lead.institution.type] ?? lead.institution.type) : "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{lead.institution?.beds ?? "-"}</td>
                      <td className="px-4 py-3"><span className={cn("yc-badge text-xs", statusColors[lead.status] ?? "bg-silver-100")}>{statusLabels[lead.status] ?? lead.status}</span></td>
                      <td className="px-4 py-3 text-text-primary">{lead.estimatedValue ? `¥${lead.estimatedValue.toLocaleString()}` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Detail Panel */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedId(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">{detail.name}</h2>
                <p className="text-sm text-text-muted">{typeLabels[detail.type] ?? detail.type} · {detail.city} {detail.district ?? ""}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="rounded-lg p-1 hover:bg-silver-100"><X className="h-5 w-5 text-text-muted" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-text-muted">床位数:</span> <span className="text-text-primary">{detail.beds}</span></div>
              <div><span className="text-text-muted">入住率:</span> <span className="text-text-primary">{detail.occupancyRate ? `${(detail.occupancyRate * 100).toFixed(0)}%` : "-"}</span></div>
              <div><span className="text-text-muted">价格区间:</span> <span className="text-text-primary">¥{detail.priceMin}-{detail.priceMax}/{detail.priceUnit === "DAY" ? "日" : "月"}</span></div>
              <div><span className="text-text-muted">评分:</span> <span className="text-text-primary">{detail.rating ?? "-"}</span></div>
              <div><span className="text-text-muted">成立年份:</span> <span className="text-text-primary">{detail.establishedYear ?? "-"}</span></div>
              <div><span className="text-text-muted">联系人:</span> <span className="text-text-primary">{detail.contactName ?? "-"} {detail.contactPhone ?? ""}</span></div>
            </div>
            {(detail.services ?? []).length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-text-primary mb-2">服务项目</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.services.map((s: string) => <span key={s} className="yc-badge bg-brand-50 text-brand-700 text-xs">{s}</span>)}
                </div>
              </div>
            )}
            {detail.digitalMaturity && (
              <div className="mt-4">
                <p className="text-sm font-medium text-text-primary mb-2">
                  数字化成熟度 ({detail.digitalMaturity.level}, {detail.digitalMaturity.score}分)
                </p>
              </div>
            )}
            {detailLead && (
              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-text-primary mb-1">线索信息</p>
                <p className="text-xs text-text-secondary">状态: {statusLabels[detailLead.status] ?? detailLead.status} · 预估: ¥{detailLead.estimatedValue?.toLocaleString()}</p>
                {detailLead.notes && <p className="text-xs text-text-muted mt-1">{detailLead.notes}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
