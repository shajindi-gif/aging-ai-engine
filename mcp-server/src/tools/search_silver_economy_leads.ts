export const searchSilverEconomyLeadsTool = {
  name: "search_silver_economy_leads",
  description: "搜索银发经济销售线索。可按跟进状态（新/已联系/已确认/方案中/谈判中）、来源类型过滤。返回线索名称、机构、联系人、预估价值等信息。",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"], description: "跟进状态" },
      source: { type: "string", enum: ["policy_scan", "web_crawl", "referral", "exhibition", "cold_call"], description: "线索来源" },
      min_value: { type: "number", description: "最低预估价值（元）" },
      region: { type: "string", description: "地区过滤" },
    },
    required: [],
  },
};

export async function executeSearchSilverEconomyLeads(args: Record<string, unknown>) {
  const { status, source, min_value } = args as { status?: string; source?: string; min_value?: number; region?: string };

  const leads = [
    { id: "lead-001", institution: "成都晚霞社区日间照料中心", contact: "周站长", status: "new", source: "policy_scan", value: 85000, products: ["基础管理系统", "签到打卡"] },
    { id: "lead-002", institution: "杭州金色年华居家养老服务中心", contact: "孙主任", status: "contacted", source: "web_crawl", value: 120000, products: ["排班管理系统", "电子服务记录"] },
    { id: "lead-003", institution: "广州仁爱康复护理中心", contact: "吴主任", status: "qualified", source: "referral", value: 200000, products: ["康复评估系统", "远程康复平台"] },
    { id: "lead-004", institution: "上海和熹颐养院", contact: "赵院长", status: "proposal", source: "exhibition", value: 350000, products: ["AI健康预警", "智能床垫"] },
  ];

  let filtered = [...leads];
  if (status) filtered = filtered.filter((l) => l.status === status);
  if (source) filtered = filtered.filter((l) => l.source === source);
  if (min_value) filtered = filtered.filter((l) => l.value >= min_value);

  const text = filtered.length > 0
    ? `找到 ${filtered.length} 条销售线索：\n\n${filtered.map((l) => `【${l.institution}】\n  联系人: ${l.contact} | 状态: ${l.status} | 来源: ${l.source}\n  预估价值: ¥${l.value.toLocaleString()}\n  产品兴趣: ${l.products.join(", ")}`).join("\n\n")}`
    : "未找到符合条件的线索。";

  return { content: [{ type: "text", text }] };
}
