import type { CareProvider } from "@/lib/types";

const names = ["陈晓燕","刘伟","王芳","张敏","李秀英","赵磊","孙丽华","周强","吴娟","郑婷","马超","黄玉兰","林志明","何小红","杨秋萍"];
const roles: CareProvider["role"][] = ["escort","nurse","rehab","companion","manager"];
const skills = [["陪诊","挂号","取药"],["护理","输液","伤口处理"],["康复训练","运动指导"],["陪伴聊天","心理疏导"],["排班管理","质量监控"],["助浴","生活照料"],["血压测量","血糖监测"],["送餐","营养指导"],["中医推拿","理疗"],["用药提醒","健康宣教"]];
const avails: CareProvider["availabilityStatus"][] = ["available","busy","off_duty"];

export const mockProviders: CareProvider[] = names.map((n, i) => ({
  id: `CP-${String(i + 1).padStart(3, "0")}`,
  organizationId: `ORG-${String((i % 5) + 1).padStart(3, "0")}`,
  name: n,
  role: roles[i % 5],
  skillTags: skills[i % skills.length],
  phone: `1${3 + (i % 7)}${String(30000000 + i * 2345678).slice(0, 8)}`,
  availabilityStatus: avails[i % 3],
  rating: +(3.5 + (i % 15) / 10).toFixed(1),
  createdAt: "2024-06-01T08:00:00Z",
  updatedAt: "2025-05-15T10:00:00Z",
}));
