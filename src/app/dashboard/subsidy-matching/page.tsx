// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  FileText,
  Coins,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockPolicies } from "@/lib/mock";
import { POLICY_DISCLAIMER } from "@/lib/types";
import type { SubsidyMatchResult } from "@/lib/types";

const provinces = ["上海", "北京", "浙江", "广东", "四川", "江苏", "山东", "全国"];
const careLevels = [
  { value: "independent", label: "自理" },
  { value: "semi_dependent", label: "半失能" },
  { value: "dependent", label: "失能" },
  { value: "critical", label: "重度失能" },
];

const specialConditions = [
  { value: "low_income", label: "低保" },
  { value: "living_alone", label: "独居" },
  { value: "disabled", label: "失能" },
  { value: "dementia", label: "失智" },
  { value: "very_old", label: "高龄" },
];

function mockMatch(
  province: string,
  age: number,
  careLevel: string,
  conditions: string[]
): SubsidyMatchResult[] {
  const results: SubsidyMatchResult[] = [];

  mockPolicies.forEach((policy) => {
    if (policy.status !== "active") return;
    if (policy.category !== "subsidy" && policy.category !== "insurance" && policy.category !== "service" && policy.category !== "medical")
      return;

    let score = 0;
    const reasons: string[] = [];
    const missing: string[] = [];

    // Province match
    if (policy.province === province || policy.province === "全国") {
      score += 20;
      reasons.push(`政策适用于${policy.province}地区`);
    } else {
      missing.push(`政策仅适用于${policy.province}地区`);
    }

    // Age match
    if (age >= 65) {
      score += 15;
      reasons.push(`年龄 ${age} 岁满足高龄条件`);
    } else if (age >= 60) {
      score += 10;
      reasons.push(`年龄 ${age} 岁满足基本条件`);
    } else {
      missing.push("年龄未满60周岁");
    }

    // Care level
    if (careLevel === "dependent" || careLevel === "critical") {
      if ((policy.eligibility ?? []).some((e) => e.includes("失能"))) {
        score += 25;
        reasons.push("满足失能条件");
      }
    }

    // Special conditions
    if (conditions.includes("low_income") && (policy.eligibility ?? []).some((e) => e.includes("低保") || e.includes("低收入"))) {
      score += 20;
      reasons.push("满足低保/低收入条件");
    }
    if (conditions.includes("dementia") && policy.tags.some((t) => t.includes("失智") || t.includes("认知"))) {
      score += 20;
      reasons.push("满足失智照护条件");
    }
    if (conditions.includes("very_old") && age >= 80) {
      score += 15;
      reasons.push("满足80岁以上高龄条件");
    }
    if (conditions.includes("disabled")) {
      if ((policy.eligibility ?? []).some((e) => e.includes("残疾"))) {
        score += 15;
        reasons.push("满足残疾条件");
      }
    }

    // Bonus for matching province exactly
    if (policy.province === province) score += 5;

    if (score >= 20 && reasons.length > 0) {
      results.push({
        policy,
        matchScore: Math.min(score, 98),
        matchReasons: reasons,
        missingConditions: missing,
        estimatedAmount: score >= 50 ? "每月200-800元" : "视具体情况而定",
        applicationPath: policy.applicationProcess ?? [],
        confidence: Math.min(0.6 + score * 0.004, 0.95),
      });
    }
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export default function SubsidyMatchingPage() {
  const [province, setProvince] = useState("上海");
  const [city, setCity] = useState("上海");
  const [age, setAge] = useState(75);
  const [careLevel, setCareLevel] = useState("semi_dependent");
  const [disability, setDisability] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [results, setResults] = useState<SubsidyMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const toggleCondition = (val: string) => {
    setConditions((prev) => (prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]));
  };

  const handleMatch = () => {
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      const r = mockMatch(province, age, careLevel, conditions);
      setResults(r);
      setLoading(false);
    }, 1200);
  };

  const confidenceColor = (c: number) => {
    if (c >= 0.85) return "bg-success";
    if (c >= 0.7) return "bg-gold-500";
    return "bg-orange-400";
  };

  const scoreColor = (s: number) => {
    if (s >= 70) return "text-success";
    if (s >= 50) return "text-gold-600";
    return "text-orange-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">养老补贴智能匹配</h1>
        <p className="text-sm text-text-muted mt-1">
          根据老人基本信息和特殊条件，智能匹配适用的养老补贴政策
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="yc-card space-y-5">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Search className="w-5 h-5 text-brand-600" />
            匹配条件
          </h2>

          {/* Province / City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">省份</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">城市</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400"
                placeholder="城市"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">年龄</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min={0}
              max={120}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Care Level */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">护理等级</label>
            <select
              value={careLevel}
              onChange={(e) => setCareLevel(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
            >
              {careLevels.map((cl) => (
                <option key={cl.value} value={cl.value}>{cl.label}</option>
              ))}
            </select>
          </div>

          {/* Disability Level */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">残疾等级（可选）</label>
            <select
              value={disability}
              onChange={(e) => setDisability(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand-400"
            >
              <option value="">无</option>
              <option value="1">一级（极重度）</option>
              <option value="2">二级（重度）</option>
              <option value="3">三级（中度）</option>
              <option value="4">四级（轻度）</option>
            </select>
          </div>

          {/* Special Conditions */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">特殊条件</label>
            <div className="space-y-2">
              {specialConditions.map((sc) => (
                <label key={sc.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conditions.includes(sc.value)}
                    onChange={() => toggleCondition(sc.value)}
                    className="w-4 h-4 rounded border-silver-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-text-secondary">{sc.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleMatch} disabled={loading} className="yc-btn-primary w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                匹配中...
              </>
            ) : (
              <>
                <Coins className="w-4 h-4" />
                开始匹配
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="yc-card text-center py-16">
              <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto mb-3" />
              <p className="text-text-secondary">正在为您匹配最优补贴政策...</p>
              <p className="text-xs text-text-muted mt-1">分析 {mockPolicies.length} 条政策文件</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="yc-card text-center py-16">
              <XCircle className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">未找到匹配的补贴政策，请调整条件重试</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  找到 <span className="font-semibold text-text-primary">{results.length}</span> 条匹配政策
                </p>
              </div>

              {results.map((r, idx) => (
                <div key={r.policy.id} className="yc-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-2xl font-bold", scoreColor(r.matchScore))}>
                          {r.matchScore}%
                        </span>
                        <span className="text-sm text-text-muted">匹配度</span>
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary">{r.policy.title}</h3>
                    </div>
                    {idx === 0 && (
                      <span className="yc-badge yc-badge-gold shrink-0">最佳匹配</span>
                    )}
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted">置信度</span>
                      <span className="font-medium text-text-primary">{(r.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-silver-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", confidenceColor(r.confidence))}
                        style={{ width: `${r.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="space-y-1.5 mb-3">
                    {r.matchReasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="text-xs text-text-secondary">{reason}</span>
                      </div>
                    ))}
                    {r.missingConditions.map((mc, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-gold-700">{mc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Estimated Amount */}
                  {r.estimatedAmount && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gold-50 border border-gold-200 mb-3">
                      <Coins className="w-4 h-4 text-gold-600" />
                      <span className="text-sm font-medium text-gold-700">预估金额：{r.estimatedAmount}</span>
                    </div>
                  )}

                  {/* Application Path */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-text-secondary mb-2 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      申请路径
                    </p>
                    <div className="space-y-1">
                      {r.applicationPath.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                          <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-medium shrink-0">
                            {i + 1}
                          </span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button className="yc-btn-primary text-xs py-2">
                      <MapPin className="w-3.5 h-3.5" />
                      一键生成申请清单
                    </button>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      需人工审核
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && !searched && (
            <div className="yc-card text-center py-16">
              <Coins className="w-10 h-10 text-brand-300 mx-auto mb-3" />
              <p className="text-text-muted">填写左侧条件后点击{"u201C"}开始匹配{"u201D"}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="yc-disclaimer flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{POLICY_DISCLAIMER}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
