// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MEDICAL_DISCLAIMER } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { Search, Plus, MapPin, Calendar, Users, Loader2, AlertCircle } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { fetchElders } from "@/lib/api";

const careLevelLabels: Record<string, string> = {
  independent: "自理", INDEPENDENT: "自理",
  semi_dependent: "半自理", SEMI_DEPENDENT: "半自理",
  dependent: "失能", DEPENDENT: "失能",
  critical: "危重", CRITICAL: "危重",
};
const careLevelColors: Record<string, string> = {
  independent: "bg-green-50 text-green-700", INDEPENDENT: "bg-green-50 text-green-700",
  semi_dependent: "bg-brand-50 text-brand-700", SEMI_DEPENDENT: "bg-brand-50 text-brand-700",
  dependent: "bg-gold-50 text-gold-700", DEPENDENT: "bg-gold-50 text-gold-700",
  critical: "bg-red-50 text-red-700", CRITICAL: "bg-red-50 text-red-700",
};

function getAge(birthDate: string | Date): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function getGender(g: string): string {
  if (g === "MALE" || g === "male") return "男";
  if (g === "FEMALE" || g === "female") return "女";
  return g;
}

export default function EldersPage() {
  const [search, setSearch] = useState("");
  const [careLevel, setCareLevel] = useState("all");
  const [livingStatus, setLivingStatus] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const [timer, setTimer] = useState<any>(null);
  const handleSearch = (val: string) => {
    setSearch(val);
    if (timer) clearTimeout(timer);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    setTimer(t);
  };

  const { data: elders, loading, error, meta } = useApi<any[]>(
    () => fetchElders({
      careLevel: careLevel !== "all" ? careLevel : undefined,
      search: debouncedSearch || undefined,
      pageSize: 100,
    }),
    [careLevel, debouncedSearch]
  );

  const items = elders ?? [];

  const filtered = useMemo(() => {
    return items.filter((e: any) => {
      if (livingStatus !== "all" && (e.livingStatus ?? "alone") !== livingStatus) return false;
      return true;
    });
  }, [items, livingStatus]);

  const byCareLevel = {
    independent: items.filter((e: any) => (e.careLevel ?? "").toUpperCase() === "INDEPENDENT").length,
    semi_dependent: items.filter((e: any) => (e.careLevel ?? "").toUpperCase() === "SEMI_DEPENDENT").length,
    dependent: items.filter((e: any) => (e.careLevel ?? "").toUpperCase() === "DEPENDENT").length,
    critical: items.filter((e: any) => (e.careLevel ?? "").toUpperCase() === "CRITICAL").length,
  };

  const total = meta?.total ?? items.length;

  return (
    <>
      <Header />

      {/* Disclaimer */}
      <div className="bg-red-50 border-b border-red-200 py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-red-700">{MEDICAL_DISCLAIMER}</p>
        </div>
      </div>

      {/* Header */}
      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="yc-badge yc-badge-brand">档案管理</span>
              <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">
                老人档案管理
              </h1>
            </div>
            <button className="yc-btn-primary text-sm">
              <Plus className="h-4 w-4" /> 添加老人
            </button>
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
                placeholder="搜索姓名、城市、慢病..."
                className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
            <div className="flex gap-2">
              <select value={careLevel} onChange={(e) => setCareLevel(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                <option value="all">全部护理等级</option>
                <option value="INDEPENDENT">自理</option>
                <option value="SEMI_DEPENDENT">半自理</option>
                <option value="DEPENDENT">失能</option>
                <option value="CRITICAL">危重</option>
              </select>
              <select value={livingStatus} onChange={(e) => setLivingStatus(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                <option value="all">全部居住状态</option>
                <option value="alone">独居</option>
                <option value="with_spouse">与配偶同住</option>
                <option value="with_children">与子女同住</option>
                <option value="institution">机构</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                  <span className="ml-3 text-sm text-text-muted">加载中...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                  <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
                  <p className="text-sm text-red-500">{error}</p>
                  <p className="text-xs mt-2">请确认已登录，或检查网络连接</p>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-text-muted">共 {total} 位老人</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filtered.map((elder: any) => {
                      const age = elder.birthDate ? getAge(elder.birthDate) : (elder.age ?? 0);
                      const diseases = elder.healthSummary?.chronicDiseases ?? elder.chronicDiseases ?? [];
                      const city = elder.city ?? elder.region?.split("市")[0] ?? "";
                      return (
                        <Link key={elder.id} href={`/elders/${elder.id}`} className="yc-card flex flex-col hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                              {elder.name?.slice(0, 1)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-text-primary">{elder.name}</p>
                              <p className="text-xs text-text-muted">{getGender(elder.gender)} · {age}岁</p>
                            </div>
                            <span className={cn("yc-badge text-xs shrink-0", careLevelColors[elder.careLevel] ?? "bg-silver-100")}>
                              {careLevelLabels[elder.careLevel] ?? elder.careLevel}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {diseases.slice(0, 4).map((d: string) => (
                              <span key={d} className="rounded bg-silver-50 px-1.5 py-0.5 text-xs text-text-muted">{d}</span>
                            ))}
                          </div>
                          <div className="mt-auto flex items-center justify-between text-xs text-text-muted border-t border-border pt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {elder.updatedAt ? new Date(elder.updatedAt).toLocaleDateString("zh-CN") : ""}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {filtered.length === 0 && (
                    <div className="py-20 text-center text-text-muted">
                      <Users className="mx-auto h-12 w-12 mb-4 text-silver-300" />
                      <p>未找到匹配的老人档案</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Stats Sidebar */}
            <div className="lg:w-64 shrink-0">
              <div className="yc-card sticky top-20">
                <h3 className="text-sm font-semibold text-text-primary mb-4">统计概览</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">总人数</span>
                    <span className="text-sm font-bold text-brand-600">{total}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-medium text-text-muted mb-2">按护理等级</p>
                    {Object.entries(byCareLevel).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between py-1">
                        <span className={cn("yc-badge text-xs", careLevelColors[level] ?? "bg-silver-100")}>
                          {careLevelLabels[level] ?? level}
                        </span>
                        <span className="text-xs text-text-primary font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
