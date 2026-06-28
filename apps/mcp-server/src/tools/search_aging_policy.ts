export const searchAgingPolicyTool = {
  name: "search_aging_policy",
  description: "搜索养老相关政策。可按关键词、类别（补贴/保险/服务/住房/医疗）、省份进行过滤查询。返回政策标题、摘要、申请条件等结构化信息。",
  inputSchema: {
    type: "object",
    properties: {
      keyword: { type: "string", description: "搜索关键词，如 '高龄补贴'、'长护险'、'适老化'" },
      category: { type: "string", enum: ["subsidy", "insurance", "service", "housing", "medical"], description: "政策类别" },
      province: { type: "string", description: "省份，如 '北京'、'上海'、'广东'" },
    },
    required: [],
  },
};

export async function executeSearchAgingPolicy(args: Record<string, unknown>) {
  const { keyword, category, province } = args as { keyword?: string; category?: string; province?: string };
  const policies = [
    { id: "pol-001", title: "上海市高龄老人津贴发放办法", category: "subsidy", province: "上海", summary: "对65周岁以上老年人按年龄段发放高龄津贴，65-69岁每月75元至100岁以上每月1000元。", eligibility: ["本市户籍", "年满65周岁"], benefits: "按月发放高龄津贴", contactPhone: "021-12345" },
    { id: "pol-002", title: "长期护理保险试点办法（上海）", category: "insurance", province: "上海", summary: "为失能老人提供基本生活照料和医疗护理服务，基金支付约90%。", eligibility: ["本市医保参保人员", "年满60周岁", "失能评估2级以上"], benefits: "居家护理每周3-5次，基金支付约90%", contactPhone: "021-12393" },
    { id: "pol-003", title: "北京市老年人养老服务补贴津贴管理办法", category: "subsidy", province: "北京", summary: "向经济困难、重度残疾、失能老年人发放养老服务补贴。", eligibility: ["本市户籍", "年满60周岁", "低保或低收入"], benefits: "每月200-600元养老服务补贴", contactPhone: "010-12345" },
    { id: "pol-006", title: "老年慢性病门诊特殊病种报销政策", category: "medical", province: "浙江", summary: "将12种老年常见慢性病纳入门诊特殊病种管理，报销比例提高至85%-92%。", eligibility: ["本省医保参保人员", "确诊规定慢性病"], benefits: "门诊报销比例85%-92%", contactPhone: "0571-12345" },
  ];

  let filtered = [...policies];
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (province) filtered = filtered.filter((p) => p.province === province || p.province === "全国");
  if (keyword) { const kw = keyword.toLowerCase(); filtered = filtered.filter((p) => p.title.includes(kw) || p.summary.includes(kw)); }

  const text = filtered.length > 0
    ? `找到 ${filtered.length} 条相关政策：\n\n${filtered.map((p) => `【${p.title}】\n  类别: ${p.category} | 省份: ${p.province}\n  摘要: ${p.summary}\n  申请条件: ${p.eligibility.join(", ")}\n  福利: ${p.benefits}\n  咨询电话: ${p.contactPhone}`).join("\n\n")}`
    : "未找到符合条件的政策。";

  return { content: [{ type: "text", text }] };
}
