// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { UserPlus, AlertTriangle, Phone, MapPin, Heart, Pill, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MEDICAL_DISCLAIMER } from "@/lib/types";
import { useApi } from "@/lib/hooks/use-api";
import { fetchElders } from "@/lib/api";

const careLevelLabel: Record<string, string> = {
  independent: "自理", INDEPENDENT: "自理",
  semi_dependent: "半失能", SEMI_DEPENDENT: "半失能",
  dependent: "失能", DEPENDENT: "失能",
  critical: "重度失能", CRITICAL: "重度失能",
};
const careLevelColor: Record<string, string> = {
  independent: "yc-badge-success", INDEPENDENT: "yc-badge-success",
  semi_dependent: "yc-badge-brand", SEMI_DEPENDENT: "yc-badge-brand",
  dependent: "yc-badge-warning", DEPENDENT: "yc-badge-warning",
  critical: "yc-badge-danger", CRITICAL: "yc-badge-danger",
};

function getAge(birthDate: string | Date): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function HealthRecordsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const { data: elders, loading, error } = useApi<any[]>(
    () => fetchElders({ search: search || undefined, pageSize: 100 }),
    [search]
  );

  const items = elders ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">健康档案管理</h1>
          <p className="text-sm text-text-muted mt-1">管理老人健康数据、慢病记录、用药方案和风险监测</p>
        </div>
        <button className="yc-btn-primary"><UserPlus className="w-4 h-4" /> 添加老人</button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-xs text-red-700">{MEDICAL_DISCLAIMER}</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索老人姓名..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-brand-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((elder: any) => {
            const age = elder.birthDate ? getAge(elder.birthDate) : 0;
            const diseases = elder.healthSummary?.chronicDiseases ?? [];
            return (
              <div key={elder.id} onClick={() => setSelected(elder)}
                className="yc-card cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {elder.name?.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{elder.name}</p>
                    <p className="text-xs text-text-muted">{elder.gender === "MALE" ? "男" : "女"} · {age}岁</p>
                  </div>
                  <span className={cn("yc-badge text-xs", careLevelColor[elder.careLevel] ?? "bg-silver-100")}>
                    {careLevelLabel[elder.careLevel] ?? elder.careLevel}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {diseases.slice(0, 3).map((d: string) => (
                    <span key={d} className="rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-600">{d}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted border-t border-border pt-2">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{elder.city ?? "-"}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{diseases.length}项慢病</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-text-muted">
          <Heart className="mx-auto h-12 w-12 mb-4 text-silver-300" />
          <p>暂无老人档案</p>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">{selected.name}</h2>
                <p className="text-sm text-text-muted">{selected.city ?? ""} {selected.province ?? ""}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 hover:bg-silver-100">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="yc-card"><h4 className="font-semibold mb-2 flex items-center gap-1"><Heart className="h-4 w-4 text-red-500" /> 慢性病</h4>
                <div className="flex flex-wrap gap-1">{(selected.healthSummary?.chronicDiseases ?? []).map((d: string) => <span key={d} className="yc-badge bg-red-50 text-red-700 text-xs">{d}</span>)}</div>
              </div>
              <div className="yc-card"><h4 className="font-semibold mb-2 flex items-center gap-1"><Pill className="h-4 w-4 text-brand-500" /> 过敏史</h4>
                <div className="flex flex-wrap gap-1">{(selected.healthSummary?.allergies ?? []).map((a: string) => <span key={a} className="yc-badge bg-gold-50 text-gold-700 text-xs">{a}</span>)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
