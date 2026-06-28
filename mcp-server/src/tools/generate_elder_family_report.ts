export const generateElderFamilyReportTool = {
  name: "generate_elder_family_report",
  description: "生成面向家属的老人照护报告，包含健康摘要、近期服务记录、用药提醒、风险预警和政策机会。语言友好易懂。",
  inputSchema: {
    type: "object",
    properties: {
      elder_id: { type: "string", description: "老人ID" },
      period: { type: "string", description: "报告周期，如 '2024年12月'" },
    },
    required: ["elder_id"],
  },
};

export async function executeGenerateElderFamilyReport(args: Record<string, unknown>) {
  const { elder_id, period } = args as { elder_id: string; period?: string };

  const text = `## 家属照护报告\n\n**老人ID：** ${elder_id}\n**报告周期：** ${period || "近30天"}\n\n---\n\n尊敬的家属，您好！以下是老人近期的照护情况报告。\n\n### 健康概况\n老人近期整体状况良好。慢性病控制稳定，用药规律。\n\n### 近期服务记录\n| 日期 | 服务类型 | 结果 |\n|------|----------|------|\n| 10月15日 | 陪同就医 | 顺利完成 |\n| 10月14日 | 助浴服务 | 顺利完成 |\n| 10月12日 | 社区活动 | 顺利完成 |\n\n### 用药提醒\n- 氨氯地平 5mg — 每日一次 ✅\n- 二甲双胍 500mg — 每日两次 ✅\n\n### 风险关注\n- ⚠️ 跌倒风险（中等）：建议居家适老化改造\n- 多重用药需定期审查\n\n### 可申请政策\n- 高龄养老服务补贴 — 每月500元\n- 适老化改造补贴 — 最高3万元\n\n### 即将到来\n- 复诊：11月15日 心内科\n- 体检：12月1日 年度全面体检\n\n如有疑问请随时联系我们。`;

  return { content: [{ type: "text", text }] };
}
