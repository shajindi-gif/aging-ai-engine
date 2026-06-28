import type { CareRecord } from "@/lib/types";

const recordTypes: CareRecord["recordType"][] = [
  "vital_check", "medication", "meal", "bathing", "exercise",
  "companionship", "transport", "cleaning", "observation",
];
const riskLevels: CareRecord["riskLevel"][] = ["none", "none", "none", "low", "low", "medium", "high"];

const contentByType: Record<CareRecord["recordType"], string[]> = {
  vital_check: [
    "测量血压130/82mmHg，脉搏72次/分，体温36.5℃，各项指标正常",
    "血压偏高145/95mmHg，已通知家属并建议就医复查",
    "空腹血糖7.2mmol/L，餐后血糖10.1mmol/L，血糖控制尚可",
    "血氧饱和度96%，呼吸平稳，无明显不适",
    "体温37.8℃低烧，已给予物理降温，持续观察中",
    "心率偏快98次/分，偶有不规则跳动，已建议心电图检查",
    "血压128/80mmHg正常范围，精神状态良好",
    "血糖监测：空腹6.8mmol/L，控制良好",
  ],
  medication: [
    "已按时服用降压药氨氯地平5mg，无不良反应",
    "胰岛素注射完成，注射部位无红肿硬结",
    "多药同时服用，已核对药物相互作用，无异常",
    "药物服用完毕，左旋多巴250mg按时服用",
    "发现老人漏服昨日降糖药，已补服并加强提醒",
    "更换新药阿仑膦酸钠70mg，已向老人说明用药注意事项",
    "药品已按医嘱调整，二甲双胍由500mg调至250mg",
    "服药后30分钟观察无过敏反应，记录完成",
  ],
  meal: [
    "午餐已食用，米饭一碗、蔬菜、清蒸鱼，食欲良好",
    "早餐：小米粥、鸡蛋、全麦面包，进食顺利",
    "晚餐摄入较少，仅喝半碗汤，需关注营养摄入",
    "按照糖尿病饮食方案配餐，低盐低糖，老人表示满意",
    "协助进食，需切碎食物，吞咽功能正常",
    "老人今日食欲不佳，已调整菜单并增加营养汤品",
    "送餐上门，菜品包括红烧排骨、清炒时蔬、紫菜蛋花汤",
    "协助老人用餐，进食速度适中，无呛咳",
  ],
  bathing: [
    "助浴服务完成，水温适中，老人状态良好，皮肤无异常",
    "擦浴完成，重点清洁背部和下肢，皮肤完整无破损",
    "助浴过程中发现左前臂有小面积瘀斑，已拍照记录",
    "浴室防滑措施到位，助浴过程安全顺利",
    "协助洗头、修剪指甲，个人卫生护理完成",
    "助浴后检查皮肤无红肿破损，涂抹润肤乳",
  ],
  exercise: [
    "陪同老人散步30分钟，步速稳定，无不适反应",
    "辅助康复训练：关节活动度训练、平衡练习各20分钟",
    "太极拳锻炼40分钟，动作舒展，精神状态佳",
    "手指操和认知训练各15分钟，老人配合度较好",
    "因天气原因室内进行原地踏步和拉伸运动20分钟",
    "轮椅推行公园一圈约20分钟，心情愉悦",
    "呼吸操训练15分钟，配合缩唇呼吸和腹式呼吸练习",
  ],
  companionship: [
    "陪伴聊天1小时，聊了年轻时的故事，情绪愉快",
    "一起下棋两局，老人思维清晰，棋艺不错",
    "陪同观看电视新闻并讨论时事，老人关心社会动态",
    "教老人使用视频通话与远方子女联系，老人很高兴",
    "一起做手工折纸活动，锻炼手指灵活性",
    "读报纸给老人听，讨论了健康和养生话题",
    "陪同参加社区书法活动，老人写了一幅毛笔字",
    "心理慰藉：老人近日情绪低落，已耐心倾听并给予安慰",
  ],
  transport: [
    "陪同乘坐出租车前往浦东新区人民医院，行程顺利",
    "轮椅推行至社区卫生中心，完成疫苗接种后返回",
    "陪同前往药店购买处方药品，已核对药品清单",
    "护送老人至康复中心进行理疗，已在等候区待命",
    "陪同前往社保中心办理长护险申请手续",
    "护送老人从医院返家，途中状态平稳",
  ],
  cleaning: [
    "居室清洁完成，重点打扫卧室和卫生间，通风换气",
    "清洗床单被套，整理衣柜，居室环境焕然一新",
    "厨房深度清洁，清洗油烟机和灶台，检查食品保质期",
    "更换空调滤网，清洗窗帘，整体环境改善",
    "卫生间消毒清洁，安装新防滑垫",
    "整理药柜，按有效期分类摆放，清理过期药品",
  ],
  observation: [
    "夜间巡视：老人睡眠安稳，无异常翻身或呻吟",
    "发现老人行走时步态不稳，已增加扶手并通知家属",
    "情绪观察：老人连续两天情绪低落，建议家属多陪伴",
    "饮食观察：近3天食量减少约30%，已调整饮食方案",
    "皮肤观察：骶尾部有轻微发红，已更换体位并涂抹防护霜",
    "夜间发现老人起夜频繁（4次），已记录并建议泌尿科就诊",
    "注意到老人偶有咳嗽伴少量白痰，已测体温正常",
    "精神状态良好，与护理员主动交流，配合度高",
  ],
};

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const elderCount = 31;
const providerCount = 15;
const orderCount = 85;

export const mockCareRecords: CareRecord[] = [];

for (let i = 1; i <= 130; i++) {
  const rType = recordTypes[(i - 1) % recordTypes.length];
  const contents = contentByType[rType];
  const contentIdx = Math.floor(pseudoRandom(i * 7) * contents.length);
  const daysAgo = (i - 1) % 28;
  const hour = 8 + ((i * 2) % 12);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor(pseudoRandom(i * 13) * 60), 0, 0);

  mockCareRecords.push({
    id: `CR-${String(i).padStart(3, "0")}`,
    careOrderId: `ORD-${String(((i - 1) % orderCount) + 1).padStart(3, "0")}`,
    elderId: `ELD-${String(((i - 1) % elderCount) + 1).padStart(3, "0")}`,
    careProviderId: `CP-${String(((i - 1) % providerCount) + 1).padStart(3, "0")}`,
    recordType: rType,
    content: contents[contentIdx],
    riskLevel: riskLevels[Math.floor(pseudoRandom(i * 3) * riskLevels.length)],
    familyVisible: i % 4 !== 0,
    createdAt: d.toISOString(),
    updatedAt: d.toISOString(),
  });
}
