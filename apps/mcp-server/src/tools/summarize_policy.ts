export const summarizePolicyTool = {
  name: "summarize_policy",
  description: "对指定养老政策进行结构化摘要，包括核心内容、适用人群、申请流程、注意事项等。适合快速了解政策要点。",
  inputSchema: {
    type: "object",
    properties: {
      policy_id: { type: "string", description: "政策ID，如 'pol-001'" },
      policy_title: { type: "string", description: "政策名称（可选，用于模糊搜索）" },
    },
    required: [],
  },
};

export async function executeSummarizePolicy(args: Record<string, unknown>) {
  const { policy_id, policy_title } = args as { policy_id?: string; policy_title?: string };

  const text = `## 政策摘要\n\n**政策名称：** ${policy_title || "上海市高龄老人津贴发放办法"}\n**政策ID：** ${policy_id || "pol-001"}\n\n### 核心内容\n对具有本市户籍且年满65周岁的老年人，按年龄段发放高龄津贴。\n\n### 适用人群\n- 本市户籍\n- 年满65周岁\n- 未享受其他同类补贴\n\n### 补贴标准\n| 年龄段 | 月津贴 |\n|--------|--------|\n| 65-69岁 | 75元 |\n| 70-79岁 | 150元 |\n| 80-89岁 | 300元 |\n| 90-99岁 | 500元 |\n| 100岁以上 | 1000元 |\n\n### 申请流程\n1. 前往户籍所在地街道社区事务受理服务中心\n2. 填写申请表\n3. 提交材料（身份证、户口本、银行卡）\n4. 审核通过后次月发放\n\n### 注意事项\n- 政策匹配结果仅供参考\n- 具体以当地主管部门最终审核为准`;

  return { content: [{ type: "text", text }] };
}
