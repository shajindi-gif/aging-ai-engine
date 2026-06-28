export const createCareRecordTool = {
  name: "create_care_record",
  description: "创建护理服务记录。记录护理员对老人的服务过程，包括健康观察、异常事件、建议等。",
  inputSchema: {
    type: "object",
    properties: {
      elder_id: { type: "string", description: "老人ID" },
      care_order_id: { type: "string", description: "关联的护理订单ID" },
      service_type: { type: "string", enum: ["escort", "nursing", "rehabilitation", "companion", "bathing", "meal", "cleaning"], description: "服务类型" },
      summary: { type: "string", description: "服务摘要" },
      health_observations: { type: "array", items: { type: "string" }, description: "健康观察列表" },
      recommendations: { type: "array", items: { type: "string" }, description: "建议列表" },
      abnormal_events: { type: "array", items: { type: "string" }, description: "异常事件列表" },
    },
    required: ["elder_id", "service_type", "summary"],
  },
};

export async function executeCreateCareRecord(args: Record<string, unknown>) {
  const { elder_id, service_type, summary, health_observations, recommendations, abnormal_events } = args as {
    elder_id: string; service_type: string; summary: string; health_observations?: string[]; recommendations?: string[]; abnormal_events?: string[];
  };

  const recordId = `rec-${Date.now()}`;
  const text = `## 护理记录已创建\n\n**记录ID：** ${recordId}\n**老人ID：** ${elder_id}\n**服务类型：** ${service_type}\n**服务摘要：** ${summary}\n\n### 健康观察\n${(health_observations ?? []).map((o) => `- ${o}`).join("\n") || "无特殊记录"}\n\n### 建议\n${(recommendations ?? []).map((r) => `- ${r}`).join("\n") || "无特殊建议"}\n\n### 异常事件\n${(abnormal_events ?? []).map((e) => `- ⚠️ ${e}`).join("\n") || "无异常"}\n\n**提交时间：** ${new Date().toISOString()}`;

  return { content: [{ type: "text", text }] };
}
