// ═══════════════════════════════════════════════
// 衍策银龄 AI — Agent 函数库
// 模拟 AI 智能体处理,返回结构化结果
// ═══════════════════════════════════════════════

import { MEDICAL_DISCLAIMER, POLICY_DISCLAIMER } from "@/lib/types";

// ─── Agent 输入输出接口 ───────────────────────────────
export interface AgentInput {
  type: string;
  params: Record<string, unknown>;
}

export interface AgentOutput {
  result: unknown;
  confidence: number;
  sources: string[];
  disclaimer?: string;
  requiresHumanReview: boolean;
}

// ─── 辅助函数 ───────────────────────────────
/** 模拟异步处理延迟 */
function simulateDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 400));
}

// ─── 政策匹配 Agent ───────────────────────────────
/**
 * 根据老人年龄、省份、护理等级等条件匹配适用政策
 */
export async function policyMatchAgent(params: Record<string, unknown>): Promise<AgentOutput> {
  await simulateDelay();

  const { age, province, careLevel, disabilityLevel, specialConditions } = params as {
    age?: number;
    province?: string;
    careLevel?: string;
    disabilityLevel?: string;
    specialConditions?: string[];
  };

  // 模拟政策匹配结果
  const matchedPolicies = [
    {
      policyId: "pol-001",
      policyTitle: "北京市高龄老年人养老服务补贴",
      matchScore: 0.92,
      matchReasons: [
        `年龄${age ?? 80}岁符合80周岁以上要求`,
        `${province ?? "北京"}市户籍`,
        "未享受同类补贴",
      ],
      missingConditions: [] as string[],
      estimatedAmount: "每月500元",
      applicationPath: ["社区居委会申请", "街道办事处审核", "区民政局审批"],
      confidence: 0.88,
    },
    {
      policyId: "pol-004",
      policyTitle: "全国老年人意外伤害保险",
      matchScore: 0.95,
      matchReasons: [`年龄${age ?? 80}岁符合60周岁以上要求`, "全国适用"],
      missingConditions: [] as string[],
      estimatedAmount: "意外身故/伤残最高5万元",
      applicationPath: ["社区统一登记"],
      confidence: 0.93,
    },
  ];

  // 根据护理等级追加匹配
  if (careLevel === "dependent" || careLevel === "critical" || disabilityLevel) {
    matchedPolicies.push({
      policyId: "pol-002",
      policyTitle: "上海市长期护理保险试点办法",
      matchScore: 0.78,
      matchReasons: [`护理等级"${careLevel ?? "重度"}"符合失能要求`, "可获居家照护服务"],
      missingConditions: province !== "上海" ? ["需上海户籍或参保上海医保"] : [] as string[],
      estimatedAmount: "每周3-7小时居家照护",
      applicationPath: ["社区事务受理中心申请", "失能等级评估"],
      confidence: 0.75,
    });
  }

  // 特殊条件追加
  if (specialConditions?.includes("低保") || specialConditions?.includes("低收入")) {
    matchedPolicies.push({
      policyId: "pol-003",
      policyTitle: "广东省经济困难失能老年人护理补贴",
      matchScore: 0.85,
      matchReasons: ["符合经济困难条件", "失能等级满足"],
      missingConditions: province !== "广东" ? ["需广东省户籍"] : [],
      estimatedAmount: "每月200-600元",
      applicationPath: ["村(居)委会申请", "乡镇审核", "县级民政审批"],
      confidence: 0.82,
    });
  }

  return {
    result: {
      matches: matchedPolicies,
      totalMatched: matchedPolicies.length,
      query: { age, province, careLevel, disabilityLevel, specialConditions },
    },
    confidence: 0.85,
    sources: [
      "民政部养老服务政策汇编(2024版)",
      "各省市养老服务条例",
      "国家医疗保障局政策文件",
    ],
    disclaimer: POLICY_DISCLAIMER,
    requiresHumanReview: matchedPolicies.some((p) => p.missingConditions.length > 0),
  };
}

// ─── 健康摘要 Agent ───────────────────────────────
/**
 * 从老人档案生成健康摘要报告
 */
export async function healthSummaryAgent(params: Record<string, unknown>): Promise<AgentOutput> {
  await simulateDelay(800);

  const { elderlyId, elderlyName } = params as { elderlyId?: string; elderlyName?: string };
  const name = elderlyName ?? "王淑芬";

  return {
    result: {
      elderlyId: elderlyId ?? "eld-001",
      elderlyName: name,
      summary: `${name}目前患有高血压、糖尿病两种慢性病,需长期服用氨氯地平、二甲双胍。近半年血压控制良好,血糖稳定。有1次跌倒史,跌倒风险中等。青霉素过敏需特别注意。`,
      keyFindings: [
        { type: "chronic", label: "慢性病管理", detail: "高血压+糖尿病,用药规律,近期控制良好", severity: "medium" },
        { type: "risk", label: "跌倒风险", detail: "近6个月有1次跌倒史,建议居家环境适老化改造", severity: "medium" },
        { type: "allergy", label: "过敏提醒", detail: "青霉素过敏,就医时务必告知", severity: "high" },
        { type: "medication", label: "用药依从性", detail: "用药规律,未发现漏服情况", severity: "low" },
      ],
      recommendations: [
        "建议进行居家适老化改造,降低跌倒风险",
        "每3个月复诊心内科,监测血压变化",
        "保持当前用药方案,注意饮食控制",
        "建议每年进行一次全面体检",
      ],
      nextReviewDate: "2025-03-01",
      generatedAt: new Date().toISOString(),
    },
    confidence: 0.88,
    sources: ["个人健康档案", "近12个月就诊记录", "用药记录", "跌倒事件记录"],
    disclaimer: MEDICAL_DISCLAIMER,
    requiresHumanReview: true,
  };
}

// ─── 服务报告 Agent ───────────────────────────────
/**
 * 基于护理订单记录生成服务报告
 */
export async function serviceReportAgent(params: Record<string, unknown>): Promise<AgentOutput> {
  await simulateDelay(700);

  const { orderId, elderlyName, period } = params as {
    orderId?: string;
    elderlyName?: string;
    period?: string;
  };

  return {
    result: {
      orderId: orderId ?? "ord-001",
      elderlyName: elderlyName ?? "王淑芬",
      period: period ?? "2024年12月",
      overview: {
        totalOrders: 3,
        completedOrders: 2,
        inProgressOrders: 1,
        cancelledOrders: 0,
        totalHours: 8.5,
        totalCost: 810,
      },
      serviceBreakdown: [
        { type: "陪诊", count: 1, hours: 3.5, satisfaction: "满意" },
        { type: "护理", count: 1, hours: 3, satisfaction: "进行中" },
        { type: "陪伴", count: 1, hours: 2, satisfaction: "待执行" },
      ],
      healthTrends: [
        "血压保持稳定,在130/85mmHg范围",
        "用药依从性良好,无漏服记录",
        "精神状态持续改善,社交活跃度提高",
      ],
      riskSummary: {
        totalEvents: 1,
        unresolvedEvents: 0,
        mainRisks: ["跌倒风险(中等)", "多重用药需监测"],
      },
      recommendations: [
        "建议增加康复训练频次",
        "可考虑申请社区日间照料服务",
        "关注冬季呼吸道疾病预防",
      ],
      generatedAt: new Date().toISOString(),
    },
    confidence: 0.91,
    sources: ["护理订单记录", "服务报告", "风险事件日志", "家属反馈"],
    disclaimer: "服务报告基于已有记录自动生成,具体服务质量以护理员实际报告为准。",
    requiresHumanReview: false,
  };
}

// ─── 风险评估 Agent ───────────────────────────────
/**
 * 识别老人潜在风险因素并评估风险等级
 */
export async function riskAssessmentAgent(params: Record<string, unknown>): Promise<AgentOutput> {
  await simulateDelay(900);

  const { elderlyId, elderlyName } = params as { elderlyId?: string; elderlyName?: string };

  return {
    result: {
      elderlyId: elderlyId ?? "eld-002",
      elderlyName: elderlyName ?? "李明远",
      overallRiskLevel: "high",
      riskFactors: [
        {
          category: "跌倒风险",
          level: "high",
          score: 85,
          description: "高龄89岁,合并骨质疏松,行动不便需助行器,近1年有跌倒记录",
          recommendations: [
            "使用助行器行走,避免单独活动",
            "居室安装扶手和防滑垫",
            "定期进行平衡能力训练",
            "骨质疏松专科随访",
          ],
        },
        {
          category: "呼吸风险",
          level: "high",
          score: 78,
          description: "慢阻肺病史,近期有急性加重记录,需长期吸氧",
          recommendations: [
            "备有应急氧气设备",
            "避免呼吸道传染病高发期外出",
            "坚持呼吸康复训练",
            "接种流感和肺炎疫苗",
          ],
        },
        {
          category: "用药风险",
          level: "medium",
          score: 62,
          description: "同时服用多种药物,存在药物交互风险",
          recommendations: [
            "每次就诊携带完整用药清单",
            "定期做药物审查",
            "注意新增药物的交互作用",
          ],
        },
        {
          category: "营养风险",
          level: "low",
          score: 35,
          description: "目前营养状况尚可,但高龄老人需关注营养摄入",
          recommendations: ["定期评估营养状态", "注意蛋白质和钙质补充"],
        },
      ],
      protectiveFactors: [
        "已入住专业养老机构,有24小时护理",
        "家属定期探望,心理状态较好",
        "用药依从性良好",
      ],
      nextAssessmentDate: "2025-01-15",
      generatedAt: new Date().toISOString(),
    },
    confidence: 0.82,
    sources: ["健康档案", "护理记录", "风险事件日志", "就诊记录", "跌倒事件报告"],
    disclaimer: MEDICAL_DISCLAIMER,
    requiresHumanReview: true,
  };
}

// ─── 机构推荐 Agent ───────────────────────────────
/**
 * 根据老人需求推荐合适的养老机构
 */
export async function institutionRecommendAgent(params: Record<string, unknown>): Promise<AgentOutput> {
  await simulateDelay(750);

  const { province, city, careLevel, budget, preferredServices } = params as {
    province?: string;
    city?: string;
    careLevel?: string;
    budget?: number;
    preferredServices?: string[];
  };

  return {
    result: {
      query: { province, city, careLevel, budget, preferredServices },
      recommendations: [
        {
          institutionId: "inst-rec-001",
          name: "北京幸福晚年养护中心",
          type: "nursing_home",
          location: `${province ?? "北京"}市${city ?? "朝阳"}区`,
          priceRange: "6000-12000元/月",
          rating: 4.6,
          occupancyRate: "78%",
          highlights: [
            "配备专业医疗团队,24小时护理",
            "智慧养老系统全覆盖",
            "家属远程视频探视",
            "丰富的康复和文娱活动",
          ],
          matchScore: 0.91,
          matchReasons: [
            `满足${careLevel ?? "半失能"}级别护理需求`,
            "价格在预算范围内",
            "数字化成熟度高",
          ],
          contactPhone: "010-8888-1234",
          address: `${province ?? "北京"}市${city ?? "朝阳"}区幸福路88号`,
        },
        {
          institutionId: "inst-rec-002",
          name: "银龄康养社区",
          type: "assisted_living",
          location: `${province ?? "北京"}市${city ?? "海淀"}区`,
          priceRange: "4500-8000元/月",
          rating: 4.3,
          occupancyRate: "65%",
          highlights: [
            "医养结合模式",
            "社区环境优雅,绿化率高",
            "智能健康监测设备",
          ],
          matchScore: 0.84,
          matchReasons: [
            "社区环境适合半自理老人",
            "有完善的医疗配套",
            "价格较为亲民",
          ],
          contactPhone: "010-6666-5678",
          address: `${province ?? "北京"}市${city ?? "海淀"}区银龄路18号`,
        },
        {
          institutionId: "inst-rec-003",
          name: "夕阳红日间照料中心",
          type: "community_day_care",
          location: `${province ?? "北京"}市${city ?? "西城"}区`,
          priceRange: "2000-4000元/月",
          rating: 4.1,
          occupancyRate: "85%",
          highlights: [
            "社区嵌入式服务",
            "日间照料+居家上门服务",
            "离家近,方便家属探望",
          ],
          matchScore: 0.76,
          matchReasons: [
            "适合不愿离开社区的老人",
            "提供灵活的日间照料方案",
            "社区口碑良好",
          ],
          contactPhone: "010-5555-9012",
          address: `${province ?? "北京"}市${city ?? "西城"}区夕阳红街28号`,
        },
      ],
      totalRecommended: 3,
    },
    confidence: 0.79,
    sources: ["养老机构信息数据库", "用户评价与反馈", "政府公示评级数据", "实地考察报告"],
    disclaimer: "机构推荐结果仅供参考,建议实地考察后再做决定。机构信息可能随时更新,请联系确认最新情况。",
    requiresHumanReview: false,
  };
}

// ─── 家属沟通报告 Agent ───────────────────────────────
/**
 * 生成面向家属的沟通和汇报摘要
 */
export async function familyReportAgent(params: Record<string, unknown>): Promise<AgentOutput> {
  await simulateDelay(650);

  const { elderlyId, elderlyName, period } = params as {
    elderlyId?: string;
    elderlyName?: string;
    period?: string;
  };

  return {
    result: {
      elderlyId: elderlyId ?? "eld-001",
      elderlyName: elderlyName ?? "王淑芬",
      period: period ?? "2024年12月",
      greeting: `尊敬的家属,以下是${elderlyName ?? "王淑芬"}老人的近期照护情况报告。`,
      healthOverview: {
        summary: "老人近期整体健康状况稳定,血压和血糖控制良好。",
        highlights: [
          "12月1日顺利完成心内科复诊,血压130/85mmHg",
          "用药规律,未出现漏服情况",
          "饮食和睡眠状况良好",
        ],
        concerns: [
          "需关注冬季跌倒风险,建议配合进行居家适老化改造",
        ],
      },
      serviceSummary: {
        totalServices: 3,
        completedServices: 2,
        upcomingServices: 1,
        satisfaction: "整体服务满意度良好",
        details: [
          { date: "12月1日", service: "陪同就医(朝阳医院心内科)", result: "顺利完成" },
          { date: "12月10日", service: "日常护理", result: "进行中" },
          { date: "12月15日", service: "社区活动陪伴", result: "待执行" },
        ],
      },
      policyOpportunities: [
        {
          title: "高龄养老服务补贴",
          status: "可申请",
          description: "符合条件,建议尽快到社区居委会提交申请",
          estimatedBenefit: "每月500元补贴券",
        },
        {
          title: "适老化改造补贴",
          status: "可申请",
          description: "有跌倒风险,建议申请居家适老化改造",
          estimatedBenefit: "最高3万元改造补贴",
        },
      ],
      upcomingReminders: [
        { type: "复诊", date: "2025-03-01", detail: "心内科复诊(朝阳医院)" },
        { type: "体检", date: "2025-04-01", detail: "年度全面体检" },
        { type: "政策", date: "尽快", detail: "高龄补贴申请(社区居委会)" },
      ],
      caregiverMessage: "老人精神状态良好,经常参加社区活动。每次服务后都会跟您分享日常。如有任何疑问,请随时联系我们。",
      generatedAt: new Date().toISOString(),
    },
    confidence: 0.9,
    sources: ["护理订单记录", "健康档案", "服务报告", "政策匹配结果"],
    disclaimer: "本报告基于系统记录自动生成,如有疑问请联系您的专属客服或护理员。",
    requiresHumanReview: false,
  };
}

// ─── Agent 路由 ───────────────────────────────
/** 根据 agent 类型分发到对应的处理函数 */
export async function executeAgent(input: AgentInput): Promise<AgentOutput> {
  const { type, params } = input;

  switch (type) {
    case "policy_match":
      return policyMatchAgent(params);
    case "health_summary":
      return healthSummaryAgent(params);
    case "service_report":
      return serviceReportAgent(params);
    case "risk_assessment":
      return riskAssessmentAgent(params);
    case "institution_recommend":
      return institutionRecommendAgent(params);
    case "family_report":
      return familyReportAgent(params);
    default:
      return {
        result: { error: `未知的 Agent 类型: ${type}` },
        confidence: 0,
        sources: [],
        disclaimer: undefined,
        requiresHumanReview: false,
      };
  }
}
