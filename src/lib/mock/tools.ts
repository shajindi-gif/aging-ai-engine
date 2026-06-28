// 衍策银龄 AI — 免费工具 Mock 数据
export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "policy" | "care" | "health" | "sales" | "operations";
  inputFields: { key: string; label: string; type: "text" | "select" | "number" | "textarea"; placeholder?: string; options?: string[] }[];
  seoTitle: string;
  relatedTools: string[];
}

export const mockTools: Tool[] = [
  { id: "tool-1", slug: "subsidy-checker", name: "养老补贴资格初筛工具", description: "输入老人基本信息，快速初筛可能符合的养老补贴政策", category: "policy",
    seoTitle: "养老补贴资格初筛 — 免费查询可申请的高龄津贴、长护险、适老化改造补贴",
    inputFields: [
      { key: "city", label: "所在城市", type: "select", options: ["上海","北京","深圳","杭州","苏州","广州","成都","武汉","南京","天津","重庆","西安"] },
      { key: "age", label: "老人年龄", type: "number", placeholder: "如：75" },
      { key: "livingStatus", label: "居住状态", type: "select", options: ["独居","与配偶同住","与子女同住","养老机构"] },
      { key: "careLevel", label: "照护等级", type: "select", options: ["自理","半失能","失能","重症护理"] },
      { key: "chronicDiseases", label: "慢病情况", type: "text", placeholder: "如：高血压、糖尿病" },
      { key: "income", label: "家庭月收入(元)", type: "number", placeholder: "如：8000" },
    ],
    relatedTools: ["policy-materials-generator", "elder-risk-check"],
  },
  { id: "tool-2", slug: "family-care-report", name: "家属照护报告生成器", description: "根据近期护理记录和健康数据，一键生成家属周报/月报", category: "care",
    seoTitle: "家属照护报告生成器 — 自动生成老人健康周报，让子女安心",
    inputFields: [
      { key: "elderName", label: "老人姓名", type: "text", placeholder: "如：张大爷" },
      { key: "period", label: "报告周期", type: "select", options: ["本周","本月","近三个月"] },
      { key: "healthSummary", label: "近期健康状况", type: "textarea", placeholder: "如：血压稳定，血糖偏高，上周就诊一次" },
      { key: "careActivities", label: "护理服务内容", type: "textarea", placeholder: "如：陪诊2次，上门护理3次，用药提醒每日" },
      { key: "riskEvents", label: "风险事件(如有)", type: "text", placeholder: "如：上周跌倒1次，已处理" },
    ],
    relatedTools: ["medical-companion-summary", "care-plan-generator"],
  },
  { id: "tool-3", slug: "medical-companion-summary", name: "陪诊记录总结器", description: "将就诊信息快速结构化为标准陪诊记录", category: "care",
    seoTitle: "陪诊记录总结器 — 一键生成结构化陪诊报告",
    inputFields: [
      { key: "hospitalName", label: "就诊医院", type: "text", placeholder: "如：上海瑞金医院" },
      { key: "department", label: "就诊科室", type: "text", placeholder: "如：心内科" },
      { key: "diagnosis", label: "诊断结果", type: "textarea", placeholder: "如：高血压二级，建议调药" },
      { key: "prescription", label: "处方用药", type: "textarea", placeholder: "如：氨氯地平5mg qd" },
      { key: "followUp", label: "复诊安排", type: "text", placeholder: "如：2周后复查" },
    ],
    relatedTools: ["family-care-report", "follow-up-reminder"],
  },
  { id: "tool-4", slug: "care-plan-generator", name: "居家照护计划生成器", description: "根据老人情况生成个性化居家照护方案", category: "care",
    seoTitle: "居家照护计划生成器 — AI定制老人居家护理方案",
    inputFields: [
      { key: "elderAge", label: "老人年龄", type: "number", placeholder: "如：80" },
      { key: "careLevel", label: "照护等级", type: "select", options: ["自理","半失能","失能"] },
      { key: "chronicDiseases", label: "慢病情况", type: "text", placeholder: "如：高血压、糖尿病" },
      { key: "livingEnv", label: "居住环境", type: "select", options: ["有电梯","无电梯","一楼","农村"] },
      { key: "familySupport", label: "家庭支持情况", type: "select", options: ["子女同住","子女同城","子女异地","独居"] },
    ],
    relatedTools: ["home-aging-modification-checklist", "medication-reminder-plan"],
  },
  { id: "tool-5", slug: "medication-reminder-plan", name: "用药提醒计划生成器", description: "根据用药方案生成智能提醒时间表", category: "health",
    seoTitle: "用药提醒计划生成器 — 智能老人用药管理",
    inputFields: [
      { key: "medications", label: "药物清单", type: "textarea", placeholder: "如：氨氯地平5mg 早饭后\n二甲双胍500mg 早中晚" },
      { key: "specialNotes", label: "特殊注意事项", type: "text", placeholder: "如：需要空腹服用、不可与牛奶同服" },
    ],
    relatedTools: ["care-plan-generator", "follow-up-reminder"],
  },
  { id: "tool-6", slug: "follow-up-reminder", name: "复诊提醒生成器", description: "根据就诊记录自动生成复诊提醒和待办事项", category: "health",
    seoTitle: "复诊提醒生成器 — 不再错过重要复诊",
    inputFields: [
      { key: "visitDate", label: "上次就诊日期", type: "text", placeholder: "如：2026-06-15" },
      { key: "followUpDays", label: "复诊间隔(天)", type: "number", placeholder: "如：14" },
      { key: "hospital", label: "就诊医院", type: "text", placeholder: "如：上海中山医院" },
      { key: "department", label: "就诊科室", type: "text", placeholder: "如：内分泌科" },
    ],
    relatedTools: ["medical-companion-summary", "medication-reminder-plan"],
  },
  { id: "tool-7", slug: "elder-risk-check", name: "老人照护风险初筛工具", description: "评估老人当前照护风险等级，提供改善建议", category: "health",
    seoTitle: "老人照护风险初筛 — 免费评估居家养老安全风险",
    inputFields: [
      { key: "age", label: "老人年龄", type: "number", placeholder: "如：82" },
      { key: "livingStatus", label: "居住状态", type: "select", options: ["独居","与配偶同住","与子女同住","养老机构"] },
      { key: "fallHistory", label: "近半年跌倒次数", type: "number", placeholder: "如：1" },
      { key: "medications", label: "每日用药数量", type: "number", placeholder: "如：5" },
      { key: "cognitiveStatus", label: "认知状态", type: "select", options: ["正常","轻度下降","明显下降","已确诊痴呆"] },
    ],
    relatedTools: ["subsidy-checker", "care-plan-generator"],
  },
  { id: "tool-8", slug: "home-aging-modification-checklist", name: "适老化改造清单生成器", description: "根据居住环境生成适老化改造建议和预算参考", category: "care",
    seoTitle: "适老化改造清单生成器 — 居家养老改造方案一键生成",
    inputFields: [
      { key: "houseType", label: "房屋类型", type: "select", options: ["一居室","二居室","三居室及以上","农村自建房"] },
      { key: "floor", label: "楼层", type: "select", options: ["一楼","低层(2-6)","高层(7+)","有电梯","无电梯"] },
      { key: "elderMobility", label: "老人行动能力", type: "select", options: ["正常","需拐杖","需轮椅","长期卧床"] },
      { key: "budget", label: "预算范围", type: "select", options: ["5000以内","5000-20000","20000-50000","50000以上"] },
    ],
    relatedTools: ["care-plan-generator", "subsidy-checker"],
  },
  { id: "tool-9", slug: "nursing-home-lead-score", name: "养老机构线索评分工具", description: "快速评估养老机构的数字化成熟度和采购意向", category: "sales",
    seoTitle: "养老机构线索评分工具 — 快速评估B2B销售线索",
    inputFields: [
      { key: "institutionType", label: "机构类型", type: "select", options: ["养老院","护理院","康复中心","社区服务站","日间照料","陪诊公司"] },
      { key: "bedCount", label: "床位数", type: "number", placeholder: "如：100" },
      { key: "hasSystem", label: "是否有信息系统", type: "select", options: ["无","Excel管理","简单SaaS","专业系统"] },
      { key: "staffCount", label: "员工数量", type: "number", placeholder: "如：30" },
    ],
    relatedTools: ["policy-materials-generator"],
  },
  { id: "tool-10", slug: "policy-materials-generator", name: "政策申报材料清单生成器", description: "根据目标政策生成所需申报材料清单", category: "policy",
    seoTitle: "政策申报材料清单生成器 — 一键了解补贴申请所需材料",
    inputFields: [
      { key: "policyType", label: "政策类型", type: "select", options: ["高龄津贴","长期护理保险","适老化改造","社区助餐","居家养老服务","失能老人照护","养老机构补贴"] },
      { key: "city", label: "所在城市", type: "select", options: ["上海","北京","深圳","杭州","苏州","广州","成都","武汉","南京"] },
      { key: "applicantType", label: "申请主体", type: "select", options: ["个人/家属","养老机构","社区服务站"] },
    ],
    relatedTools: ["subsidy-checker", "nursing-home-lead-score"],
  },
];
