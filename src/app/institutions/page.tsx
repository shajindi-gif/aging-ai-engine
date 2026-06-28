// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mockInstitutions, mockLeads } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";
import { Building2, Download, LayoutGrid, Table, Star, Phone, MapPin, X, ChevronRight } from "lucide-react";

const typeLabels: Record<string, string> = {
  nursing_home: "养老院", community_day_care: "社区日照", home_care_agency: "居家服务",
  rehabilitation_center: "康复中心", hospice: "安宁疗护", assisted_living: "辅助生活",
};
const statusLabels: Record<string, string> = {
  new: "新线索", contacted: "已联系", qualified: "已确认", proposal: "方案中",
  negotiation: "谈判中", won: "已成交", lost: "已流失",
};
const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700", contacted: "bg-brand-50 text-brand-700",
  qualified: "bg-green-50 text-green-700", proposal: "bg-gold-50 text-gold-700",
  negotiation: "bg-purple-50 text-purple-700", won: "bg-green-100 text-green-800", lost: "bg-silver-100 text-silver-600",
};
const pipelineStatuses = ["new", "contacted", "qualified", "proposal", "negotiation", "won"];

export default function InstitutionsPage() {
  const institutions = mockInstitutions ?? [];
  const leads = mockLeads ?? [];
  const [view, setView] = useState<"pipeline" | "table">("table");
  const [region, setRegion] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const enriched = useMemo(() => {
    return leads.map((lead: any) => {
      const inst = institutions.find((i) => i.id === lead.institutionId);
      return { ...lead, institution: inst };
    });
  }, [leads, institutions]);

  const filtered = useMemo(() => {
    if (region === "all") return enriched;
    return enriched.filter((l: any) => l.institution?.province === region || l.institution?.city === region);
  }, [enriched, region]);

  const regions = Array.from(new Set(institutions.map((i) => i.province)));
  const detail = selectedId ? institutions.find((i) => i.id === selectedId) : null;
  const detailLead = selectedId ? leads.find((l) => l.institutionId === selectedId) : null;

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
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
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
          {view === "pipeline" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {pipelineStatuses.map((status) => {
                const cards = filtered.filter((l: any) => l.status === status);
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
                            {lead.productInterest.slice(0, 2).map((p: string) => (
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
                    <th className="px-4 py-3 font-medium">数字化评分</th>
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
                      <td className="px-4 py-3 text-text-secondary">{lead.institution ? typeLabels[lead.institution.type] : "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{lead.institution?.beds ?? "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-silver-100">
                            <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${lead.institution?.digitalMaturity.score ?? 0}%` }} />
                          </div>
                          <span className="text-xs text-text-muted">{lead.institution?.digitalMaturity.score ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={cn("yc-badge text-xs", statusColors[lead.status])}>{statusLabels[lead.status]}</span></td>
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
                <p className="text-sm text-text-muted">{typeLabels[detail.type]} · {detail.city} {detail.district}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="rounded-lg p-1 hover:bg-silver-100"><X className="h-5 w-5 text-text-muted" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-text-muted">床位数:</span> <span className="text-text-primary">{detail.beds}</span></div>
              <div><span className="text-text-muted">入住率:</span> <span className="text-text-primary">{detail.occupancyRate ? `${(detail.occupancyRate * 100).toFixed(0)}%` : "-"}</span></div>
              <div><span className="text-text-muted">价格区间:</span> <span className="text-text-primary">¥{detail.priceRange.min}-{detail.priceRange.max}/{detail.priceRange.unit === "month" ? "月" : "日"}</span></div>
              <div><span className="text-text-muted">评分:</span> <span className="text-text-primary">{detail.rating ?? "-"}</span></div>
              <div><span className="text-text-muted">成立年份:</span> <span className="text-text-primary">{detail.establishedYear}</span></div>
              <div><span className="text-text-muted">联系人:</span> <span className="text-text-primary">{detail.contactName} {detail.contactPhone}</span></div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-text-primary mb-2">服务项目</p>
              <div className="flex flex-wrap gap-1.5">
                {detail.services.map((s) => <span key={s} className="yc-badge bg-brand-50 text-brand-700 text-xs">{s}</span>)}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-text-primary mb-2">数字化成熟度 ({detail.digitalMaturity.level}, {detail.digitalMaturity.score}分)</p>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(detail.digitalMaturity.dimensions).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="h-1.5 w-full rounded-full bg-silver-100 mb-1">
                      <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${val}%` }} />
                    </div>
                    <p className="text-xs text-text-muted truncate">{key === "informationSystem" ? "信息系统" : key === "dataManagement" ? "数据管理" : key === "serviceDigitization" ? "服务数字化" : key === "staffTechAdoption" ? "员工采用" : "家属参与"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-text-primary mb-2">建议改进</p>
              <ul className="space-y-1">
                {detail.digitalMaturity.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-brand-500 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
            {detailLead && (
              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-text-primary mb-1">线索信息</p>
                <p className="text-xs text-text-secondary">状态: {statusLabels[detailLead.status]} · 预估: ¥{detailLead.estimatedValue?.toLocaleString()}</p>
                <p className="text-xs text-text-muted mt-1">{detailLead.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
