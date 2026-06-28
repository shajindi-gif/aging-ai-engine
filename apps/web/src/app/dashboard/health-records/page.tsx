"use client";

import { useState } from "react";
import {
  UserPlus,
  AlertTriangle,
  Phone,
  MapPin,
  Heart,
  Pill,
  Stethoscope,
  ShieldAlert,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils";
import { mockElderly } from "@/lib/mock";
import { MEDICAL_DISCLAIMER } from "@/lib/types";
import type { ElderlyProfile } from "@/lib/types";

const careLevelLabel: Record<string, string> = {
  independent: "自理",
  semi_dependent: "半失能",
  dependent: "失能",
  critical: "重度失能",
};

const careLevelColor: Record<string, string> = {
  independent: "yc-badge-success",
  semi_dependent: "yc-badge-brand",
  dependent: "yc-badge-warning",
  critical: "yc-badge-danger",
};

const detailTabs = [
  { value: "basic", label: "基本信息", icon: Info },
  { value: "health", label: "健康摘要", icon: Heart },
  { value: "medication", label: "用药记录", icon: Pill },
  { value: "visits", label: "就诊记录", icon: Stethoscope },
  { value: "risks", label: "风险标记", icon: ShieldAlert },
];

const riskLevelColor: Record<string, string> = {
  low: "yc-badge-warning",
  medium: "bg-orange-50 text-orange-700 border border-orange-200",
  high: "yc-badge-danger",
  critical: "bg-red-100 text-red-800 border border-red-300",
};

const riskLevelLabel: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "紧急",
};

const riskTypeLabel: Record<string, string> = {
  fall: "跌倒",
  medication: "用药",
  vital: "体征",
  behavior: "行为",
  nutrition: "营养",
  other: "其他",
};

const serviceTypeLabel: Record<string, string> = {
  home: "居家",
  community: "社区",
  institution: "机构",
};

function getInitials(name: string) {
  return name.slice(0, 1);
}

function getAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const avatarColors = [
  "bg-brand-100 text-brand-700",
  "bg-gold-100 text-gold-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

export default function HealthRecordsPage() {
  const [selectedId, setSelectedId] = useState(mockElderly[0].id);
  const [detailTab, setDetailTab] = useState("basic");

  const selected = mockElderly.find((e) => e.id === selectedId) ?? mockElderly[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">老人健康档案</h1>
          <p className="text-sm text-text-muted mt-1">管理老人基本信息、健康档案和用药记录</p>
        </div>
        <button className="yc-btn-primary">
          <UserPlus className="w-4 h-4" />
          添加老人
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Elderly List (Left Panel) */}
        <div className="yc-card p-0 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-3 border-b border-border sticky top-0 bg-surface z-10">
            <p className="text-sm font-medium text-text-primary">
              共 {mockElderly.length} 位老人
            </p>
          </div>
          <div>
            {mockElderly.map((e, idx) => {
              const age = getAge(e.birthDate);
              const hasRisk = e.healthSummary.riskFlags.length > 0;
              const isSelected = e.id === selectedId;

              return (
                <button
                  key={e.id}
                  onClick={() => { setSelectedId(e.id); setDetailTab("basic"); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 border-b border-border last:border-0 text-left transition-colors",
                    isSelected ? "bg-brand-50 border-l-2 border-l-brand-600" : "hover:bg-silver-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                      avatarColors[idx % avatarColors.length]
                    )}
                  >
                    {getInitials(e.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{e.name}</span>
                      <span className="text-xs text-text-muted">{age}岁</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={cn("yc-badge text-xs", careLevelColor[e.careLevel])}>
                        {careLevelLabel[e.careLevel]}
                      </span>
                      {hasRisk && (
                        <span className="w-2 h-2 rounded-full bg-danger" title="有风险标记" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel (Right) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Medical Disclaimer */}
          <div className="yc-disclaimer yc-disclaimer-medical flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{MEDICAL_DISCLAIMER}</span>
          </div>

          {/* Profile Header */}
          <div className="yc-card">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0",
                  avatarColors[mockElderly.indexOf(selected) % avatarColors.length]
                )}
              >
                {getInitials(selected.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-text-primary">{selected.name}</h2>
                  <span className={cn("yc-badge", careLevelColor[selected.careLevel])}>
                    {careLevelLabel[selected.careLevel]}
                  </span>
                  <span className="yc-badge yc-badge-brand">
                    {serviceTypeLabel[selected.serviceType]}
                  </span>
                </div>
                <p className="text-sm text-text-muted">
                  {getAge(selected.birthDate)}岁 | {selected.gender === "male" ? "男" : "女"} | {selected.province} {selected.city}
                </p>
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="flex items-center gap-1 mt-4 border-b border-border">
              {detailTabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setDetailTab(t.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                      detailTab === t.value
                        ? "border-brand-600 text-brand-700"
                        : "border-transparent text-text-muted hover:text-text-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="yc-card">
            {/* Basic Info */}
            {detailTab === "basic" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-text-muted">联系电话</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-brand-600" />
                      {selected.phone ?? "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-text-muted">地址</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-600" />
                      {selected.address}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-text-muted mb-2">紧急联系人</p>
                  <div className="p-3 rounded-lg bg-surface-secondary border border-border">
                    <p className="text-sm font-medium text-text-primary">{selected.emergencyContact.name}</p>
                    <p className="text-xs text-text-muted">
                      {selected.emergencyContact.relationship} | {selected.emergencyContact.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-text-muted mb-2">家庭成员</p>
                  <div className="space-y-2">
                    {selected.familyMembers.map((fm) => (
                      <div key={fm.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border">
                        <div>
                          <span className="text-sm font-medium text-text-primary">{fm.name}</span>
                          <span className="text-xs text-text-muted ml-2">{fm.relationship}</span>
                          {fm.isPrimary && <span className="yc-badge yc-badge-brand text-xs ml-2">主要联系人</span>}
                        </div>
                        <span className="text-xs text-text-muted">{fm.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-text-muted mb-2">标签</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Health Summary */}
            {detailTab === "health" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">健康摘要</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-2">慢性疾病</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.healthSummary.chronicDiseases.length > 0
                        ? selected.healthSummary.chronicDiseases.map((d) => (
                            <span key={d} className="px-2.5 py-1 text-xs rounded-full bg-red-50 text-red-700 border border-red-200">
                              {d}
                            </span>
                          ))
                        : <span className="text-xs text-text-muted">无</span>
                      }
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-2">过敏史</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.healthSummary.allergies.length > 0
                        ? selected.healthSummary.allergies.map((a) => (
                            <span key={a} className="px-2.5 py-1 text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                              {a}
                            </span>
                          ))
                        : <span className="text-xs text-text-muted">无</span>
                      }
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-2">血型</p>
                    <span className="text-sm font-medium text-text-primary">
                      {selected.healthSummary.bloodType ?? "未知"}型
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-2">残疾等级</p>
                    <span className="text-sm font-medium text-text-primary">
                      {selected.healthSummary.disabilityLevel ?? "无"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Medication Records */}
            {detailTab === "medication" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">用药记录</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-text-muted font-medium">药品名称</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">剂量</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">频次</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">开始日期</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">医生</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.healthSummary.currentMedications.map((med, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="py-2.5 px-3 font-medium text-text-primary">{med.name}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{med.dosage}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{med.frequency}</td>
                          <td className="py-2.5 px-3 text-text-muted">{formatDate(med.startDate)}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{med.prescribingDoctor ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selected.healthSummary.currentMedications.length === 0 && (
                    <p className="text-sm text-text-muted text-center py-8">暂无用药记录</p>
                  )}
                </div>
              </div>
            )}

            {/* Visit Records */}
            {detailTab === "visits" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">就诊记录</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-text-muted font-medium">日期</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">医院</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">科室</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">诊断</th>
                        <th className="text-left py-2 px-3 text-text-muted font-medium">医生</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.healthSummary.recentVisits.map((v) => (
                        <tr key={v.id} className="border-b border-border last:border-0">
                          <td className="py-2.5 px-3 text-text-muted">{formatDate(v.date)}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{v.hospital}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{v.department}</td>
                          <td className="py-2.5 px-3 font-medium text-text-primary">{v.diagnosis}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{v.doctor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selected.healthSummary.recentVisits.length === 0 && (
                    <p className="text-sm text-text-muted text-center py-8">暂无就诊记录</p>
                  )}
                </div>
              </div>
            )}

            {/* Risk Flags */}
            {detailTab === "risks" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">风险标记</h3>
                {selected.healthSummary.riskFlags.length > 0 ? (
                  <div className="space-y-3">
                    {selected.healthSummary.riskFlags.map((rf) => (
                      <div key={rf.id} className="p-3 rounded-lg border border-border bg-surface-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={cn("yc-badge", riskLevelColor[rf.level])}>
                              {riskLevelLabel[rf.level]}
                            </span>
                            <span className="yc-badge yc-badge-brand text-xs">
                              {riskTypeLabel[rf.type] ?? rf.type}
                            </span>
                          </div>
                          <span className="text-xs text-text-muted">发现于 {formatDate(rf.detectedAt)}</span>
                        </div>
                        <p className="text-sm text-text-secondary">{rf.description}</p>
                        {rf.resolvedAt && (
                          <p className="text-xs text-success mt-1">已处理：{formatDate(rf.resolvedAt)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShieldAlert className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-muted">暂无风险标记</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
