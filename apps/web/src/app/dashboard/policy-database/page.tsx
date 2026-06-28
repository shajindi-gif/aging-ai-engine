"use client";

import { useState, useMemo } from "react";
import { Search, Filter, BarChart3, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { truncate } from "@/lib/utils";
import { mockPolicies } from "@/lib/mock";
import { POLICY_DISCLAIMER } from "@/lib/types";
import type { Policy } from "@/lib/types";

const categoryLabel: Record<string, string> = {
  subsidy: "补贴",
  insurance: "保险",
  service: "服务",
  housing: "住房",
  medical: "医疗",
  employment: "就业",
  tax: "税务",
  other: "其他",
};

const categoryColor: Record<string, string> = {
  subsidy: "yc-badge-gold",
  insurance: "bg-blue-50 text-blue-700 border border-blue-200",
  service: "yc-badge-brand",
  housing: "yc-badge-success",
  medical: "yc-badge-danger",
  employment: "bg-purple-50 text-purple-700 border border-purple-200",
  tax: "bg-slate-100 text-slate-700 border border-slate-200",
  other: "bg-silver-100 text-silver-600 border border-silver-200",
};

const levelLabel: Record<string, string> = {
  national: "国家级",
  provincial: "省级",
  municipal: "市级",
  district: "区级",
};

const levelColor: Record<string, string> = {
  national: "bg-red-50 text-red-700 border border-red-200",
  provincial: "bg-orange-50 text-orange-700 border border-orange-200",
  municipal: "yc-badge-brand",
  district: "bg-silver-100 text-silver-600 border border-silver-200",
};

const statusLabel: Record<string, string> = {
  active: "现行有效",
  expired: "已失效",
  upcoming: "即将生效",
};

const statusColor: Record<string, string> = {
  active: "yc-badge-success",
  expired: "yc-badge-danger",
  upcoming: "yc-badge-warning",
};

export default function PolicyDatabasePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [province, setProvince] = useState("");
  const [status, setStatus] = useState<string>("");

  const filtered = useMemo(() => {
    return mockPolicies.filter((p: Policy) => {
      if (search && !p.title.includes(search) && !p.summary.includes(search) && !p.tags.some((t) => t.includes(search)))
        return false;
      if (category && p.category !== category) return false;
      if (level && p.level !== level) return false;
      if (province && !p.province.includes(province)) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  }, [search, category, level, province, status]);

  const stats = useMemo(() => {
    const active = mockPolicies.filter((p) => p.status === "active").length;
    const byCategory: Record<string, number> = {};
    mockPolicies.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    });
    return { total: mockPolicies.length, active, byCategory };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">银发经济政策数据库</h1>
        <p className="text-sm text-text-muted mt-1">
          收录 {mockPolicies.length} 条养老相关政策，覆盖全国各级政府部门发布的养老服务、补贴、保险等政策文件
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search + Filters */}
          <div className="yc-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索政策标题、摘要、标签..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                />
              </div>
              <div className="flex items-center gap-1 text-sm text-text-muted">
                <Filter className="w-4 h-4" />
                <span>筛选</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
              >
                <option value="">全部分类</option>
                {Object.entries(categoryLabel).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
              >
                <option value="">全部层级</option>
                {Object.entries(levelLabel).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="省份/城市"
                className="px-3 py-2 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400 w-32"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
              >
                <option value="">全部状态</option>
                {Object.entries(statusLabel).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <button
                onClick={() => { setSearch(""); setCategory(""); setLevel(""); setProvince(""); setStatus(""); }}
                className="yc-btn-secondary text-sm px-4"
              >
                重置
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">
              共找到 <span className="font-semibold text-text-primary">{filtered.length}</span> 条政策
            </p>
          </div>

          {/* Policy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((policy) => (
              <div key={policy.id} className="yc-card flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-text-primary leading-snug flex-1">
                    {policy.title}
                  </h3>
                  <span className={cn("yc-badge shrink-0", statusColor[policy.status])}>
                    {statusLabel[policy.status]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={cn("yc-badge", categoryColor[policy.category])}>
                    {categoryLabel[policy.category]}
                  </span>
                  <span className={cn("yc-badge", levelColor[policy.level])}>
                    {levelLabel[policy.level]}
                  </span>
                  <span className="yc-badge bg-silver-100 text-silver-600 border border-silver-200">
                    {policy.province}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed mb-3 flex-1">
                  {truncate(policy.summary, 120)}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {policy.eligibility.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded bg-silver-100 text-silver-600">
                      {tag}
                    </span>
                  ))}
                  {policy.eligibility.length > 3 && (
                    <span className="px-2 py-0.5 text-xs rounded bg-silver-100 text-silver-600">
                      +{policy.eligibility.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-text-muted">{policy.department}</span>
                  <button className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                    查看详情 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="yc-card text-center py-12">
              <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">未找到匹配的政策，请调整搜索条件</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="yc-disclaimer flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{POLICY_DISCLAIMER}</span>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <div className="yc-card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-text-primary">数据统计</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">政策总数</span>
                <span className="text-lg font-bold text-text-primary">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">现行有效</span>
                <span className="text-lg font-bold text-success">{stats.active}</span>
              </div>
            </div>
          </div>

          <div className="yc-card">
            <h3 className="text-sm font-semibold text-text-primary mb-3">分类统计</h3>
            <div className="space-y-2">
              {Object.entries(stats.byCategory).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("yc-badge text-xs", categoryColor[cat])}>
                      {categoryLabel[cat] ?? cat}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="yc-card">
            <h3 className="text-sm font-semibold text-text-primary mb-3">热门政策标签</h3>
            <div className="flex flex-wrap gap-1.5">
              {["高龄津贴", "长护险", "居家养老", "失能评估", "医保", "社区服务", "智慧养老", "普惠养老"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-full bg-brand-50 text-brand-700 border border-brand-200 cursor-pointer hover:bg-brand-100 transition-colors"
                    onClick={() => setSearch(tag)}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
