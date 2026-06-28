export const searchAgingInstitutionTool = {
  name: "search_aging_institution",
  description: "搜索养老机构信息。可按地区、机构类型（养老院/居家护理/社区日照/康复中心）、价格范围等条件过滤。返回机构名称、类型、地址、价格、评分等信息。",
  inputSchema: {
    type: "object",
    properties: {
      region: { type: "string", description: "地区，如 '上海'、'北京朝阳区'" },
      institution_type: { type: "string", enum: ["nursing_home", "home_care_agency", "community_day_care", "rehabilitation_center", "hospice", "assisted_living"], description: "机构类型" },
      max_price: { type: "number", description: "最高月费预算（元）" },
      min_rating: { type: "number", description: "最低评分（0-5）" },
    },
    required: [],
  },
};

export async function executeSearchAgingInstitution(args: Record<string, unknown>) {
  const { region, institution_type, max_price, min_rating } = args as { region?: string; institution_type?: string; max_price?: number; min_rating?: number };

  const institutions = [
    { id: "inst-001", name: "上海和熹颐养院", type: "nursing_home", city: "上海", price: "8000-25000元/月", rating: 4.5, beds: 200, tags: ["高端", "医养结合"] },
    { id: "inst-002", name: "北京椿萱茂养老社区", type: "assisted_living", city: "北京", price: "12000-35000元/月", rating: 4.8, beds: 350, tags: ["高端", "CCRC"] },
    { id: "inst-003", name: "杭州金色年华居家养老服务中心", type: "home_care_agency", city: "杭州", price: "3000-12000元/月", rating: 4.2, beds: 0, tags: ["居家服务", "普惠"] },
    { id: "inst-005", name: "成都晚霞社区日间照料中心", type: "community_day_care", city: "成都", price: "1500-4000元/月", rating: 4.0, beds: 30, tags: ["社区", "普惠"] },
  ];

  let filtered = [...institutions];
  if (region) filtered = filtered.filter((i) => i.city.includes(region) || region.includes(i.city));
  if (institution_type) filtered = filtered.filter((i) => i.type === institution_type);
  if (min_rating) filtered = filtered.filter((i) => i.rating >= min_rating);

  const text = filtered.length > 0
    ? `找到 ${filtered.length} 家养老机构：\n\n${filtered.map((i) => `【${i.name}】\n  类型: ${i.type} | 城市: ${i.city}\n  价格: ${i.price} | 评分: ${i.rating}\n  标签: ${i.tags.join(", ")}`).join("\n\n")}`
    : "未找到符合条件的机构。";

  return { content: [{ type: "text", text }] };
}
