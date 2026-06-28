export const profileAgingInstitutionTool = {
  name: "profile_aging_institution",
  description: "生成养老机构的详细画像报告，包括数字化成熟度评估、采购意向分析、推荐产品方案、销售策略等。用于B2B销售场景。",
  inputSchema: {
    type: "object",
    properties: {
      institution_id: { type: "string", description: "机构ID，如 'inst-001'" },
    },
    required: ["institution_id"],
  },
};

export async function executeProfileAgingInstitution(args: Record<string, unknown>) {
  const { institution_id } = args as { institution_id: string };

  const text = `## 机构画像报告\n\n**机构ID：** ${institution_id}\n\n### 基本信息\n- **名称：** 上海和熹颐养院\n- **类型：** 养老院\n- **床位数：** 200张\n- **入住率：** 85%\n- **评分：** 4.5/5\n\n### 数字化成熟度评估\n- **总分：** 72分（L3级）\n- 信息系统: 80分\n- 数据管理: 65分\n- 服务数字化: 75分\n- 员工技术采纳: 68分\n- 家属互动: 70分\n\n### 采购意向分析\n- **采购意向评分：** 0.60（中等偏高）\n- **核心痛点：** 家属沟通渠道待升级、数据管理需规范\n\n### 推荐产品\n1. 家属端APP升级 — ¥80,000\n2. 智能床垫监测系统 — ¥120,000\n3. 电子健康档案系统 — ¥60,000\n\n### 建议销售策略\n展示同行业成功案例，强调投入产出比。建议分期实施方案，降低决策门槛。\n\n### 下一步计划\n- 方式：电话+上门拜访\n- 时间：1周内\n- 重点：针对L3级数字化现状的升级方案`;

  return { content: [{ type: "text", text }] };
}
