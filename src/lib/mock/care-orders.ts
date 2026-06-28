import type { CareOrder, CareRecord } from "@/lib/types";

const svcTypes: CareOrder["serviceType"][] = ["escort","nursing","rehabilitation","companion","bathing","meal","cleaning","medication_reminder","followup","post_surgery"];
const statuses: CareOrder["status"][] = ["pending","confirmed","in_progress","completed","cancelled"];
const payStatuses: CareOrder["paymentStatus"][] = ["unpaid","paid","refunded"];
const notifyStatuses: CareOrder["familyNotificationStatus"][] = ["pending","sent","read"];
const prices = [120,200,150,80,180,60,90,50,100,300];

function genOrders(): CareOrder[] {
  const orders: CareOrder[] = [];
  for (let i = 0; i < 80; i++) {
    const st = statuses[i % 5];
    const day = (i % 28) + 1;
    const mon = (i % 3) + 4;
    orders.push({
      id: `ORD-${String(i + 1).padStart(3, "0")}`,
      organizationId: `ORG-${String((i % 5) + 1).padStart(3, "0")}`,
      elderId: `ELD-${String((i % 30) + 1).padStart(3, "0")}`,
      careProviderId: `CP-${String((i % 15) + 1).padStart(3, "0")}`,
      serviceType: svcTypes[i % 10],
      status: st,
      scheduledStartAt: `2025-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(8 + i % 10).padStart(2, "0")}:00:00Z`,
      scheduledEndAt: `2025-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(10 + i % 8).padStart(2, "0")}:00:00Z`,
      price: prices[i % 10],
      paymentStatus: st === "completed" ? "paid" : st === "cancelled" ? "refunded" : payStatuses[i % 3],
      familyNotificationStatus: notifyStatuses[i % 3],
      createdAt: `2025-${String(mon).padStart(2, "0")}-${String(Math.max(day - 2, 1)).padStart(2, "0")}T08:00:00Z`,
      updatedAt: `2025-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}T10:00:00Z`,
    });
  }
  return orders;
}
export const mockCareOrders: CareOrder[] = genOrders();

const recTypes: CareRecord["recordType"][] = ["vital_check","medication","meal","bathing","exercise","companionship","transport","cleaning","observation"];
const contents: Record<string, string[]> = {
  vital_check: ["血压135/85mmHg，心率72次/分，体温36.5°C，指标正常","血压150/92mmHg，偏高，已记录并通知家属","血氧98%，体温36.3°C，各项指标正常","心率68次/分，血压128/80mmHg，状态良好"],
  medication: ["已按时服用降压药氨氯地平5mg","已服用二甲双胍500mg，餐后服用","今日用药全部完成，无遗漏","阿司匹林100mg已服用，无不良反应"],
  meal: ["午餐正常进食，食欲良好","早餐摄入偏少，仅喝了半碗粥","三餐正常，饮食均衡","晚餐未进食，主诉不饿，已通知家属"],
  bathing: ["协助完成洗浴，过程顺利","独立洗浴，已做好防滑措施","今日未洗浴，老人主诉疲劳","协助洗浴，皮肤状况良好，无异常"],
  exercise: ["完成30分钟散步，精神状态好","进行了15分钟简单拉伸运动","今日未运动，主诉膝盖疼痛","协助进行康复训练30分钟，配合度好"],
  companionship: ["陪聊1小时，老人情绪愉快","陪同看电视、读报纸，状态平静","老人情绪低落，已进行心理疏导，有所改善","陪同下棋和聊天，互动良好"],
  transport: ["陪同前往社区卫生中心复查，安全往返","协助乘车前往医院就诊","陪同前往公园散步30分钟","接送至日间照料中心，安全到达"],
  cleaning: ["完成居室内整理清洁，环境整洁","厨房和卫生间已消毒清洁","更换床单被罩，整理衣柜","客厅和卧室清扫完毕"],
  observation: ["老人今日精神状态良好，睡眠充足","夜间起夜3次，睡眠质量一般","老人情绪稳定，社交活动参与积极","发现老人左脚踝轻微肿胀，已记录并通知家属"],
};

function genRecords(): CareRecord[] {
  const records: CareRecord[] = [];
  for (let i = 0; i < 120; i++) {
    const rt = recTypes[i % 9];
    const cs = contents[rt];
    const risk: CareRecord["riskLevel"] = i % 15 === 0 ? "high" : i % 7 === 0 ? "medium" : i % 12 === 0 ? "low" : "none";
    records.push({
      id: `REC-${String(i + 1).padStart(3, "0")}`,
      careOrderId: `ORD-${String((i % 80) + 1).padStart(3, "0")}`,
      elderId: `ELD-${String((i % 30) + 1).padStart(3, "0")}`,
      careProviderId: `CP-${String((i % 15) + 1).padStart(3, "0")}`,
      recordType: rt,
      content: cs[i % cs.length],
      riskLevel: risk,
      familyVisible: i % 4 !== 0,
      createdAt: `2025-${String((i % 3) + 4).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T${String(8 + i % 10).padStart(2, "0")}:${String((i * 17) % 60).padStart(2, "0")}:00Z`,
      updatedAt: `2025-${String((i % 3) + 4).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T${String(9 + i % 10).padStart(2, "0")}:00:00Z`,
    });
  }
  return records;
}
export const mockCareRecords: CareRecord[] = genRecords();
