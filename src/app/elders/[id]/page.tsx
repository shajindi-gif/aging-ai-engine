// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils/cn";
import { ArrowLeft, Heart, Pill, FileText, AlertTriangle, Users, Phone, MapPin, Calendar, Loader2, AlertCircle, Clock } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { fetchElder } from "@/lib/api";

const careLevelLabels: Record<string, string> = {
  independent: "自理", INDEPENDENT: "自理",
  semi_dependent: "半自理", SEMI_DEPENDENT: "半自理",
  dependent: "失能", DEPENDENT: "失能",
  critical: "危重", CRITICAL: "危重",
};

function getAge(birthDate: string | Date): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function ElderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: elder, loading, error } = useApi<any>(
    () => fetchElder(id),
    [id]
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          <span className="ml-3 text-text-muted">加载老人档案...</span>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !elder) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
          <p className="text-sm text-red-500">{error ?? "未找到该老人档案"}</p>
          <Link href="/elders" className="mt-4 text-sm text-brand-600 hover:underline">返回档案列表</Link>
        </div>
        <Footer />
      </>
    );
  }

  const age = elder.birthDate ? getAge(elder.birthDate) : (elder.age ?? 0);
  const diseases = elder.healthSummary?.chronicDiseases ?? elder.chronicDiseases ?? [];
  const allergies = elder.healthSummary?.allergies ?? [];
  const medications = elder.medications ?? [];
  const visits = elder.visitRecords ?? [];
  const riskFlags = elder.riskFlags ?? [];
  const familyMembers = elder.familyMembers ?? [];
  const emergencyContact = elder.emergencyContact;
  const careOrders = elder.careOrders ?? [];

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/elders" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" /> 返回档案列表
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
              {elder.name?.slice(0, 1)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{elder.name}</h1>
              <p className="text-sm text-text-secondary">
                {elder.gender === "MALE" || elder.gender === "male" ? "男" : "女"} · {age}岁 · {careLevelLabels[elder.careLevel] ?? elder.careLevel}
              </p>
              <p className="text-xs text-text-muted mt-1">
                <MapPin className="inline h-3 w-3" /> {elder.city ?? ""} {elder.province ?? ""} {elder.address ?? ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Health Summary */}
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" /> 健康概况
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">慢性病</p>
                    <div className="flex flex-wrap gap-1.5">
                      {diseases.length > 0 ? diseases.map((d: string) => (
                        <span key={d} className="yc-badge bg-red-50 text-red-700 text-xs">{d}</span>
                      )) : <span className="text-xs text-text-muted">暂无记录</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">过敏史</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allergies.length > 0 ? allergies.map((a: string) => (
                        <span key={a} className="yc-badge bg-gold-50 text-gold-700 text-xs">{a}</span>
                      )) : <span className="text-xs text-text-muted">暂无记录</span>}
                    </div>
                  </div>
                  {elder.healthSummary?.bloodType && (
                    <p className="text-xs text-text-muted">血型: {elder.healthSummary.bloodType}</p>
                  )}
                </div>
              </div>

              {/* Medications */}
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-brand-500" /> 用药记录
                </h3>
                {medications.length > 0 ? (
                  <div className="space-y-2">
                    {medications.map((m: any) => (
                      <div key={m.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{m.name}</p>
                          <p className="text-xs text-text-muted">{m.dosage} · {m.frequency}</p>
                        </div>
                        <span className="text-xs text-text-muted">
                          {m.startDate ? new Date(m.startDate).toLocaleDateString("zh-CN") : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">暂无用药记录</p>
                )}
              </div>

              {/* Visit Records */}
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" /> 就诊记录
                </h3>
                {visits.length > 0 ? (
                  <div className="space-y-3">
                    {visits.slice(0, 5).map((v: any) => (
                      <div key={v.id} className="border-b border-border pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-text-primary">{v.hospital}</p>
                          <span className="text-xs text-text-muted">
                            {v.date ? new Date(v.date).toLocaleDateString("zh-CN") : ""}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">{v.department ?? ""} {v.doctor ? `· ${v.doctor}` : ""}</p>
                        {v.diagnosis && <p className="text-xs text-text-muted mt-1">{v.diagnosis}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">暂无就诊记录</p>
                )}
              </div>

              {/* Risk Flags */}
              {riskFlags.length > 0 && (
                <div className="yc-card border-gold-200">
                  <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gold-600" /> 风险预警
                  </h3>
                  <div className="space-y-2">
                    {riskFlags.map((rf: any) => (
                      <div key={rf.id} className="flex items-start gap-2 border-b border-border pb-2 last:border-0">
                        <span className={cn("yc-badge text-xs shrink-0",
                          (rf.level ?? "").toUpperCase() === "HIGH" ? "bg-red-50 text-red-700" :
                          (rf.level ?? "").toUpperCase() === "CRITICAL" ? "bg-red-100 text-red-800" :
                          "bg-gold-50 text-gold-700"
                        )}>{rf.level ?? rf.type}</span>
                        <div>
                          <p className="text-sm text-text-primary">{rf.description}</p>
                          <p className="text-xs text-text-muted">
                            {rf.detectedAt ? new Date(rf.detectedAt).toLocaleDateString("zh-CN") : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              {emergencyContact && (
                <div className="yc-card">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500" /> 紧急联系人
                  </h3>
                  <p className="text-sm font-medium text-text-primary">{emergencyContact.name}</p>
                  <p className="text-xs text-text-muted">{emergencyContact.relation}</p>
                  <p className="text-sm text-brand-600 mt-1">{emergencyContact.phone}</p>
                </div>
              )}

              {/* Family Members */}
              <div className="yc-card">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-500" /> 家属信息
                </h3>
                {familyMembers.length > 0 ? (
                  <div className="space-y-2">
                    {familyMembers.map((fm: any) => (
                      <div key={fm.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                        <div>
                          <p className="text-sm text-text-primary">{fm.name}</p>
                          <p className="text-xs text-text-muted">{fm.relation} · {fm.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">暂无家属信息</p>
                )}
              </div>

              {/* Recent Care Orders */}
              {careOrders.length > 0 && (
                <div className="yc-card">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold-500" /> 近期服务
                  </h3>
                  <div className="space-y-2">
                    {careOrders.slice(0, 5).map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                        <div>
                          <p className="text-sm text-text-primary">{o.orderNo}</p>
                          <p className="text-xs text-text-muted">{o.caregiverName ?? "待分配"}</p>
                        </div>
                        <span className="text-xs text-text-muted">
                          {o.scheduledAt ? new Date(o.scheduledAt).toLocaleDateString("zh-CN") : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {(elder.tags ?? []).length > 0 && (
                <div className="yc-card">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">标签</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {elder.tags.map((t: string) => (
                      <span key={t} className="yc-badge bg-silver-50 text-text-muted text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
