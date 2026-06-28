// @ts-nocheck
// ═══════════════════════════════════════════════
// 衍策银龄 AI — Agent 函数库 v2
// 6 specialized agents with structured mock output
// ═══════════════════════════════════════════════

import { MEDICAL_DISCLAIMER, POLICY_DISCLAIMER } from "@/lib/types";
import { mockPolicies, mockElders, mockInstitutions, mockSalesLeads, mockCareOrders } from "@/lib/mock";

// ─── Shared delay helper ───────────────────────────
function simulateDelay(min = 800, max = 1500): Promise<void> {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════
// 1. policyMatchAgent
// ═══════════════════════════════════════════════════

export interface PolicyMatchInput {
  region?: string;
  age?: number;
  livingStatus?: string;
  careLevel?: string;
  disabilityStatus?: string;
  incomeLevel?: string;
  applicantType?: string;
}

export interface PolicyMatchOutput {
  matchedPolicies: Array<{
    policyId: string;
    policyTitle: string;
    matchScore: number;
    eligibilityReason: string[];
    estimatedBenefit: string;
  }>;
  matchScore: number;
  eligibilityReason: string;
  missingMaterials: string[];
  nextSteps: string[];
  responsibleDepartment: string;
  disclaimer: string;
  confidence: number;
  sources: string[];
  humanReviewRequired: boolean;
}

export async function policyMatchAgent(input: PolicyMatchInput): Promise<PolicyMatchOutput> {
  await simulateDelay();

  const { region, age, livingStatus, careLevel, disabilityStatus, incomeLevel, applicantType } = input;
  const policies = (mockPolicies ?? []) as any[];

  const matchedPolicies: PolicyMatchOutput["matchedPolicies"] = [];

  for (const p of policies) {
    let score = 0.5;
    const reasons: string[] = [];

    if (region && (p.province === region || p.city === region || p.province === "全国")) {
      score += 0.2;
      reasons.push(`适用于${region}地区`);
    }

    if (age) {
      const ageElig = p.eligibility.find((e: string) => e.includes("周岁"));
      const ageMatch = ageElig?.match(/(\d+)/);
      if (ageMatch && age >= parseInt(ageMatch[1])) {
        score += 0.15;
        reasons.push(`年龄${age}岁满足${ageMatch[1]}周岁以上要求`);
      }
    }

    if (careLevel && (careLevel === "dependent" || careLevel === "critical") && p.category === "insurance") {
      score += 0.1;
      reasons.push("护理等级符合失能要求");
    }

    if (incomeLevel === "low" && p.category === "subsidy") {
      score += 0.08;
      reasons.push("收入水平符合补贴条件");
    }

    if (score >= 0.65) {
      matchedPolicies.push({
        policyId: p.id,
        policyTitle: p.title,
        matchScore: Math.min(score, 0.95),
        eligibilityReason: reasons,
        estimatedBenefit: p.benefits,
      });
    }
  }

  matchedPolicies.sort((a, b) => b.matchScore - a.matchScore);

  const topScore = matchedPolicies.length > 0 ? matchedPolicies[0].matchScore : 0;
  const hasMissing = matchedPolicies.length < 3;

  return {
    matchedPolicies: matchedPolicies.slice(0, 5),
    matchScore: topScore,
    eligibilityReason: matchedPolicies.length > 0
      ? `共匹配到 ${matchedPolicies.length} 项适用政策`
      : "暂未找到完全匹配的政策",
    missingMaterials: hasMissing ? ["身份证", "户口本", "收入证明"] : [],
    nextSteps: [
      "准备所需申请材料",
      "前往户籍所在地社区事务受理中心提交申请",
      "等待审核结果（通常15-30个工作日）",
    ],
    responsibleDepartment: region ? `${region}民政局` : "当地民政部门",
    disclaimer: POLICY_DISCLAIMER,
    confidence: 0.85,
    sources: ["民政部养老服务政策汇编(2024版)", "各省市养老服务条例", "国家医疗保障局政策文件"],
    humanReviewRequired: hasMissing,
  };
}

// ═══════════════════════════════════════════════════
// 2. elderReportAgent
// ═══════════════════════════════════════════════════

export interface ElderReportInput {
  elderId: string;
}

export interface ElderReportOutput {
  healthSummary: string;
  recentCareRecords: Array<{ date: string; type: string; summary: string }>;
  medicationReminders: Array<{ medication: string; dosage: string; frequency: string; nextDue: string }>;
  followUpTasks: Array<{ task: string; dueDate: string; priority: string }>;
  riskAlerts: Array<{ type: string; level: string; description: string }>;
  familyFriendlySummary: string;
  humanReviewRequired: boolean;
  medicalDisclaimer: string;
  confidence: number;
  sources: string[];
}

export async function elderReportAgent(input: ElderReportInput): Promise<ElderReportOutput> {
  await simulateDelay(1000, 1500);

  const { elderId } = input;
  const elders = (mockElders ?? []) as any[];
  const elder = elders.find((e) => e.id === elderId) ?? elders[0];
  const orders = (mockCareOrders ?? []) as any[];
  const elderOrders = orders.filter((o) => o.elderlyId === (elder?.id ?? elderId));

  const health = elder?.healthSummary;
  const chronicList = health?.chronicDiseases ?? [];
  const medList = health?.currentMedications ?? [];
  const riskList = health?.riskFlags ?? [];

  const recentCareRecords = elderOrders.slice(0, 5).map((o) => ({
    date: o.scheduledAt?.slice(0, 10) ?? "未知",
    type: o.type,
    summary: o.serviceReport?.summary ?? `${o.type}服务${o.status}`,
  }));

  const medicationReminders = medList.map((m: any) => ({
    medication: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    nextDue: "今日",
  }));

  const followUpTasks: ElderReportOutput["followUpTasks"] = [];
  if (chronicList.length > 0) {
    followUpTasks.push({ task: `${chronicList[0]}复诊`, dueDate: "2周内", priority: "high" });
  }
  followUpTasks.push({ task: "年度全面体检", dueDate: "1个月内", priority: "medium" });

  const riskAlerts = riskList.map((r: any) => ({
    type: r.type,
    level: r.level,
    description: r.description,
  }));

  const hasCritical = riskList.some((r: any) => r.level === "critical" || r.level === "high");

  return {
    healthSummary: `${elder?.name ?? "老人"}目前患有${chronicList.join("、") || "无已知慢性病"}，正在服用${medList.length}种药物。${hasCritical ? "存在高风险因素需密切关注。" : "整体健康状况稳定。"}`,
    recentCareRecords,
    medicationReminders,
    followUpTasks,
    riskAlerts,
    familyFriendlySummary: `${elder?.name ?? "老人"}近期整体状况${hasCritical ? "需要关注" : "良好"}。${chronicList.length > 0 ? `慢性病(${chronicList.join("、")})控制中。` : ""}用药规律，${riskAlerts.length > 0 ? `有${riskAlerts.length}项风险需留意。` : "暂无明显风险。"}建议家属定期探望，保持情感交流。`,
    humanReviewRequired: hasCritical,
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    confidence: 0.88,
    sources: ["个人健康档案", "近12个月就诊记录", "用药记录", "护理服务记录"],
  };
}

// ═══════════════════════════════════════════════════
// 3. institutionProfileAgent
// ═══════════════════════════════════════════════════

export interface InstitutionProfileInput {
  institutionId: string;
}

export interface InstitutionProfileOutput {
  institutionSummary: string;
  institutionType: string;
  serviceTags: string[];
  digitalMaturityScore: number;
  purchaseIntentScore: number;
  suggestedProducts: Array<{ name: string; reason: string; estimatedPrice: number }>;
  salesApproach: string;
  nextContactPlan: { method: string; timing: string; talkingPoints: string[] };
  confidence: number;
  sources: string[];
}

export async function institutionProfileAgent(input: InstitutionProfileInput): Promise<InstitutionProfileOutput> {
  await simulateDelay(800, 1200);

  const { institutionId } = input;
  const institutions = (mockInstitutions ?? []) as any[];
  const inst = institutions.find((i) => i.id === institutionId) ?? institutions[0];

  const dm = inst?.digitalMaturity;
  const dmScore = dm?.score ?? 50;
  const dmLevel = dm?.level ?? "L2";

  // Purchase intent based on digital maturity
  let purchaseIntentScore = 0.5;
  if (dmScore < 40) purchaseIntentScore = 0.85; // low maturity = high need
  else if (dmScore < 60) purchaseIntentScore = 0.75;
  else if (dmScore < 80) purchaseIntentScore = 0.6;
  else purchaseIntentScore = 0.45;

  const suggestedProducts: InstitutionProfileOutput["suggestedProducts"] = [];

  if (dmScore < 40) {
    suggestedProducts.push(
      { name: "基础管理系统", reason: "当前缺乏信息化基础设施", estimatedPrice: 30000 },
      { name: "签到打卡系统", reason: "提高服务记录规范性", estimatedPrice: 8000 },
      { name: "健康监测设备", reason: "基础健康数据采集", estimatedPrice: 15000 }
    );
  } else if (dmScore < 70) {
    suggestedProducts.push(
      { name: "电子服务记录系统", reason: "升级纸质记录为数字化", estimatedPrice: 50000 },
      { name: "家属沟通小程序", reason: "增强家属参与度和满意度", estimatedPrice: 25000 },
      { name: "数据看板", reason: "运营数据可视化管理", estimatedPrice: 40000 }
    );
  } else {
    suggestedProducts.push(
      { name: "AI健康预警系统", reason: "在现有基础上引入智能分析", estimatedPrice: 120000 },
      { name: "远程医疗平台", reason: "扩展医疗服务能力", estimatedPrice: 80000 },
      { name: "数据中台", reason: "整合多源数据提升运营效率", estimatedPrice: 150000 }
    );
  }

  return {
    institutionSummary: `${inst?.name ?? "机构"}是位于${inst?.city ?? "未知"}的${inst?.type === "nursing_home" ? "养老院" : inst?.type === "home_care_agency" ? "居家养老服务机构" : inst?.type === "community_day_care" ? "社区日间照料中心" : inst?.type === "rehabilitation_center" ? "康复中心" : "养老机构"}，拥有${inst?.beds ?? 0}张床位，入住率${((inst?.occupancyRate ?? 0) * 100).toFixed(0)}%。数字化成熟度为${dmLevel}级(${dmScore}分)。`,
    institutionType: inst?.type ?? "unknown",
    serviceTags: inst?.tags ?? [],
    digitalMaturityScore: dmScore,
    purchaseIntentScore,
    suggestedProducts,
    salesApproach: dmScore < 50
      ? "以政策补贴为切入点，强调数字化转型可获得的政府补助，降低决策门槛"
      : dmScore < 75
        ? "展示同行业成功案例，突出投入产出比，建议分期实施方案"
        : "定位高端智能化升级，强调AI和数据驱动的差异化竞争优势",
    nextContactPlan: {
      method: purchaseIntentScore > 0.7 ? "电话+上门拜访" : "邮件发送方案+电话跟进",
      timing: purchaseIntentScore > 0.7 ? "3天内" : "1周内",
      talkingPoints: [
        `针对${dmLevel}级数字化现状的升级方案`,
        `同行业${dmScore < 50 ? "基础数字化" : "智能化升级"}成功案例`,
        `预估投资回报周期和政府补贴资格`,
      ],
    },
    confidence: 0.82,
    sources: ["养老机构信息数据库", "数字化成熟度评估报告", "行业分析数据"],
  };
}

// ═══════════════════════════════════════════════════
// 4. riskAlertAgent
// ═══════════════════════════════════════════════════

export interface RiskAlertInput {
  elderId: string;
}

export interface RiskAlertOutput {
  riskLevel: string;
  riskType: string;
  evidence: Array<{ source: string; finding: string; severity: string; detectedAt: string }>;
  suggestedAction: string;
  familyNotificationDraft: string;
  humanReviewRequired: boolean;
  medicalDisclaimer: string;
  confidence: number;
  sources: string[];
}

export async function riskAlertAgent(input: RiskAlertInput): Promise<RiskAlertOutput> {
  await simulateDelay(1000, 1500);

  const { elderId } = input;
  const elders = (mockElders ?? []) as any[];
  const elder = elders.find((e) => e.id === elderId) ?? elders[0];
  const health = elder?.healthSummary;
  const riskList = health?.riskFlags ?? [];
  const orders = (mockCareOrders ?? []) as any[];
  const elderOrders = orders.filter((o) => o.elderlyId === (elder?.id ?? elderId));
  const riskEvents = elderOrders.flatMap((o) => o.riskEvents ?? []);

  // Determine overall risk level
  const hasCritical = riskList.some((r: any) => r.level === "critical");
  const hasHigh = riskList.some((r: any) => r.level === "high");
  const riskLevel = hasCritical ? "critical" : hasHigh ? "high" : riskList.length > 0 ? "medium" : "low";

  const primaryRisk = riskList[0];
  const riskType = primaryRisk?.type ?? "general";

  const evidence: RiskAlertOutput["evidence"] = riskList.map((r: any) => ({
    source: "风险标记",
    finding: r.description,
    severity: r.level,
    detectedAt: r.detectedAt,
  }));

  for (const ev of riskEvents) {
    evidence.push({
      source: "护理事件",
      finding: ev.description,
      severity: ev.severity,
      detectedAt: ev.occurredAt,
    });
  }

  return {
    riskLevel,
    riskType,
    evidence,
    suggestedAction: riskLevel === "critical"
      ? "建议立即联系家属并安排紧急医疗评估，同时加强日常监测频率"
      : riskLevel === "high"
        ? "建议24小时内安排专科随访，调整护理方案，增加安全预防措施"
        : riskLevel === "medium"
          ? "建议在下次常规服务时重点关注相关风险因素，并更新护理计划"
          : "当前风险较低，维持常规护理和监测即可",
    familyNotificationDraft: `尊敬的家属：${elder?.name ?? "老人"}近期健康评估显示${riskLevel === "critical" || riskLevel === "high" ? "存在需要关注的风险因素" : "整体状况稳定"}。${primaryRisk ? `主要关注点：${primaryRisk.description}` : ""}我们已采取相应的预防和监护措施。如有疑问请随时联系我们。`,
    humanReviewRequired: riskLevel === "critical" || riskLevel === "high",
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    confidence: riskLevel === "critical" ? 0.92 : 0.85,
    sources: ["健康档案", "风险事件日志", "护理记录", "就诊记录"],
  };
}

// ═══════════════════════════════════════════════════
// 5. careSummaryAgent
// ═══════════════════════════════════════════════════

export interface CareSummaryInput {
  careOrderId: string;
}

export interface CareSummaryOutput {
  serviceSummary: string;
  completedTasks: Array<{ task: string; completedAt: string; notes: string }>;
  abnormalEvents: Array<{ event: string; severity: string; resolution: string }>;
  familyMessage: string;
  nextServiceSuggestion: { type: string; reason: string; suggestedDate: string };
  humanReviewRequired: boolean;
  confidence: number;
  sources: string[];
}

export async function careSummaryAgent(input: CareSummaryInput): Promise<CareSummaryOutput> {
  await simulateDelay(800, 1200);

  const { careOrderId } = input;
  const orders = (mockCareOrders ?? []) as any[];
  const order = orders.find((o) => o.id === careOrderId) ?? orders[0];

  const report = order?.serviceReport;
  const riskEvents = order?.riskEvents ?? [];

  const completedTasks: CareSummaryOutput["completedTasks"] = [];
  if (report) {
    completedTasks.push({
      task: order?.type === "escort" ? "陪同就医" : order?.type === "nursing" ? "居家护理" : order?.type === "bathing" ? "助浴服务" : "护理服务",
      completedAt: order?.completedAt ?? order?.scheduledAt ?? "未知",
      notes: report.summary,
    });
    for (const obs of report.healthObservations ?? []) {
      completedTasks.push({
        task: `健康观察: ${obs}`,
        completedAt: report.submittedAt,
        notes: "护理员记录",
      });
    }
  }

  const abnormalEvents = riskEvents.map((ev: any) => ({
    event: ev.description,
    severity: ev.severity,
    resolution: ev.resolution ?? "已处理",
  }));

  const hasAbnormal = abnormalEvents.length > 0;

  return {
    serviceSummary: report
      ? report.summary
      : `${order?.elderlyName ?? "老人"}的${order?.type ?? "护理"}服务${order?.status === "completed" ? "已顺利完成" : "正在进行中"}。`,
    completedTasks,
    abnormalEvents,
    familyMessage: `尊敬的家属：${order?.elderlyName ?? "老人"}今日${order?.type === "escort" ? "陪同就医" : order?.type === "nursing" ? "居家护理" : "护理服务"}${order?.status === "completed" ? "已顺利完成" : "正在进行"}。${report ? `服务摘要：${report.summary}` : ""}${hasAbnormal ? `\n需要关注：${abnormalEvents.map((e: { event: string }) => e.event).join("；")}` : ""}${report?.recommendations?.length ? `\n建议：${report.recommendations.join("；")}` : ""}`,
    nextServiceSuggestion: {
      type: report?.recommendations?.[0] ? "follow_up" : "routine",
      reason: report?.recommendations?.[0] ?? "按计划继续常规服务",
      suggestedDate: "1-2周内",
    },
    humanReviewRequired: hasAbnormal,
    confidence: 0.9,
    sources: ["护理订单记录", "服务报告", "风险事件日志"],
  };
}

// ═══════════════════════════════════════════════════
// 6. salesFollowupAgent
// ═══════════════════════════════════════════════════

export interface SalesFollowupInput {
  leadId: string;
}

export interface SalesFollowupOutput {
  leadSummary: string;
  painPoints: Array<{ point: string; urgency: string; evidence: string }>;
  recommendedOffer: { productName: string; price: number; discount: string; bundle: string[] };
  firstMessageDraft: string;
  followupSteps: Array<{ step: number; action: string; timing: string; channel: string }>;
  confidence: number;
  sources: string[];
}

export async function salesFollowupAgent(input: SalesFollowupInput): Promise<SalesFollowupOutput> {
  await simulateDelay(800, 1200);

  const { leadId } = input;
  const leads = (mockSalesLeads ?? []) as any[];
  const lead = leads.find((l) => l.id === leadId) ?? leads[0];
  const institutions = (mockInstitutions ?? []) as any[];
  const inst = institutions.find((i) => i.id === lead?.institutionId);

  const dmScore = inst?.digitalMaturity?.score ?? 50;
  const productInterest = lead?.productInterest ?? [];

  const painPoints: SalesFollowupOutput["painPoints"] = [];

  if (dmScore < 40) {
    painPoints.push({ point: "信息化基础薄弱", urgency: "high", evidence: `数字化成熟度仅${dmScore}分(L1级)` });
    painPoints.push({ point: "服务记录依赖纸质", urgency: "medium", evidence: "缺少电子服务记录系统" });
  } else if (dmScore < 70) {
    painPoints.push({ point: "数据管理不规范", urgency: "medium", evidence: `数据管理维度仅${inst?.digitalMaturity?.dimensions?.dataManagement ?? 40}分` });
    painPoints.push({ point: "家属沟通渠道有限", urgency: "medium", evidence: `家属互动维度${inst?.digitalMaturity?.dimensions?.familyEngagement ?? 50}分` });
  } else {
    painPoints.push({ point: "需要AI赋能提升服务品质", urgency: "low", evidence: "已有较好基础，需智能化升级" });
  }

  const mainProduct = productInterest[0] ?? "智慧养老管理系统";

  return {
    leadSummary: `${lead?.institutionName ?? "机构"}（联系人：${lead?.contactName ?? "未知"}，${lead?.contactRole ?? "负责人"}），来源：${lead?.source ?? "未知"}，当前状态：${lead?.status ?? "new"}，预估价值：¥${(lead?.estimatedValue ?? 0).toLocaleString()}。${lead?.notes ?? ""}`,
    painPoints,
    recommendedOffer: {
      productName: mainProduct,
      price: lead?.estimatedValue ?? 50000,
      discount: lead?.status === "negotiation" ? "签约优惠10%" : "首年9折",
      bundle: productInterest.length > 1 ? productInterest.slice(1) : ["免费培训", "3个月技术支持"],
    },
    firstMessageDraft: `${lead?.contactName ?? "您"}您好！我是衍策银龄的顾问。注意到贵机构在${painPoints[0]?.point ?? "数字化建设"}方面有提升空间，我们有一套针对${inst?.type === "community_day_care" ? "社区日间照料" : inst?.type === "home_care_agency" ? "居家养老服务" : "养老机构"}的解决方案，已帮助多家同类机构提升服务效率。方便的话我们可以安排一次15分钟的线上演示，您看这周哪天方便？`,
    followupSteps: [
      { step: 1, action: "发送产品介绍资料和成功案例", timing: "立即", channel: "邮件/微信" },
      { step: 2, action: "电话跟进确认是否已阅读资料", timing: "2天后", channel: "电话" },
      { step: 3, action: "安排线上/线下产品演示", timing: "1周内", channel: "视频会议/上门" },
      { step: 4, action: "发送定制化方案和报价", timing: "演示后2天内", channel: "邮件" },
      { step: 5, action: "商务谈判和签约", timing: "方案确认后1周内", channel: "面谈" },
    ],
    confidence: 0.8,
    sources: ["CRM线索数据", "机构画像分析", "行业对标数据"],
  };
}
