// SilverCare 页面共享工具（客户端安全）

export const MEDICAL_DISCLAIMER_TEXT =
  "本产品用于健康管理、风险提示及照护辅助，不替代专业医疗诊断或治疗。如出现严重胸痛、明显呼吸困难、意识异常、严重跌倒或无法唤醒，请立即联系当地急救服务。";

export const RISK_LEVEL_LABEL: Record<string, string> = {
  LOW: "低风险", MODERATE: "中等风险", HIGH: "高风险",
};
export const RISK_LEVEL_COLOR: Record<string, string> = {
  LOW: "text-success", MODERATE: "text-warning", HIGH: "text-danger",
};

export const TASK_TYPE_LABEL: Record<string, string> = {
  VITALS_BP: "测血压", VITALS_SPO2: "测血氧", MEDICATION: "吃药", REHAB: "康复训练",
  WALK: "散步", WATER: "饮水", CLINIC: "就医", FOLLOWUP: "复诊",
  FAMILY_CONTACT: "家属联系", CAREGIVER_VISIT: "护理员上门", OTHER: "其他",
};

export const TASK_STATUS_LABEL: Record<string, string> = {
  PENDING: "待完成", COMPLETED: "已完成", MISSED: "未完成", CANCELLED: "已取消",
};

export const ALERT_LEVEL_LABEL: Record<number, string> = { 1: "普通提醒", 2: "需家属关注", 3: "建议人工介入" };
export const ALERT_LEVEL_COLOR: Record<number, string> = {
  1: "yc-badge yc-badge-warning", 2: "yc-badge yc-badge-gold", 3: "yc-badge yc-badge-danger",
};

export const STATUS_LABEL: Record<string, string> = {
  stable: "总体稳定", attention: "需要关注", concern: "建议尽快关注",
};

export function calcAge(birthDate?: string | Date | null): number | null {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  return new Date().getFullYear() - d.getFullYear();
}

export async function fetchElders(): Promise<{ id: string; name: string; birthDate: string; careLevel: string; livingStatus: string | null }[]> {
  const res = await fetch("/api/elders?pageSize=50", { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  const list = json?.data?.elders ?? json?.data ?? [];
  return Array.isArray(list) ? list : [];
}
