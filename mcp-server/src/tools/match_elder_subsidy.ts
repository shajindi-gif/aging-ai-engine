export const matchElderSubsidyTool = {
  name: "match_elder_subsidy",
  description: "根据老年人的年龄、省份、护理等级、残疾等级等条件，智能匹配可申请的政策补贴。返回匹配结果包含匹配度评分、预估金额和申请路径。",
  inputSchema: {
    type: "object",
    properties: {
      age: { type: "number", description: "老人年龄" },
      province: { type: "string", description: "省份，如 '北京'、'上海'" },
      care_level: { type: "string", enum: ["independent", "semi_dependent", "dependent", "critical"], description: "护理等级" },
      disability_level: { type: "string", description: "残疾等级" },
      income_level: { type: "string", enum: ["low", "medium", "high"], description: "收入水平" },
    },
    required: ["age", "province"],
  },
};

export async function executeMatchElderSubsidy(args: Record<string, unknown>) {
  const { age, province, care_level, disability_level, income_level } = args as { age: number; province: string; care_level?: string; disability_level?: string; income_level?: string };
  const matches: Array<{ title: string; score: number; reasons: string[]; amount: string; path: string[] }> = [];

  if (age >= 65) matches.push({ title: "高龄老人津贴", score: 0.92, reasons: [`年龄${age}岁符合`], amount: "每月75-1000元", path: ["社区事务受理中心申请"] });
  if (age >= 60 && (care_level === "dependent" || care_level === "critical" || disability_level)) matches.push({ title: "长期护理保险", score: 0.85, reasons: ["护理等级符合失能要求"], amount: "居家照护服务", path: ["社区申请", "失能评估"] });
  if (income_level === "low") matches.push({ title: "经济困难养老服务补贴", score: 0.88, reasons: ["收入水平符合"], amount: "每月200-600元", path: ["村(居)委会申请"] });
  if (age >= 80) matches.push({ title: "老年人意外伤害保险", score: 0.95, reasons: [`年龄${age}岁符合80周岁以上`], amount: "最高赔付5万元", path: ["政府统一投保"] });

  const text = matches.length > 0
    ? `为${age}岁${province}籍老人匹配到 ${matches.length} 项补贴：\n\n${matches.map((m, i) => `${i + 1}. 【${m.title}】\n   匹配度: ${(m.score * 100).toFixed(0)}%\n   匹配原因: ${m.reasons.join(", ")}\n   预估金额: ${m.amount}\n   申请路径: ${m.path.join(" → ")}`).join("\n\n")}\n\n注意：结果仅供参考，以当地主管部门审核为准。`
    : "未找到符合条件的补贴。建议联系当地民政部门咨询。";

  return { content: [{ type: "text", text }] };
}
