import type { Elder, FamilyMember, MedicalVisit, MedicationReminder, ChronicMetric, RiskEvent } from "@/lib/types";

const surnames = ["张","王","李","赵","刘","陈","杨","黄","周","吴","徐","孙","马","朱","胡","郭","何","林","罗","高"];
const femaleN = ["秀兰","淑芬","桂英","美华","玉兰","秀珍","翠花","凤英","玉珍","桂兰","淑珍","秀芳","兰英","玉梅","春花","惠芬","月英","巧珍","银花","秀梅"];
const maleN = ["德明","建国","志强","建华","国强","永福","宝山","大明","文斌","光明","福来","长生","有才","金根","兴旺","忠良","学文","国庆","永安","和平"];
const regions = ["上海市浦东新区","上海市徐汇区","上海市静安区","上海市长宁区","上海市黄浦区","上海市普陀区","上海市杨浦区","上海市闵行区","上海市宝山区","上海市松江区","北京市海淀区","北京市朝阳区","深圳市南山区","深圳市罗湖区","杭州市西湖区","杭州市上城区","苏州市姑苏区","广州市天河区","成都市锦江区","武汉市武昌区"];
const diseases = [["高血压","糖尿病"],["冠心病","高血压"],["阿尔茨海默病"],["帕金森病"],["骨质疏松"],["糖尿病","高血脂"],["慢阻肺"],["中风后遗症"],["关节炎","骨质疏松"],["白内障","高血压"]];
const lStatuses: Elder["livingStatus"][] = ["alone","with_spouse","with_children","institution"];
const cLevels: Elder["careLevel"][] = ["independent","semi_dependent","dependent","critical"];

function genElders(): Elder[] {
  const elders: Elder[] = [];
  for (let i = 0; i < 30; i++) {
    const isF = i % 2 === 0;
    const sn = surnames[i % surnames.length];
    const gn = isF ? femaleN[i % femaleN.length] : maleN[i % maleN.length];
    const age = 65 + Math.floor((i * 11 + 3) % 34);
    const ls = lStatuses[i % lStatuses.length];
    const cl = i < 8 ? "independent" : i < 16 ? "semi_dependent" : i < 24 ? "dependent" : "critical";
    elders.push({
      id: `ELD-${String(i + 1).padStart(3, "0")}`,
      organizationId: `ORG-${String((i % 5) + 1).padStart(3, "0")}`,
      name: sn + gn,
      gender: isF ? "female" : "male",
      birthYear: 2026 - age,
      age,
      region: regions[i % regions.length],
      address: `${regions[i % regions.length]}某某路${100 + i * 3}号`,
      livingStatus: ls,
      careLevel: cl,
      chronicDiseases: diseases[i % diseases.length],
      emergencyContactName: sn + (isF ? maleN[i % maleN.length] : femaleN[i % femaleN.length]),
      emergencyContactPhone: `1${3 + (i % 7)}${String(10000000 + i * 1234567).slice(0, 8)}`,
      familyMemberIds: [`FM-${String(i * 2 + 1).padStart(3, "0")}`, `FM-${String(i * 2 + 2).padStart(3, "0")}`],
      consentStatus: i % 7 === 0 ? "pending" : "granted",
      createdAt: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T08:00:00Z`,
      updatedAt: `2025-${String((i % 6) + 1).padStart(2, "0")}-15T10:00:00Z`,
    });
  }
  return elders;
}

export const mockElders: Elder[] = genElders();

function genFamilyMembers(): FamilyMember[] {
  const fms: FamilyMember[] = [];
  for (let i = 0; i < 60; i++) {
    const elderIdx = Math.floor(i / 2);
    const isP = i % 2 === 0;
    fms.push({
      id: `FM-${String(i + 1).padStart(3, "0")}`,
      elderId: `ELD-${String(elderIdx + 1).padStart(3, "0")}`,
      name: surnames[(i + 5) % surnames.length] + (isP ? maleN[i % maleN.length] : femaleN[i % femaleN.length]),
      relation: isP ? (i % 3 === 0 ? "儿子" : i % 3 === 1 ? "女儿" : "配偶") : (i % 3 === 0 ? "儿媳" : i % 3 === 1 ? "女婿" : "女儿"),
      phone: `1${3 + (i % 7)}${String(20000000 + i * 1345678).slice(0, 8)}`,
      email: `family${i + 1}@example.com`,
      city: i % 4 === 0 ? "深圳" : i % 4 === 1 ? "北京" : "上海",
      notificationPreference: (["wechat","sms","app","none"] as const)[i % 4],
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2025-03-01T10:00:00Z",
    });
  }
  return fms;
}
export const mockFamilyMembers: FamilyMember[] = genFamilyMembers();

function genVisits(): MedicalVisit[] {
  const hospitals = ["复旦大学附属中山医院","上海交通大学医学院附属瑞金医院","上海市第一人民医院","上海市第六人民医院","上海市华山医院","上海市仁济医院","上海市东方医院","上海市中山医院","北京大学第一医院","北京协和医院","深圳市人民医院","浙江大学附属第一医院","苏州大学附属第一医院"];
  const depts = ["心内科","内分泌科","神经内科","骨科","呼吸科","老年医学科","康复科","眼科","肾内科","消化科"];
  const visits: MedicalVisit[] = [];
  for (let i = 0; i < 50; i++) {
    const elderIdx = i % 30;
    visits.push({
      id: `VIS-${String(i + 1).padStart(3, "0")}`,
      elderId: `ELD-${String(elderIdx + 1).padStart(3, "0")}`,
      hospitalName: hospitals[i % hospitals.length],
      departmentName: depts[i % depts.length],
      doctorName: `${surnames[(i + 3) % surnames.length]}医生`,
      visitDate: `2025-${String((i % 6) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      diagnosisText: `${diseases[elderIdx % diseases.length].join("、")}复查`,
      prescriptionText: "继续原方案用药，注意监测血压血糖",
      examItems: ["血常规","肝肾功能","心电图","胸片"],
      followUpDate: `2025-${String(Math.min((i % 6) + 3, 12)).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      summary: `患者${diseases[elderIdx % diseases.length][0]}病情稳定，继续当前治疗方案。`,
      createdAt: `2025-${String((i % 6) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T09:00:00Z`,
      updatedAt: `2025-${String((i % 6) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T09:00:00Z`,
    });
  }
  return visits;
}
export const mockMedicalVisits: MedicalVisit[] = genVisits();

function genMedReminders(): MedicationReminder[] {
  const meds = [["氨氯地平","5mg","每日1次"],["二甲双胍","500mg","每日2次"],["阿司匹林","100mg","每日1次"],["美多芭","250mg","每日3次"],["阿仑膦酸钠","70mg","每周1次"],["瑞舒伐他汀","10mg","每晚1次"],["噻托溴铵","18μg","每日1次"],["氯吡格雷","75mg","每日1次"]];
  const reminders: MedicationReminder[] = [];
  for (let i = 0; i < 40; i++) {
    const med = meds[i % meds.length];
    reminders.push({
      id: `MED-${String(i + 1).padStart(3, "0")}`,
      elderId: `ELD-${String((i % 30) + 1).padStart(3, "0")}`,
      medicationName: med[0],
      dosage: med[1],
      frequency: med[2],
      startDate: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
      endDate: "",
      reminderTime: ["08:00","12:00","18:00"].slice(0, med[2].includes("1次") ? 1 : med[2].includes("2次") ? 2 : 3),
      status: i % 6 === 0 ? "completed" : i % 8 === 0 ? "paused" : "active",
      createdAt: "2025-01-15T08:00:00Z",
      updatedAt: "2025-06-01T10:00:00Z",
    });
  }
  return reminders;
}
export const mockMedicationReminders: MedicationReminder[] = genMedReminders();

function genMetrics(): ChronicMetric[] {
  const types: Array<{t: ChronicMetric["metricType"]; u: string; lo: number; hi: number}> = [
    {t:"blood_pressure",u:"mmHg",lo:100,hi:180},{t:"blood_sugar",u:"mmol/L",lo:4,hi:15},{t:"heart_rate",u:"bpm",lo:55,hi:105},{t:"weight",u:"kg",lo:40,hi:85},{t:"oxygen",u:"%",lo:92,hi:99},{t:"temperature",u:"°C",lo:36,hi:38}
  ];
  const metrics: ChronicMetric[] = [];
  for (let i = 0; i < 60; i++) {
    const tp = types[i % types.length];
    const val = +(tp.lo + (tp.hi - tp.lo) * ((i * 7 + 3) % 10) / 10).toFixed(1);
    const abnormal = val > tp.lo + (tp.hi - tp.lo) * 0.75;
    metrics.push({
      id: `MET-${String(i + 1).padStart(3, "0")}`,
      elderId: `ELD-${String((i % 30) + 1).padStart(3, "0")}`,
      metricType: tp.t,
      value: val,
      unit: tp.u,
      measuredAt: `2025-06-${String((i % 28) + 1).padStart(2, "0")}T07:30:00Z`,
      abnormalFlag: abnormal,
      note: abnormal ? "指标偏高，建议关注" : "指标正常",
      createdAt: `2025-06-${String((i % 28) + 1).padStart(2, "0")}T07:30:00Z`,
      updatedAt: `2025-06-${String((i % 28) + 1).padStart(2, "0")}T07:30:00Z`,
    });
  }
  return metrics;
}
export const mockChronicMetrics: ChronicMetric[] = genMetrics();

function genRiskEvents(): RiskEvent[] {
  const rTypes: RiskEvent["riskType"][] = ["fall","medication","vital","behavior","nutrition","wandering","infection","other"];
  const rLevels: RiskEvent["riskLevel"][] = ["low","medium","high","critical"];
  const descs = ["老人在卫生间滑倒，未受伤但需关注","漏服降压药一次，已补服","血压165/95mmHg，高于正常范围","情绪低落，拒绝参加日间活动","连续两餐未进食，食欲减退","独自在小区徘徊近1小时","体温37.8°C，疑似感冒","夜间睡眠不安，频繁起夜"];
  const actions = ["已加强卫生间防滑措施","已提醒并记录，后续按时提醒","已联系家属，建议就医复查","已安排社工陪聊疏导","已通知家属并调整饮食方案","已安全送回房间，加强看护","已安排就医，观察中","已调整夜间照护方案"];
  const events: RiskEvent[] = [];
  for (let i = 0; i < 30; i++) {
    const idx = i % 8;
    events.push({
      id: `RSK-${String(i + 1).padStart(3, "0")}`,
      elderId: `ELD-${String((i % 30) + 1).padStart(3, "0")}`,
      careOrderId: `ORD-${String((i % 80) + 1).padStart(3, "0")}`,
      riskType: rTypes[idx],
      riskLevel: rLevels[i % 4],
      description: descs[idx],
      actionTaken: actions[idx],
      familyNotified: i % 3 !== 0,
      createdAt: `2025-06-${String((i % 28) + 1).padStart(2, "0")}T${String(8 + i % 10).padStart(2, "0")}:00:00Z`,
      updatedAt: `2025-06-${String((i % 28) + 1).padStart(2, "0")}T${String(9 + i % 10).padStart(2, "0")}:00:00Z`,
    });
  }
  return events;
}
export const mockRiskEvents: RiskEvent[] = genRiskEvents();
