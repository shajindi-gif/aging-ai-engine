// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { POLICY_DISCLAIMER } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { Search, MapPin, Calendar, Tag, X, ExternalLink, FileText, Phone, CheckCircle2, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { fetchPolicies } from "@/lib/api";

const regions = ["全部", "上海", "北京", "浙江", "广东", "四川", "江苏", "山东", "全国"];
const policyTypes = [
  { value: "all", label: "全部类型" },
  { value: "subsidy", label: "补贴" },
  { value: "insurance", label: "保险" },
  { value: "service", label: "服务" },
  { value: "housing", label: "住房" },
  { value: "medical", label: "医疗" },
  { value: "employment", label: "就业" },
  { value: "tax", label: "税收" },
];
const levels = [
  { value: "all", label: "全部级别" },
  { value: "national", label: "国家级" },
  { value: "provincial", label: "省级" },
  { value: "municipal", label: "市级" },
  { value: "district", label: "区级" },
];

const levelColors: Record<string, string> = {
  national: "bg-red-50 text-red-700",
  provincial: "bg-blue-50 text-blue-700",
  municipal: "bg-brand-50 text-brand-700",
  district: "bg-silver-100 text-silver-700",
};
const categoryColors: Record<string, string> = {
  subsidy: "bg-gold-50 text-gold-700",
  insurance: "bg-blue-50 text-blue-700",
  service: "bg-brand-50 text-brand-700",
  housing: "bg-purple-50 text-purple-700",
  medical: "bg-red-50 text-red-700",
  employment: "bg-green-50 text-green-700",
  tax: "bg-orange-50 text-orange-700",
  other: "bg-silver-100 text-silver-700",
};
const categoryLabels: Record<string, string> = {
  subsidy: "补贴", insurance: "保险", service: "服务", housing: "住房",
  medical: "医疗", employment: "就业", tax: "税收", other: "其他",
};

export default function PoliciesPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("全部");
  const [policyType, setPolicyType] = useState("all");
  const [level, setLevel] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [timer, setTimer] = useState<any>(null);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (timer) clearTimeout(timer);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    setTimer(t);
  };

  const { data: policies, loading, error, meta } = useApi<any[]>(
    () => fetchPolicies({
      category: policyType !== "all" ? policyType : undefined,
      level: level !== "all" ? level : undefined,
      province: region !== "全部" ? region : undefined,
      search: debouncedSearch || undefined,
      pageSize: 200,
    }),
    [policyType, level, region, debouncedSearch]
  );

  const items = policies ?? [];
  const detail = selectedPolicy ? items.find((p: any) => p.id === selectedPolicy) : null;
  const activeCount = items.filter((p: any) => (p.status ?? "").toUpperCase() === "ACTIVE").length;
  const regionSet = new Set(items.map((p: any) => p.province ?? p.region ?? "").filter(Boolean));

  return (
    <>
      <Header />

      {/* Header */}
      <section className="bg-surface-secondary py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="yc-badge yc-badge-brand">政策数据库</span>
              <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
                银发经济政策数据库
              </h1>
              <p className="mt-2 text-text-secondary">
                全国养老政策法规智能检索与匹配
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="yc-card !py-2 !px-4 text-center">
                <p className="text-xl font-bold text-brand-600">{meta?.total ?? items.length}</p>
                <p className="text-xs text-text-muted">总政策数</p>
              </div>
              <div className="yc-card !py-2 !px-4 text-center">
                <p className="text-xl font-bold text-success">{activeCount}</p>
                <p className="text-xs text-text-muted">生效中</p>
              </div>
              <div className="yc-card !py-2 !px-4 text-center">
                <p className="text-xl font-bold text-gold-600">{regionSet.size}</p>
                <p className="text-xs text-text-muted">覆盖区域</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-surface border-b border-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="搜索政策标题、关键词..."
                className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-400 focus:outline-none">
                {regions.map((r) => (
                  <option key={r} value={r}>{r === "全部" ? "全部区域" : r}</option>
                ))}
              </select>
              <select value={policyType} onChange={(e) => setPolicyType(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-400 focus:outline-none">
                {policyTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-400 focus:outline-none">
                {levels.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Grid */}
      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              <span className="ml-3 text-sm text-text-muted">加载政策数据...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-text-muted">共 {items.length} 条政策</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((policy: any) => (
                  <div key={policy.id} className="yc-card flex flex-col">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <span className={cn("yc-badge text-xs", levelColors[policy.level] ?? "bg-silver-100")}>
                        {policy.level === "national" ? "国家级" : policy.level === "provincial" ? "省级" : policy.level === "municipal" ? "市级" : "区级"}
                      </span>
                      <span className={cn("yc-badge text-xs", categoryColors[policy.category ?? "other"] ?? "bg-silver-100")}>
                        {categoryLabels[policy.category ?? "other"] ?? policy.category ?? "其他"}
                      </span>
                      <span className="yc-badge text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {policy.city ?? policy.province ?? policy.region}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary line-clamp-2">
                      {policy.title}
                    </h3>
                    <p className="mt-2 text-xs text-text-secondary line-clamp-2 flex-1">
                      {policy.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(policy.tags ?? []).slice(0, 3).map((tag: string) => (
                        <span key={tag} className="rounded bg-silver-50 px-1.5 py-0.5 text-xs text-text-muted">{tag}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Calendar className="h-3 w-3" />
                        {policy.effectiveDate ?? (policy.publishDate ? new Date(policy.publishDate).toLocaleDateString("zh-CN") : "")}
                      </span>
                      <button
                        onClick={() => setSelectedPolicy(policy.id)}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {items.length === 0 && (
                <div className="py-20 text-center text-text-muted">
                  <BookOpen className="mx-auto h-12 w-12 mb-4 text-silver-300" />
                  <p>未找到匹配的政策</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-surface pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="yc-disclaimer flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
            <p className="text-sm text-text-secondary">{POLICY_DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {/* Policy Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedPolicy(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-wrap gap-1.5">
                <span className={cn("yc-badge text-xs", levelColors[detail.level])}>
                  {detail.level === "national" ? "国家级" : detail.level === "provincial" ? "省级" : detail.level === "municipal" ? "市级" : "区级"}
                </span>
                <span className={cn("yc-badge text-xs", categoryColors[detail.category ?? "other"] ?? "bg-silver-100")}>
                  {categoryLabels[detail.category ?? "other"] ?? detail.category ?? "其他"}
                </span>
              </div>
              <button onClick={() => setSelectedPolicy(null)} className="rounded-lg p-1 hover:bg-silver-100">
                <X className="h-5 w-5 text-text-muted" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-text-primary">{detail.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{detail.summary}</p>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-500" /> 申请条件
                </h4>
                <ul className="space-y-1">
                  {(detail.eligibility ?? detail.eligibilityCriteria ?? []).map((item: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-500" /> 所需材料
                </h4>
                <ul className="space-y-1">
                  {(detail.requiredDocuments ?? detail.requiredMaterials ?? []).map((doc: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">申请流程</h4>
                <ol className="space-y-1">
                  {(detail.applicationProcess ?? []).map((step: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-medium text-brand-600">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                {detail.applicationUrl && (
                  <a href={detail.applicationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-600 hover:underline">
                    <ExternalLink className="h-4 w-4" /> 官方申请链接
                  </a>
                )}
                {detail.contactPhone && (
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Phone className="h-4 w-4" /> {detail.contactPhone}
                  </span>
                )}
                <span className="flex items-center gap-1 text-text-muted">
                  <Tag className="h-3.5 w-3.5" /> 主管部门: {detail.department ?? detail.issuingAuthority ?? "-"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {(detail.tags ?? []).map((tag: string) => (
                <span key={tag} className="rounded bg-silver-50 px-2 py-0.5 text-xs text-text-muted">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
