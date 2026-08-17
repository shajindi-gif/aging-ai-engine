// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Search, CheckCircle2, AlertCircle, Loader2, FileText, Coins, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { POLICY_DISCLAIMER } from "@/lib/types";
import { matchPolicies } from "@/lib/api";

const provinces = ["上海", "北京", "浙江", "广东", "四川", "江苏", "山东", "全国"];
const careLevels = [
  { value: "INDEPENDENT", label: "自理" },
  { value: "SEMI_DEPENDENT", label: "半失能" },
  { value: "DEPENDENT", label: "失能" },
  { value: "CRITICAL", label: "重度失能" },
];

export default function SubsidyMatchingPage() {
  const [region, setRegion] = useState("上海");
  const [age, setAge] = useState("75");
  const [careLevel, setCareLevel] = useState("SEMI_DEPENDENT");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const res = await matchPolicies({
        region,
        age: parseInt(age) || 75,
        careLevel,
      });
      setResults(res.data?.matches ?? []);
      setSearched(true);
    } catch (err) {
      console.error("Policy match error:", err);
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">智能补贴匹配</h1>
        <p className="text-sm text-text-muted mt-1">根据老人情况智能匹配可享受的养老补贴政策</p>
      </div>

      <div className="yc-card">
        <h3 className="text-sm font-semibold text-text-primary mb-4">匹配条件</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">所在地区</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400">
              {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">老人年龄</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="60" max="120"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400" />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">护理等级</label>
            <select value={careLevel} onChange={(e) => setCareLevel(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400">
              {careLevels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleMatch} disabled={loading}
              className="w-full yc-btn-primary flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              智能匹配
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">匹配结果</h2>
            <span className="yc-badge yc-badge-brand">{results.length} 条</span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((policy: any, idx: number) => (
                <div key={policy.id ?? idx} className="yc-card">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-text-primary flex-1 line-clamp-2">{policy.title}</h3>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <div className="text-xs font-bold text-brand-600">{((policy.matchScore ?? 0) * 100).toFixed(0)}%</div>
                      <span className="text-xs text-text-muted">匹配</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="yc-badge text-xs bg-brand-50 text-brand-700">{policy.level === "national" ? "国家级" : policy.level === "provincial" ? "省级" : "市级"}</span>
                    <span className="yc-badge text-xs bg-gold-50 text-gold-700">{policy.category}</span>
                    <span className="yc-badge text-xs flex items-center gap-0.5"><MapPin className="h-3 w-3" />{policy.province ?? policy.city}</span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-3 mb-3">{policy.summary}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-text-muted">{policy.department ?? policy.issuingAuthority ?? "-"}</span>
                    <button className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                      <FileText className="w-3 h-3" /> 详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="yc-card text-center py-12">
              <AlertCircle className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">未找到匹配的政策，请调整条件重试</p>
            </div>
          )}
        </>
      )}

      <div className="yc-disclaimer flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{POLICY_DISCLAIMER}</span>
      </div>
    </div>
  );
}
