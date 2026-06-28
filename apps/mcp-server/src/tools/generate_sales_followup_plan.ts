export const generateSalesFollowupPlanTool = {
  name: "generate_sales_followup_plan",
  description: "生成销售跟进计划。基于线索信息和机构画像，输出痛点分析、推荐产品、首次沟通话术和跟进步骤。",
  inputSchema: {
    type: "object",
    properties: {
      lead_id: { type: "string", description: "线索ID，如 'lead-001'" },
      include_message_draft: { type: "boolean", description: "是否包含首次沟通话术草稿" },
    },
    required: ["lead_id"],
  },
};

export async function executeGenerateSalesFollowupPlan(args: Record<string, unknown>) {
  const { lead_id, include_message_draft } = args as { lead_id: string; include_message_draft?: boolean };

  let text = `## 销售跟进计划\n\n**线索ID：** ${lead_id}\n\n### 线索摘要\n成都晚霞社区日间照料中心（联系人：周站长），来源：政策扫描，状态：新线索，预估价值：¥85,000。\n\n### 痛点分析\n1. **信息化基础薄弱**（紧急度：高）— 数字化成熟度仅28分(L1级)\n2. **服务记录依赖纸质**（紧急度：中）— 缺少电子服务记录系统\n\n### 推荐产品\n- **基础管理系统** — ¥30,000\n- **签到打卡系统** — ¥8,000\n- **健康监测设备** — ¥15,000\n\n### 跟进步骤\n1. 立即 — 发送产品介绍资料和成功案例（邮件/微信）\n2. 2天后 — 电话跟进确认是否已阅读资料\n3. 1周内 — 安排线上/线下产品演示\n4. 演示后2天内 — 发送定制化方案和报价\n5. 方案确认后1周内 — 商务谈判和签约`;

  if (include_message_draft !== false) {
    text += `\n\n### 首次沟通话术\n周站长您好！我是衍策银龄的顾问。注意到贵机构在信息化基础方面有提升空间，我们有一套针对社区日间照料的解决方案，已帮助多家同类机构提升服务效率。方便的话我们可以安排一次15分钟的线上演示，您看这周哪天方便？`;
  }

  return { content: [{ type: "text", text }] };
}
