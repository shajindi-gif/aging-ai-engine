// ═══════════════════════════════════════════════
// 免费工具 — 结果生成引擎
// 纯前端规则计算，与具体输入相关；不调用外部 AI / 政策库。
// 所有结果对用户明确标注为「虚构样例演示」。
// ═══════════════════════════════════════════════

export interface ToolResultSection {
  heading: string;
  items: string[];
  tone?: "default" | "positive" | "warning";
}

export interface ToolResult {
  summary: string; // 一句话说明本结果由输入推导
  sections: ToolResultSection[];
  notes: string[]; // 边界与免责
}

const num = (v: string | undefined): number | null => {
  if (v == null || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ── 1. 养老补贴资格初筛 ────────────────────────
function subsidyChecker(i: Record<string, string>): ToolResult {
  const age = num(i.age) ?? 0;
  const city = i.city || "";
  const careLevel = i.careLevel || "";
  const living = i.livingStatus || "";
  const items: string[] = [];
  if (age >= 80) items.push(`${city}高龄津贴类政策通常以 80 岁为起始档（部分城市 70 岁起），您输入的年龄 ${age} 岁通常落入可申请范围，具体档位以当地民政部门公布为准。`);
  else if (age >= 70) items.push(`部分城市高龄津贴自 70 岁起发放，您输入的年龄 ${age} 岁建议同时关注 70+/80+ 两档的当地标准。`);
  else items.push(`您输入的年龄 ${age} 岁，多数城市高龄津贴自 70 或 80 岁起，建议先确认当地起始年龄。`);
  if (careLevel === "失能" || careLevel === "重症护理") items.push("照护等级为失能/重症时，通常可关注长期护理保险（长护险）与失能老人照护补贴两类政策，是否参保及评估标准以当地经办机构为准。");
  else if (careLevel === "半失能") items.push("半失能状态下可关注长护险的失能等级评估流程，以及部分城市的半失能照护补助。");
  if (living === "独居") items.push("独居老人可额外关注居家养老服务补贴、社区定期探访与助餐服务。");
  if (city) items.push(`以上为按您输入的条件（${city}、${age} 岁、${careLevel}、${living}）给出的方向性初筛，完整政策清单请使用站内「政策数据库」按城市检索核对。`);
  return {
    summary: `已按您输入的条件（${city || "未填城市"} · ${age || "未填年龄"}岁 · ${careLevel || "未填等级"} · ${living || "未填居住状态"}）完成规则初筛，结果如下。`,
    sections: [
      { heading: "可能相关的政策方向", items, tone: "positive" },
      {
        heading: "下一步建议",
        items: [
          "在「政策数据库」按城市检索对应政策原文，核对申请条件与材料。",
          "资格以当地主管部门最终审核为准；本工具不做资格认定。",
        ],
      },
    ],
    notes: ["本工具为规则初筛演示（虚构样例，未接入实时政策库），不构成任何资格认定或官方答复。"],
  };
}

// ── 2. 家属照护报告 ────────────────────────────
function familyCareReport(i: Record<string, string>): ToolResult {
  const name = i.elderName || "老人";
  const period = i.period || "本期";
  return {
    summary: `已根据您输入的 ${period} 记录，整理出 ${name} 的照护报告草稿。`,
    sections: [
      {
        heading: `${period}健康状况小结（依据您输入的内容归纳）`,
        items: [
          i.healthSummary ? `健康情况：${i.healthSummary}` : "未填写健康状况。",
          i.careActivities ? `服务记录：${i.careActivities}` : "未填写护理服务内容。",
          i.riskEvents ? `风险事件：${i.riskEvents}（建议在正式报告中注明处理经过与后续观察点）` : "本期无风险事件记录。",
        ],
      },
      {
        heading: "给家属的说明（草稿）",
        items: [
          `${name} ${period}的照护工作按计划执行，以上内容为护理人员记录的整理稿。`,
          "建议补充：下次复诊时间、用药变化、需要家属配合的事项。",
        ],
      },
    ],
    notes: ["本工具为文本整理演示（虚构样例），不对健康数据做任何医学判断；正式报告请由护理负责人核对后发出。"],
  };
}

// ── 3. 陪诊记录总结 ────────────────────────────
function medicalCompanionSummary(i: Record<string, string>): ToolResult {
  return {
    summary: `已将您输入的就诊信息整理为标准陪诊记录草稿。`,
    sections: [
      {
        heading: "陪诊记录（草稿）",
        items: [
          `就诊：${i.hospitalName || "—"} · ${i.department || "—"}`,
          i.diagnosis ? `医生诊断/主诉：${i.diagnosis}` : "未填写诊断结果。",
          i.prescription ? `处方用药：${i.prescription}` : "未填写处方。",
          i.followUp ? `复诊安排：${i.followUp}` : "未填写复诊安排。",
        ],
      },
      {
        heading: "待家属确认事项",
        items: [
          "用药是否与在服药物冲突，请交由医生/药师确认。",
          "复诊当天的陪诊安排与接送。",
        ],
      },
    ],
    notes: ["本工具为记录整理演示（虚构样例），不提供医学建议；处方与诊断请以医院出具的材料为准。"],
  };
}

// ── 4. 居家照护计划 ────────────────────────────
function carePlanGenerator(i: Record<string, string>): ToolResult {
  const careLevel = i.careLevel || "";
  const items: string[] = [];
  if (careLevel === "失能") items.push("日常安排建议：每 2 小时协助翻身一次、每日检查皮肤状况、进食以软食/流食为主并记录出入量。");
  else if (careLevel === "半失能") items.push("日常安排建议：每日协助洗漱与如厕、安排 20–30 分钟室内活动、重点观察步态防跌倒。");
  else items.push("日常安排建议：保持规律作息与每日散步，鼓励自主完成日常活动。");
  if (i.livingEnv === "无电梯" || i.livingEnv === "农村") items.push("居住环境提示：无电梯/农村环境建议优先安排一层活动区域，减少上下楼频次。");
  if (i.familySupport === "子女异地" || i.familySupport === "独居") items.push("支持情况提示：子女异地/独居时，建议配置每日电话或视频确认，并列出紧急联系人张贴于明显位置。");
  return {
    summary: `已按您输入的情况（${i.elderAge || "—"}岁 · ${careLevel || "—"} · ${i.livingEnv || "—"} · ${i.familySupport || "—"}）生成照护计划草稿。`,
    sections: [
      { heading: "照护计划草稿", items, tone: "positive" },
      { heading: "执行建议", items: ["把计划拆成每日任务清单并指定责任人。", "每周复盘一次执行情况并调整。"] },
    ],
    notes: ["本工具为计划模板演示（虚构样例），不能替代专业护理评估；涉及医疗护理操作请咨询医护人员。"],
  };
}

// ── 5. 用药提醒计划 ────────────────────────────
function medicationReminderPlan(i: Record<string, string>): ToolResult {
  const meds = (i.medications || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const rows = meds.map((m) => {
    const time = /早|晨/.test(m) && /晚/.test(m) ? "早晚各一次"
      : /早|晨/.test(m) ? "早晨一次"
      : /中|午/.test(m) ? "中午一次"
      : /晚|睡/.test(m) ? "晚间一次"
      : "按医嘱时间";
    return `${m} → 建议提醒：${time}`;
  });
  return {
    summary: `已根据您输入的 ${meds.length} 条用药信息生成提醒时间表草稿。`,
    sections: [
      { heading: "提醒时间表（草稿）", items: rows.length ? rows : ["未填写药物清单。"], tone: "positive" },
      { heading: "注意事项", items: [i.specialNotes ? `您标注的特殊事项：${i.specialNotes}` : "空腹/餐后等要求请按医嘱执行。", "提醒计划不能替代医嘱，调药请咨询医生。"] },
    ],
    notes: ["本工具为时间表整理演示（虚构样例），不构成用药指导。"],
  };
}

// ── 6. 复诊提醒 ────────────────────────────────
function followUpReminder(i: Record<string, string>): ToolResult {
  const days = num(i.followUpDays);
  const base = i.visitDate ? new Date(i.visitDate) : null;
  const next = base && days && !Number.isNaN(base.getTime())
    ? new Date(base.getTime() + days * 86400000).toISOString().slice(0, 10)
    : null;
  return {
    summary: `已根据上次就诊（${i.visitDate || "未填"}）与间隔（${days ?? "未填"} 天）生成复诊提醒草稿。`,
    sections: [
      {
        heading: "提醒计划（草稿）",
        items: [
          next ? `建议复诊日期：${next}（${i.hospital || "就诊医院"} ${i.department || ""}）` : "请补全上次就诊日期与复诊间隔，才能计算建议复诊日期。",
          next ? `建议提前 2 天（${new Date(new Date(next).getTime() - 2 * 86400000).toISOString().slice(0, 10)}）开始准备：病历本、医保卡、近期用药清单。` : "日期补全后会给出备物提醒。",
        ],
        tone: next ? "positive" : "warning",
      },
    ],
    notes: ["本工具为日期计算演示（虚构样例），复诊时间以医生医嘱为准。"],
  };
}

// ── 7. 老人照护风险初筛 ────────────────────────
function elderRiskCheck(i: Record<string, string>): ToolResult {
  const age = num(i.age) ?? 0;
  const falls = num(i.fallHistory) ?? 0;
  const meds = num(i.medications) ?? 0;
  const cognitive = i.cognitiveStatus || "";
  let score = 0;
  const factors: string[] = [];
  if (age >= 80) { score += 20; factors.push("年龄 ≥ 80 岁"); }
  else if (age >= 70) { score += 10; factors.push("年龄 70–79 岁"); }
  if (falls >= 1) { score += 30; factors.push(`近半年跌倒 ${falls} 次`); }
  if (meds >= 5) { score += 20; factors.push(`每日用药 ${meds} 种（多重用药）`); }
  else if (meds >= 3) { score += 10; factors.push(`每日用药 ${meds} 种`); }
  if (cognitive === "轻度下降") { score += 15; factors.push("认知轻度下降"); }
  else if (cognitive === "明显下降" || cognitive === "已确诊痴呆") { score += 25; factors.push(`认知状态：${cognitive}`); }
  if (i.livingStatus === "独居") { score += 15; factors.push("独居"); }
  const level = score >= 60 ? "较高" : score >= 30 ? "中等" : "较低";
  return {
    summary: `按您输入的信息计算，当前照护风险初筛为「${level}」（${Math.min(100, score)}/100，规则评分）。`,
    sections: [
      { heading: "主要风险因素（来自您的输入）", items: factors.length ? factors : ["未识别到明显风险因素。"], tone: score >= 60 ? "warning" : "default" },
      {
        heading: "改善建议",
        items: [
          falls >= 1 ? "有跌倒史：建议做居家防跌倒检查，并咨询医生评估原因。" : "保持居家通道整洁、照明充足。",
          meds >= 3 ? "用药较多：建议请医生/药师复核用药清单。" : "按医嘱规律用药。",
          cognitive !== "正常" ? "认知下降：建议尽快到记忆门诊/神经内科评估。" : "保持社交与益智活动。",
          i.livingStatus === "独居" ? "独居：建议安排每日确认机制与紧急联系方案。" : "与家人保持每日沟通。",
        ],
      },
    ],
    notes: ["本工具为规则评分演示（虚构样例，Experimental），不构成医疗诊断；如有紧急症状请立即就医。"],
  };
}

// ── 8. 适老化改造清单 ──────────────────────────
function homeAgingChecklist(i: Record<string, string>): ToolResult {
  const items: string[] = [];
  if (i.elderMobility === "需轮椅") items.push("通道与门宽 ≥ 90cm、卫生间改推拉门、配轮椅回转空间。");
  else if (i.elderMobility === "需拐杖") items.push("全屋防滑地面、床边与马桶旁安装扶手、夜间感应地脚灯。");
  else items.push("浴室防滑垫与扶手、去除门槛与地面高差、充足照明。");
  if (i.floor === "无电梯" || i.floor === "高层(7+)") items.push("楼梯/无电梯场景：楼梯双侧扶手、每层设置可休息台阶座。");
  if (i.houseType === "农村自建房") items.push("农村自建房：院落平整与排水、外坡道防滑处理、火炉/柴灶隔离防护。");
  const budget = i.budget || "";
  return {
    summary: `已按您输入的条件（${i.houseType || "—"} · ${i.floor || "—"} · ${i.elderMobility || "—"} · 预算${budget || "—"}）生成改造清单草稿。`,
    sections: [
      { heading: "改造清单草稿", items, tone: "positive" },
      { heading: "预算参考（示意区间，非报价）", items: [budget ? `按 ${budget} 档位，常见改造项合计通常落在此区间内；实际以上门勘测报价为准。` : "请选择预算范围以获得参考区间。", "部分地区有适老化改造补贴，可在「政策数据库」检索当地政策。"] },
    ],
    notes: ["本工具为清单模板演示（虚构样例），不构成施工或采购建议。"],
  };
}

// ── 9. 机构线索评分 ────────────────────────────
function nursingHomeLeadScore(i: Record<string, string>): ToolResult {
  const beds = num(i.bedCount) ?? 0;
  const staff = num(i.staffCount) ?? 0;
  let score = 0;
  const why: string[] = [];
  if (beds >= 100) { score += 30; why.push(`床位 ${beds} 张：规模较大，数字化需求通常更强`); }
  else if (beds >= 50) { score += 20; why.push(`床位 ${beds} 张：中型机构`); }
  else { score += 10; why.push(`床位 ${beds} 张：小型机构，预算有限`); }
  const sys = i.hasSystem || "";
  if (sys === "无" || sys === "Excel管理") { score += 30; why.push(`当前${sys === "无" ? "无信息系统" : "Excel 管理"}：数字化提升空间大`); }
  else if (sys === "简单SaaS") { score += 15; why.push("已有简单 SaaS：可切专业版差异化竞争"); }
  else { score += 5; why.push("已有专业系统：替换成本高，优先做增量功能切入"); }
  if (staff >= 20) { score += 20; why.push(`员工 ${staff} 人：培训与协同工具价值明显`); }
  const level = score >= 60 ? "高意向" : score >= 35 ? "中意向" : "低意向";
  return {
    summary: `按您输入的信息，该${i.institutionType || "机构"}的线索评分初筛为「${level}」（${score}/100，规则评分）。`,
    sections: [
      { heading: "评分依据（来自您的输入）", items: why, tone: "positive" },
      { heading: "跟进建议", items: [level === "高意向" ? "建议优先安排上门演示，准备同规模机构案例。" : "建议先用免费工具建立联系，再逐步推进。"] },
    ],
    notes: ["本工具为销售线索整理演示（虚构样例），评分为规则示意，不代表真实采购意向。"],
  };
}

// ── 10. 政策申报材料清单 ───────────────────────
function policyMaterialsGenerator(i: Record<string, string>): ToolResult {
  const t = i.policyType || "";
  const common = ["申请人身份证及户口本", "近期免冠照片", "银行卡/社保卡复印件"];
  const byType: Record<string, string[]> = {
    "高龄津贴": ["年龄证明（身份证/户口本）", "发放银行账户信息"],
    "长期护理保险": ["失能等级评估申请表", "近期病历或诊断证明", "社保参保证明"],
    "适老化改造": ["房产证明或租住证明", "改造方案/施工合同", "改造前后照片"],
    "社区助餐": ["居住证明", "年龄证明"],
    "居家养老服务": ["老年人能力评估报告（如有）", "服务协议"],
    "失能老人照护": ["失能评估报告", "照护服务记录"],
    "养老机构补贴": ["机构备案/登记证明", "床位与运营台账", "消防与食品安全证明"],
  };
  const extra = byType[t] || [];
  return {
    summary: `已按「${t || "未选择政策类型"}」（${i.city || "未填城市"} · ${i.applicantType || "未填主体"}）生成申报材料核对清单草稿。`,
    sections: [
      { heading: "通用材料", items: common, tone: "positive" },
      { heading: `${t || "该政策"}常见附加材料（示意）`, items: extra.length ? extra : ["请先选择政策类型。"] },
      { heading: "提醒", items: [`实际材料清单以 ${i.city || "当地"} 主管部门发布的申报指南为准，建议申报前电话或窗口确认。`] },
    ],
    notes: ["本工具为材料清单模板演示（虚构样例），未接入官方申报系统；清单可能与最新要求不一致。"],
  };
}

// ── 注册表 ─────────────────────────────────────
export const TOOL_GENERATORS: Record<string, (input: Record<string, string>) => ToolResult> = {
  "subsidy-checker": subsidyChecker,
  "family-care-report": familyCareReport,
  "medical-companion-summary": medicalCompanionSummary,
  "care-plan-generator": carePlanGenerator,
  "medication-reminder-plan": medicationReminderPlan,
  "follow-up-reminder": followUpReminder,
  "elder-risk-check": elderRiskCheck,
  "home-aging-modification-checklist": homeAgingChecklist,
  "nursing-home-lead-score": nursingHomeLeadScore,
  "policy-materials-generator": policyMaterialsGenerator,
};

// 每工具的必填字段（用于字段级校验提示）
export const TOOL_REQUIRED: Record<string, string[]> = {
  "subsidy-checker": ["city", "age", "careLevel"],
  "family-care-report": ["elderName", "healthSummary", "careActivities"],
  "medical-companion-summary": ["hospitalName", "diagnosis"],
  "care-plan-generator": ["elderAge", "careLevel"],
  "medication-reminder-plan": ["medications"],
  "follow-up-reminder": ["visitDate", "followUpDays"],
  "elder-risk-check": ["age", "fallHistory", "medications", "cognitiveStatus"],
  "home-aging-modification-checklist": ["houseType", "elderMobility"],
  "nursing-home-lead-score": ["institutionType", "bedCount", "hasSystem"],
  "policy-materials-generator": ["policyType", "city"],
};

// 健康类工具：提示不要输入真实敏感病历
export const TOOL_HEALTH_HINT: Record<string, string> = {
  "elder-risk-check": "本工具为演示用途，请输入虚构或脱敏信息，不要填写真实病历、身份证号等敏感内容。",
  "family-care-report": "本工具为演示用途，请输入虚构或脱敏信息，不要填写真实病历、身份证号等敏感内容。",
  "medical-companion-summary": "本工具为演示用途，请输入虚构或脱敏信息，不要填写真实病历、身份证号等敏感内容。",
  "medication-reminder-plan": "本工具为演示用途，请输入虚构或脱敏信息，不要填写真实病历、身份证号等敏感内容。",
};
