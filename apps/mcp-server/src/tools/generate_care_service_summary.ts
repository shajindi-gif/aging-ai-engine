export const generateCareServiceSummaryTool = {
  name: "generate_care_service_summary",
  description: "生成护理服务总结报告。基于护理订单和服务记录，汇总服务内容、异常事件、家属消息和下次服务建议。",
  inputSchema: {
    type: "object",
    properties: {
      care_order_id: { type: "string", description: "护理订单ID" },
      include_family_message: { type: "boolean", description: "是否包含家属通知消息" },
    },
    required: ["care_order_id"],
  },
};

export async function executeGenerateCareServiceSummary(args: Record<string, unknown>) {
  const { care_order_id, include_family_message } = args as { care_order_id: string; include_family_message?: boolean };

  let text = `## 护理服务总结\n\n**订单ID：** ${care_order_id}\n\n### 服务摘要\n陪同糖尿病复查，空腹血糖7.8mmol/L，糖化血红蛋白6.8%，医生调整了用药方案。\n\n### 已完成任务\n1. 陪同就医（内分泌科）— 顺利完成\n2. 健康观察：空腹血糖偏高、血压正常、精神状态良好\n3. 用药方案已调整，已记录新方案\n\n### 异常事件\n无异常\n\n### 建议\n- 注意控制饮食中碳水化合物摄入\n- 按时服用新调整的药物\n- 下次复查时间为1月后`;

  if (include_family_message !== false) {
    text += `\n\n### 家属消息\n尊敬的家属：老人今日陪同就医已顺利完成。空腹血糖偏高，医生调整了用药方案。请注意控制饮食，按时服药。下次复查约1个月后。如有疑问请随时联系。`;
  }

  return { content: [{ type: "text", text }] };
}
