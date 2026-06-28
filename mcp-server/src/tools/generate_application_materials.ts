export const generateApplicationMaterialsTool = {
  name: "generate_application_materials",
  description: "根据政策要求和申请人情况，生成申请材料清单和申请指南，包括所需证件、表格填写要点、提交方式等。",
  inputSchema: {
    type: "object",
    properties: {
      policy_id: { type: "string", description: "目标政策ID" },
      elder_age: { type: "number", description: "申请人年龄" },
      elder_province: { type: "string", description: "申请人所在省份" },
      special_conditions: { type: "array", items: { type: "string" }, description: "特殊条件，如 ['低保', '残疾']" },
    },
    required: ["policy_id"],
  },
};

export async function executeGenerateApplicationMaterials(args: Record<string, unknown>) {
  const { policy_id, elder_age, elder_province } = args as { policy_id: string; elder_age?: number; elder_province?: string; special_conditions?: string[] };

  const text = `## 申请材料清单\n\n**目标政策：** ${policy_id}\n**申请人：** ${elder_age ?? "未知"}岁，${elder_province ?? "未知"}籍\n\n### 必备材料\n1. ✅ **身份证** — 原件及复印件（正反面）\n2. ✅ **户口本** — 原件及复印件（首页+本人页）\n3. ✅ **银行卡** — 本人名下储蓄卡（用于发放补贴）\n4. ✅ **申请表** — 社区事务受理中心领取或网上下载\n\n### 补充材料（视情况）\n- 低保证/低收入证明（如适用）\n- 残疾证（如适用）\n- 失能评估报告（如适用）\n- 近期免冠照片2张\n\n### 提交方式\n- **线下：** 前往户籍所在地街道社区事务受理服务中心\n- **线上：** 通过当地政务APP或民政局网站提交\n\n### 注意事项\n- 材料有效期通常为6个月\n- 复印件需加盖公章或按手印\n- 审核周期一般15-30个工作日`;

  return { content: [{ type: "text", text }] };
}
