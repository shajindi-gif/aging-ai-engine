// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mockElders, mockCareRecords, mockCareOrders } from "@/lib/mock";
import { MEDICAL_DISCLAIMER } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Heart,
  AlertTriangle,
  Clock,
  Pill,
  Stethoscope,
  FileText,
  Shield,
  Users,
  Activity,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

const careLevelLabels: Record<string, string> = {
  independent: "自理",
  semi_dependent: "半自理",
  dependent: "失能",
  critical: "危重",
};
const careLevelColors: Record<string, string> = {
  independent: "bg-green-50 text-green-700",
  semi_dependent: "bg-brand-50 text-brand-700",
  dependent: "bg-gold-50 text-gold-700",
  critical: "bg-red-50 text-red-700",
};
const riskColors: Record<string, string> = {
  low: "bg-gold-50 text-gold-700",
  medium: "bg-orange-50 text-orange-700",
  high: "bg-red-50 text-red-700",
  critical: "bg-red-100 text-red-800",
};
const riskLabels: Record<string, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
  critical: "危急",
};

const tabList = ["基础信息", "健康档案", "用药管理", "就诊记录", "护理记录", "风险与报告"] as const;

function getAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function ElderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const elders = mockElders ?? [];
  const careRecords = mockCareRecords ?? [];
  const careOrders = mockCareOrders ?? [];

  const elder = elders.find((e: any) => e.id === id);
  const records = careRecords.filter((r: any) => r.elderlyId === id);
  const orders = careOrders.filter((o) => o.elderlyId === id);

  const [activeTab, setActiveTab] = useState<(typeof tabList)[number]>("基础信息");

  if (!elder) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-text-primary">未找到该老人</p>
            <Link href="/elders" className="mt-4 inline-block text-sm text-brand-600 hover:underline">
              返回档案列表
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const age = getAge(elder.birthDate);
  const hs = elder.healthSummary;

  return (
    <>
      <Header />

      {/* Medical Disclaimer */}
      <div className="bg-red-50 border-b border-red-200 py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-red-700 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </div>

      {/* Elder Header */}
      <section className="bg-surface-secondary py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/elders" className="text-sm text-brand-600 hover:underline flex items-center gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" /> 返回档案列表
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-xl font-bold text-brand-700">
              {elder.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">{elder.name}</h1>
                <span className={cn("yc-badge text-xs", careLevelColors[elder.careLevel])}>
                  {careLevelLabels[elder.careLevel]}
                </span>
                <span className="yc-badge bg-silver-100 text-xs">
                  {elder.gender === "male" ? "男" : "女"} · {age}岁
                </span>
                <span className="yc-badge bg-blue-50 text-blue-700 text-xs">
                  {elder.serviceType === "home" ? "居家" : elder.serviceType === "community" ? "社区" : "机构"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{elder.city} {elder.province}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{elder.phone}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />更新于 {elder.updatedAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="yc-badge bg-green-50 text-green-700 flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> 已人工审核
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-surface border-b border-border overflow-x-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 min-w-max">
            {tabList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-text-muted hover:text-text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 基础信息 */}
          {activeTab === "基础信息" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-500" /> 个人信息
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-text-muted">姓名</dt><dd className="text-text-primary">{elder.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-text-muted">性别</dt><dd className="text-text-primary">{elder.gender === "male" ? "男" : "女"}</dd></div>
                  <div className="flex justify-between"><dt className="text-text-muted">出生日期</dt><dd className="text-text-primary">{elder.birthDate} ({age}岁)</dd></div>
                  <div className="flex justify-between"><dt className="text-text-muted">电话</dt><dd className="text-text-primary">{elder.phone}</dd></div>
                  <div className="flex justify-between"><dt className="text-text-muted">地址</dt><dd className="text-text-primary">{elder.address}</dd></div>
                  <div className="flex justify-between"><dt className="text-text-muted">档案创建</dt><dd className="text-text-primary">{elder.createdAt}</dd></div>
                </dl>
              </div>
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-500" /> 紧急联系人
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-text-muted">姓名</dt><dd className="text-text-primary">{elder.emergencyContact.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-text-muted">电话</dt><dd className="text-text-primary">{elder.emergencyContact.phone}</dd></div>
                  <div className="flex justify-between"><dt className="text-text-muted">关系</dt><dd className="text-text-primary">{elder.emergencyContact.relationship}</dd></div>
                </dl>
                <h3 className="text-sm font-semibold text-text-primary mt-6 mb-3">家属列表</h3>
                <div className="space-y-2">
                  {elder.familyMembers.map((fm: any) => (
                    <div key={fm.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{fm.name}</p>
                        <p className="text-xs text-text-muted">{fm.relationship} · {fm.phone}</p>
                      </div>
                      {fm.isPrimary && <span className="yc-badge bg-brand-50 text-brand-700 text-xs">主要联系人</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 健康档案 */}
          {activeTab === "健康档案" && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="yc-card">
                  <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" /> 慢性病
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hs.chronicDiseases.map((d: string) => (
                      <span key={d} className="yc-badge bg-red-50 text-red-700">{d}</span>
                    ))}
                    {hs.chronicDiseases.length === 0 && <p className="text-sm text-text-muted">无</p>}
                  </div>
                </div>
                <div className="yc-card">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">基本信息</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-text-muted">血型</dt><dd className="text-text-primary">{hs.bloodType ?? "未知"}</dd></div>
                    <div className="flex justify-between"><dt className="text-text-muted">失能等级</dt><dd className="text-text-primary">{hs.disabilityLevel ?? "无"}</dd></div>
                    <div className="flex justify-between"><dt className="text-text-muted">过敏</dt><dd className="text-text-primary">{hs.allergies.length > 0 ? hs.allergies.join("、") : "无"}</dd></div>
                  </dl>
                </div>
              </div>
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand-500" /> 慢病指标趋势（模拟数据）
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-text-muted mb-2">血压 (近7天)</p>
                    <div className="flex items-end gap-1.5 h-20">
                      {[128, 135, 130, 142, 138, 132, 130].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-sm bg-brand-500/70" style={{ height: `${(v - 100) * 1.2}px` }} />
                          <span className="text-xs text-text-muted">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-text-muted mb-2">血糖 (近7天, mmol/L)</p>
                    <div className="flex items-end gap-1.5 h-20">
                      {[7.8, 8.2, 7.5, 8.0, 7.2, 7.8, 7.6].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-sm bg-gold-500/70" style={{ height: `${v * 6}px` }} />
                          <span className="text-xs text-text-muted">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 用药管理 */}
          {activeTab === "用药管理" && (
            <div className="yc-card">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Pill className="h-4 w-4 text-brand-500" /> 当前用药
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-text-muted">
                      <th className="pb-2 font-medium">药品名称</th>
                      <th className="pb-2 font-medium">剂量</th>
                      <th className="pb-2 font-medium">频次</th>
                      <th className="pb-2 font-medium">开始日期</th>
                      <th className="pb-2 font-medium">处方医生</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hs.currentMedications.map((med: any, i: number) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2.5 text-text-primary font-medium">{med.name}</td>
                        <td className="py-2.5 text-text-secondary">{med.dosage}</td>
                        <td className="py-2.5 text-text-secondary">{med.frequency}</td>
                        <td className="py-2.5 text-text-muted">{med.startDate}</td>
                        <td className="py-2.5 text-text-muted">{med.prescribingDoctor ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hs.currentMedications.length === 0 && (
                  <p className="text-sm text-text-muted text-center py-6">暂无用药记录</p>
                )}
              </div>
            </div>
          )}

          {/* 就诊记录 */}
          {activeTab === "就诊记录" && (
            <div className="yc-card">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-brand-500" /> 就诊记录
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-text-muted">
                      <th className="pb-2 font-medium">日期</th>
                      <th className="pb-2 font-medium">医院</th>
                      <th className="pb-2 font-medium">科室</th>
                      <th className="pb-2 font-medium">诊断</th>
                      <th className="pb-2 font-medium">医生</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hs.recentVisits.map((v: any) => (
                      <tr key={v.id} className="border-b border-border last:border-0">
                        <td className="py-2.5 text-text-primary">{v.date}</td>
                        <td className="py-2.5 text-text-secondary">{v.hospital}</td>
                        <td className="py-2.5 text-text-secondary">{v.department}</td>
                        <td className="py-2.5 text-text-primary">{v.diagnosis}</td>
                        <td className="py-2.5 text-text-muted">{v.doctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hs.recentVisits.length === 0 && (
                  <p className="text-sm text-text-muted text-center py-6">暂无就诊记录</p>
                )}
              </div>
            </div>
          )}

          {/* 护理记录 */}
          {activeTab === "护理记录" && (
            <div className="yc-card">
              <h3 className="text-sm font-semibold text-text-primary mb-4">护理记录时间线</h3>
              {records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((rec: any) => (
                    <div key={rec.id} className="relative pl-6 border-l-2 border-brand-200">
                      <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-brand-500" />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-text-muted">{rec.createdAt.replace("T", " ")}</span>
                        <span className="yc-badge text-xs bg-brand-50 text-brand-700">{rec.providerName}</span>
                        {rec.riskLevel !== "none" && (
                          <span className={cn("yc-badge text-xs", riskColors[rec.riskLevel])}>
                            {rec.riskLevel === "low" ? "低风险" : rec.riskLevel === "medium" ? "中风险" : "高风险"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{rec.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted text-center py-8">暂无护理记录</p>
              )}
            </div>
          )}

          {/* 风险与报告 */}
          {activeTab === "风险与报告" && (
            <div className="space-y-6">
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" /> 风险事件
                </h3>
                {hs.riskFlags.length > 0 ? (
                  <div className="space-y-3">
                    {hs.riskFlags.map((rf: any) => (
                      <div key={rf.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                        <AlertTriangle className={cn("h-4 w-4 mt-0.5 shrink-0", rf.level === "critical" || rf.level === "high" ? "text-red-500" : "text-gold-500")} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn("yc-badge text-xs", riskColors[rf.level])}>{riskLabels[rf.level]}</span>
                            <span className="text-xs text-text-muted">{rf.type} · {rf.detectedAt}</span>
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">{rf.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">暂无风险标记</p>
                )}
              </div>

              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-500" /> 家属周报（AI 生成示例）
                </h3>
                <div className="rounded-lg border border-border bg-silver-50 p-4 text-sm text-text-secondary space-y-2">
                  <p><strong>老人姓名:</strong> {elder.name}</p>
                  <p><strong>报告周期:</strong> 2024-10-07 ~ 2024-10-13</p>
                  <p><strong>服务次数:</strong> {orders.length} 次</p>
                  <p><strong>健康观察:</strong> 血压稳定在正常范围，血糖偶有偏高。精神状态良好，睡眠质量改善。</p>
                  <p><strong>建议:</strong> 继续当前用药方案，注意控制饮食中碳水化合物摄入。建议下周复查糖化血红蛋白。</p>
                  <p><strong>风险提醒:</strong> {hs.riskFlags.length > 0 ? hs.riskFlags[0].description : "暂无特殊风险"}</p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>人工审核状态: 已审核</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
