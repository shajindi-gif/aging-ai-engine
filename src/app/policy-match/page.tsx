// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mockPolicies } from "@/lib/mock";
import { POLICY_DISCLAIMER } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";

const chronicDiseases = ["高血压", "糖尿病", "心脏病", "中风", "阿尔茨海默", "帕金森", "骨质疏松"];
const livingOptions = [
  { value: "alone", label: "独居" },
  { value: "with_spouse", label: "与配偶同住" },
  { value: "with_children", label: "与子女同住" },
  { value: "institution", label: "机构照护" },
];
const careLevels = [
  { value: "independent", label: "自理" },
  { value: "semi_dependent", label: "半自理" },
  { value: "dependent", label: "失能" },
  { value: "critical", label: "危重" },
];
const incomeLevels = [
  { value: "low", label: "低收入" },
  { value: "medium", label: "中等收入" },
  { value: "high", label: "高收入" },
];
const applicantTypes = [
  { value: "self", label: "本人" },
  { value: "family", label: "家属" },
  { value: "institution", label: "机构" },
  { value: "community", label: "社区" },
];

interface MatchResult {
  policy: (typeof mockPolicies)[0];
  matchScore: number;
  matchReasons: string[];
  missingMaterials: string[];
  nextSteps: string[];
  estimatedAmount: string;
  confidence: number;
}

export default function PolicyMatchPage() {
  const policies = mockPolicies ?? [];
  const [province, setProvince] = useState("上海");
  const [city, setCity] = useState("上海");
  const [age, setAge] = useState(70);
  const [livingStatus, setLivingStatus] = useState("alone");
  const [careLevel, setCareLevel] = useState("independent");
  const [isDisabled, setIsDisabled] = useState(false);
  const [chronics, setChronics] = useState<string[]>([]);
  const [income, setIncome] = useState("medium");
  const [applicant, setApplicant] = useState("self");
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);

  const toggleChronic = (d: string) => {
    setChronics((prev) => prev.includes(d) ? prev.filter((c) => c !== d) : [...prev, d]);
  };

  const handleMatch = () => {
    setMatching(true);
    setTimeout(() => {
      const matched: MatchResult[] = policies
        .filter((p) => {
          if (p.status !== "active") return false;
          if ((p.province ?? p.region ?? "") !== "全国" && (p.province ?? p.region) !== province && p.city !== city) return false;
          return true;
        })
        .map((policy) => {
          let score = 50;
          const reasons: string[] = [];
          if (age >= 60) { score += 10; reasons.push("年满60周岁"); }
          if (age >= 65 && policy.tags.includes("高龄津贴")) { score += 20; reasons.push("符合高龄津贴年龄要求"); }
          if (age >= 80 && policy.tags.includes("高龄")) { score += 15; reasons.push("80岁以上高龄优待"); }
          if (isDisabled && policy.tags.includes("失能")) { score += 20; reasons.push("失能状态符合申请条件"); }
          if (careLevel !== "independent" && policy.category === "service") { score += 15; reasons.push("有护理需求，符合服务类政策"); }
          if (income === "low" && (policy.eligibility ?? []).some((e: string) => e.includes("低"))) { score += 20; reasons.push("低收入家庭优先"); }
          if (chronics.length > 0 && policy.category === "medical") { score += 15; reasons.push("慢性病符合医疗类政策"); }
          if ((policy.province ?? policy.region) === "全国") { score += 5; reasons.push("全国性政策"); }
          score = Math.min(score, 98);
          const missing = (policy.requiredDocuments ?? []).slice(0, 2);
          return {
            policy,
            matchScore: score,
            matchReasons: reasons.length > 0 ? reasons : ["基本条件匹配"],
            missingMaterials: missing,
            nextSteps: policy.applicationProcess ?? [],
            estimatedAmount: (policy.benefits ?? "").includes("元") ? policy.benefits! : "以审核为准",
            confidence: Math.min(score + 2, 99) / 100,
          };
        })
        .filter((r) => r.matchScore >= 55)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8);
      setResults(matched);
      setMatching(false);
    }, 1200);
  };

  return (
    <>
      <Header />

      {/* Header */}
      <section className="bg-surface-secondary py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="yc-badge yc-badge-brand">智能匹配</span>
          <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            养老补贴智能匹配
          </h1>
          <p className="mt-2 text-text-secondary">
            填写基本信息，AI 为您匹配可享受的养老补贴政策
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-surface py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="yc-card">
            <h2 className="text-lg font-semibold text-text-primary mb-6">基本信息</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">省份</label>
                <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                  {["上海", "北京", "浙江", "广东", "四川", "江苏", "山东"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">城市</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                  <option value={province}>{province}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">年龄</label>
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={50} max={120} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">居住状态</label>
                <select value={livingStatus} onChange={(e) => setLivingStatus(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                  {livingOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">护理等级</label>
                <select value={careLevel} onChange={(e) => setCareLevel(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                  {careLevels.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">收入水平</label>
                <select value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                  {incomeLevels.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">申请主体</label>
                <select value={applicant} onChange={(e) => setApplicant(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
                  {applicantTypes.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-400" />
                  <span className="text-sm text-text-primary">失能 / 半失能状态</span>
                </label>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-text-primary mb-2">慢病情况（多选）</label>
              <div className="flex flex-wrap gap-2">
                {chronicDiseases.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleChronic(d)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      chronics.includes(d)
                        ? "border-brand-400 bg-brand-50 text-brand-700"
                        : "border-border text-text-secondary hover:border-brand-200"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleMatch}
              disabled={matching}
              className="yc-btn-primary mt-8 w-full justify-center text-base py-3"
            >
              {matching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  匹配中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  开始匹配
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {results.length > 0 && (
        <section className="bg-surface-secondary py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">
              匹配结果（{results.length} 条政策）
            </h2>
            <div className="space-y-4">
              {results.map((r) => (
                <div key={r.policy.id} className="yc-card">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-text-primary">{r.policy.title}</h3>
                      <p className="mt-1 text-xs text-text-secondary line-clamp-2">{r.policy.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold",
                        r.matchScore >= 85 ? "bg-green-50 text-green-700" :
                        r.matchScore >= 70 ? "bg-brand-50 text-brand-700" :
                        "bg-gold-50 text-gold-700"
                      )}>
                        {r.matchScore}
                      </div>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-silver-100">
                      <div
                        className={cn("h-1.5 rounded-full", r.matchScore >= 85 ? "bg-green-500" : r.matchScore >= 70 ? "bg-brand-500" : "bg-gold-500")}
                        style={{ width: `${r.matchScore}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-text-muted">置信度: {Math.round(r.confidence * 100)}%</p>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium text-text-muted mb-1">匹配原因</p>
                      <ul className="space-y-0.5">
                        {r.matchReasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-1 text-xs text-success">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-muted mb-1">待准备材料</p>
                      <ul className="space-y-0.5">
                        {r.missingMaterials.map((mat, i) => (
                          <li key={i} className="flex items-start gap-1 text-xs text-gold-600">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                            {mat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-muted mb-1">预计补贴</p>
                      <p className="text-xs text-text-primary font-medium">{r.estimatedAmount}</p>
                      <p className="text-xs text-text-muted mt-1">主管部门: {r.policy.department}</p>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-border pt-3">
                    <p className="text-xs font-medium text-text-muted mb-1">申请步骤</p>
                    <ol className="flex flex-wrap gap-1">
                      {r.nextSteps.map((step, i) => (
                        <li key={i} className="rounded bg-silver-50 px-2 py-0.5 text-xs text-text-secondary">
                          {i + 1}. {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <button className="mt-3 text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> 生成申请清单
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="bg-surface py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="yc-disclaimer flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
            <p className="text-sm text-text-secondary">{POLICY_DISCLAIMER}</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
