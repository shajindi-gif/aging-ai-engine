// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import {
  Upload,
  LayoutGrid,
  Table,
  Phone,
  Calendar,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatCurrency } from "@/lib/utils";
import { mockSalesLeads, mockInstitutions } from "@/lib/mock";
import type { SalesLead } from "@/lib/types";

const statusPipeline = [
  { value: "new", label: "新线索", color: "bg-silver-200" },
  { value: "contacted", label: "已联系", color: "bg-blue-200" },
  { value: "qualified", label: "已确认", color: "bg-brand-200" },
  { value: "proposal", label: "方案中", color: "bg-gold-200" },
  { value: "negotiation", label: "谈判中", color: "bg-orange-200" },
  { value: "won", label: "已成交", color: "bg-green-200" },
];

const statusLabel: Record<string, string> = {
  new: "新线索",
  contacted: "已联系",
  qualified: "已确认",
  proposal: "方案中",
  negotiation: "谈判中",
  won: "已成交",
  lost: "已失败",
};

const statusColor: Record<string, string> = {
  new: "bg-silver-100 text-silver-700 border border-silver-200",
  contacted: "bg-blue-50 text-blue-700 border border-blue-200",
  qualified: "yc-badge-brand",
  proposal: "yc-badge-gold",
  negotiation: "bg-orange-50 text-orange-700 border border-orange-200",
  won: "yc-badge-success",
  lost: "yc-badge-danger",
};

const priorityLabel: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const priorityColor: Record<string, string> = {
  high: "yc-badge-danger",
  medium: "yc-badge-warning",
  low: "bg-silver-100 text-silver-600 border border-silver-200",
};

export default function SalesLeadsPage() {
  const [view, setView] = useState<"pipeline" | "table">("pipeline");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockSalesLeads.filter((l: SalesLead) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (priorityFilter && l.priority !== priorityFilter) return false;
      if (search && !l.institutionName.includes(search) && !l.contactName.includes(search))
        return false;
      return true;
    });
  }, [statusFilter, priorityFilter, search]);

  const getDigitalScore = (institutionName: string) => {
    const inst = mockInstitutions.find((i) => i.name === institutionName);
    return inst?.digitalMaturity;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">养老机构销售线索库</h1>
          <p className="text-sm text-text-muted mt-1">
            管理 {mockSalesLeads.length} 条销售线索，覆盖 {mockInstitutions.length} 家养老机构
          </p>
        </div>
        <button className="yc-btn-primary">
          <Upload className="w-4 h-4" />
          导入线索
        </button>
      </div>

      {/* Filters + View Toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索机构或联系人..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
          >
            <option value="">全部状态</option>
            {statusPipeline.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
          >
            <option value="">全部优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <div className="flex items-center gap-1 text-sm text-text-muted">
            <Filter className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setView("pipeline")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm transition-colors",
              view === "pipeline" ? "bg-brand-50 text-brand-700" : "text-text-muted hover:bg-silver-100"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            管线视图
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm transition-colors",
              view === "table" ? "bg-brand-50 text-brand-700" : "text-text-muted hover:bg-silver-100"
            )}
          >
            <Table className="w-4 h-4" />
            表格视图
          </button>
        </div>
      </div>

      {/* Pipeline View */}
      {view === "pipeline" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusPipeline.map((stage) => {
            const stageLeads = filtered.filter((l) => l.status === stage.value);
            return (
              <div key={stage.value} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                    <span className="text-xs font-semibold text-text-primary">{stage.label}</span>
                  </div>
                  <span className="text-xs text-text-muted">{stageLeads.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="yc-card p-3 space-y-2">
                      <p className="text-sm font-medium text-text-primary leading-snug truncate">
                        {lead.institutionName}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("yc-badge text-xs", priorityColor[lead.priority])}>
                          {priorityLabel[lead.priority]}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.contactName}
                      </p>
                      {lead.estimatedValue && (
                        <p className="text-xs font-semibold text-gold-600">
                          {formatCurrency(lead.estimatedValue)}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {lead.productInterest.slice(0, 2).map((p) => (
                          <span key={p} className="px-1.5 py-0.5 text-xs rounded bg-brand-50 text-brand-700 border border-brand-200">
                            {p}
                          </span>
                        ))}
                        {lead.productInterest.length > 2 && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-silver-100 text-silver-600">
                            +{lead.productInterest.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="space-y-4">
          <div className="yc-card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">机构名称</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">联系人</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">状态</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">优先级</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">预估金额</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">数字化评分</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">下次跟进</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const dm = getDigitalScore(lead.institutionName);
                  return (
                    <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-silver-50">
                      <td className="py-3 px-4 font-medium text-text-primary">{lead.institutionName}</td>
                      <td className="py-3 px-4">
                        <p className="text-text-secondary">{lead.contactName}</p>
                        <p className="text-xs text-text-muted">{lead.contactRole}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn("yc-badge", statusColor[lead.status])}>
                          {statusLabel[lead.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn("yc-badge", priorityColor[lead.priority])}>
                          {priorityLabel[lead.priority]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">
                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {dm ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-silver-200 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  dm.score >= 70 ? "bg-success" : dm.score >= 40 ? "bg-gold-500" : "bg-danger"
                                )}
                                style={{ width: `${dm.score}%` }}
                              />
                            </div>
                            <span className="text-xs text-text-muted">{dm.score} ({dm.level})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-text-muted text-xs">
                        {lead.nextFollowUpAt ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(lead.nextFollowUpAt)}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                          跟进
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Digital Maturity Summary */}
          <div className="yc-card">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              机构数字化成熟度概览
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockInstitutions.slice(0, 3).map((inst) => (
                <div key={inst.id} className="p-3 rounded-lg bg-surface-secondary border border-border">
                  <p className="text-sm font-medium text-text-primary mb-2">{inst.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-brand-600">{inst.digitalMaturity.score}</span>
                    <span className="yc-badge yc-badge-brand">{inst.digitalMaturity.level}</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: "信息系统", value: inst.digitalMaturity.dimensions.informationSystem },
                      { label: "数据管理", value: inst.digitalMaturity.dimensions.dataManagement },
                      { label: "服务数字化", value: inst.digitalMaturity.dimensions.serviceDigitization },
                      { label: "员工技术采纳", value: inst.digitalMaturity.dimensions.staffTechAdoption },
                      { label: "家属互动", value: inst.digitalMaturity.dimensions.familyEngagement },
                    ].map((dim) => (
                      <div key={dim.label} className="flex items-center gap-2">
                        <span className="text-xs text-text-muted w-20 truncate">{dim.label}</span>
                        <div className="flex-1 h-1.5 bg-silver-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              dim.value >= 70 ? "bg-success" : dim.value >= 40 ? "bg-gold-500" : "bg-danger"
                            )}
                            style={{ width: `${dim.value}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-muted w-6 text-right">{dim.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
