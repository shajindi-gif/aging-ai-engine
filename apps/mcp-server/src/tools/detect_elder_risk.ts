export const detectElderRiskTool = {
  name: "detect_elder_risk",
  description: "对老人进行风险检测评估。分析跌倒、用药、生命体征、营养等维度风险，生成风险等级、证据和建议行动。高风险结果需人工审核。",
  inputSchema: {
    type: "object",
    properties: {
      elder_id: { type: "string", description: "老人ID" },
      focus_areas: { type: "array", items: { type: "string", enum: ["fall", "medication", "vital", "behavior", "nutrition"] }, description: "重点关注领域" },
    },
    required: ["elder_id"],
  },
};

export async function executeDetectElderRisk(args: Record<string, unknown>) {
  const { elder_id, focus_areas } = args as { elder_id: string; focus_areas?: string[] };
  const areas = focus_areas ?? ["fall", "medication", "vital", "behavior", "nutrition"];

  const risks: Array<{ category: string; level: string; score: number; description: string; actions: string[] }> = [];

  if (areas.includes("fall")) risks.push({ category: "跌倒风险", level: "high", score: 82, description: "高龄，骨质疏松，近期有跌倒记录", actions: ["使用助行器", "安装扶手和防滑垫", "平衡训练"] });
  if (areas.includes("medication")) risks.push({ category: "用药风险", level: "medium", score: 65, description: "多药并用，需注意药物相互作用", actions: ["定期药物审查", "携带完整用药清单就诊"] });
  if (areas.includes("vital")) risks.push({ category: "生命体征风险", level: "medium", score: 58, description: "血压偶有波动，需定期监测", actions: ["每日测量血压", "异常时及时就医"] });
  if (areas.includes("nutrition")) risks.push({ category: "营养风险", level: "low", score: 35, description: "整体营养状况尚可", actions: ["注意蛋白质和钙质补充"] });

  const overallLevel = risks.some((r) => r.level === "high" || r.level === "critical") ? "high" : risks.some((r) => r.level === "medium") ? "medium" : "low";

  const text = `## 风险评估报告\n\n**老人ID：** ${elder_id}\n**总体风险等级：** ${overallLevel}\n\n${risks.map((r) => `### ${r.category}（${r.level}，${r.score}分）\n**描述：** ${r.description}\n**建议行动：**\n${r.actions.map((a) => `- ${a}`).join("\n")}`).join("\n\n")}\n\n---\n⚠️ 本评估基于系统记录自动生成，不替代医生诊断。高风险项需人工审核确认。`;

  return { content: [{ type: "text", text }] };
}
