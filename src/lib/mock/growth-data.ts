// 衍策银龄 AI — 增长数据（定价/信任/SEO资源）

export interface PricingPlan {
  id: string; name: string; price: string; period: string;
  description: string; targetCustomer: string;
  features: string[]; highlighted: boolean;
}

export const mockPricingPlans: PricingPlan[] = [
  { id: "plan-1", name: "免费体验版", price: "免费", period: "", description: "适合初次体验和评估", targetCustomer: "个人用户、创业大赛、客户演示",
    features: ["2个免费工具(补贴初筛+家属报告)","政策数据库查询","每月3次AI工具使用","基础模板库"], highlighted: false },
  { id: "plan-2", name: "小团队版", price: "¥980", period: "/月", description: "适合陪诊公司和护理服务团队", targetCustomer: "陪诊公司、护理团队",
    features: ["全部免费工具无限制","老人档案管理(100人)","订单管理(500单/月)","服务记录和家属通知","15个专业模板","邮件支持"], highlighted: false },
  { id: "plan-3", name: "专业版", price: "¥2,980", period: "/月", description: "适合养老机构和社区服务站", targetCustomer: "养老机构、社区服务站",
    features: ["小团队版全部功能","多人协作(10账号)","风险事件管理","运营日报/周报","政策匹配Agent","全部35个模板","电话+微信支持"], highlighted: true },
  { id: "plan-4", name: "数据库订阅版", price: "¥5,800", period: "/月", description: "适合适老化企业和智慧养老企业", targetCustomer: "适老化企业、智慧养老企业、产业研究机构",
    features: ["全量政策数据库(API)","机构线索库(全量)","销售线索管理","API调用(10万次/月)","数据导出","专属客户经理"], highlighted: false },
  { id: "plan-5", name: "园区/街道定制版", price: "联系我们", period: "", description: "适合政府、园区、街道和产业平台", targetCustomer: "政府部门、产业园区",
    features: ["区域政策库定制","服务监管平台","数据看板定制","机构画像批量分析","本地化部署","专属技术团队","SLA保障"], highlighted: false },
];

export interface TrustItem {
  id: string; title: string; description: string; category: "medical" | "privacy" | "security" | "compliance";
}

export const mockTrustItems: TrustItem[] = [
  { id: "trust-1", title: "不替代医生诊断", description: "本系统不输出任何医疗诊断或治疗建议。所有健康相关功能仅用于信息整理、服务记录和风险提示。", category: "medical" },
  { id: "trust-2", title: "人工复核机制", description: "AI生成的健康报告、风险评估和政策匹配结果，均支持人工复核。高风险结果强制要求专业人员确认。", category: "medical" },
  { id: "trust-3", title: "医疗边界声明", description: "所有健康相关页面均展示医疗边界声明：本系统仅用于健康信息整理、服务记录和风险提示，不替代医生诊断、治疗建议或医疗决策。", category: "medical" },
  { id: "trust-4", title: "用户授权同意", description: "老人健康数据仅在用户明确授权后采集和使用。授权可随时撤回，数据可按要求导出或删除。", category: "privacy" },
  { id: "trust-5", title: "数据最小化原则", description: "仅采集提供服务所必需的最少数据。不收集与服务无关的个人隐私信息。", category: "privacy" },
  { id: "trust-6", title: "数据不用于营销", description: "老人健康数据和家庭信息绝不用于商业营销、广告投放或第三方数据交易。", category: "privacy" },
  { id: "trust-7", title: "数据脱敏处理", description: "在数据分析、展示和AI模型训练过程中，自动对个人身份信息（姓名、手机号、身份证号等）进行脱敏处理。", category: "security" },
  { id: "trust-8", title: "企业级权限管理", description: "支持按角色（管理员/护理员/家属/访客）设置数据访问权限，确保最小权限原则。", category: "security" },
  { id: "trust-9", title: "审计日志", description: "记录所有数据访问和操作日志，支持追溯查询谁在什么时候访问了哪些数据。", category: "security" },
  { id: "trust-10", title: "数据导出和删除", description: "用户可随时导出全部数据（JSON/PDF格式）。账户注销后，个人数据在30天内完全删除。", category: "security" },
  { id: "trust-11", title: "政策匹配免责声明", description: "政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。", category: "compliance" },
  { id: "trust-12", title: "AI置信度透明", description: "所有AI Agent输出均附带置信度评分和推理依据，低于阈值的结果自动标记为需人工复核。", category: "compliance" },
];

export interface SEOPage {
  slug: string; title: string; description: string; category: string;
}

export const mockSEOPages: SEOPage[] = [
  { slug: "aging-policy-database", title: "中国养老政策数据库", description: "收录全国及各省市养老政策，涵盖高龄津贴、长护险、适老化改造、社区助餐等10大类政策。", category: "policy" },
  { slug: "city-aging-policy", title: "城市养老政策专题", description: "按城市查询养老政策，覆盖上海、北京、深圳等12个主要城市的高龄津贴、长护险、适老化改造政策。", category: "policy" },
  { slug: "long-term-care-insurance", title: "长期护理保险专题", description: "了解中国长期护理保险制度：试点城市、申请条件、评估标准、服务内容和补贴标准。", category: "policy" },
  { slug: "home-care", title: "社区居家养老专题", description: "社区居家养老服务指南：日间照料、上门服务、助餐助浴、康复护理、文化娱乐。", category: "service" },
  { slug: "medical-companion", title: "陪诊服务专题", description: "陪诊服务行业指南：如何选择陪诊服务、陪诊流程、费用参考、服务标准。", category: "service" },
  { slug: "elder-care-saas", title: "养老SaaS专题", description: "养老服务SaaS平台选型指南：功能对比、适用场景、价格参考、集成方案。", category: "product" },
  { slug: "silver-economy", title: "银发经济专题", description: "中国银发经济产业分析：市场规模、细分领域、政策趋势、投资机会。", category: "industry" },
  { slug: "aging-modification", title: "适老化改造专题", description: "居家适老化改造指南：改造项目、补贴申请、产品选择、施工流程、验收标准。", category: "service" },
  { slug: "nursing-care", title: "护理服务专题", description: "老年护理服务指南：护理等级、服务标准、护理员资质、费用参考。", category: "service" },
  { slug: "elder-family-guide", title: "子女照护父母指南", description: "为中青年子女准备的父母照护实用指南：健康评估、服务选择、补贴申请、远程照护。", category: "guide" },
];
