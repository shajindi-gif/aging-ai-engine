// ═══════════════════════════════════════════════
// SilverHeart 趋势引擎 — 7/30 天健康趋势与异常信号
// 只输出风险信号/异常趋势，不做疾病诊断
// ═══════════════════════════════════════════════

export interface DailyVitals {
  date: string; // YYYY-MM-DD
  heartRate?: number | null;
  restingHR?: number | null;
  systolicBP?: number | null;
  diastolicBP?: number | null;
  spo2?: number | null;
  respiratoryRate?: number | null;
  steps?: number | null;
  sleepHours?: number | null;
  coughLevel?: number | null;
  dyspneaLevel?: number | null;
  chestTightness?: number | null;
  fatigueLevel?: number | null;
}

export interface TrendPoint {
  date: string;
  value: number | null;
}

export interface TrendSummary {
  metric: string;
  unit: string;
  window: 7 | 30;
  points: TrendPoint[];
  first: number | null;
  last: number | null;
  changeAbs: number | null;
  changePct: number | null;
  direction: "up" | "down" | "flat" | "insufficient";
}

export interface TrendAlertSignal {
  category: "VITALS" | "ACTIVITY" | "SYMPTOM" | "SLEEP";
  level: 1 | 2 | 3;
  title: string;
  message: string;
}

export const EMERGENCY_HINT =
  "如出现严重胸痛、明显呼吸困难、意识异常、严重跌倒或无法唤醒等情况，请立即联系当地急救服务或医疗机构。";

type MetricKey =
  | "heartRate" | "spo2" | "systolicBP" | "respiratoryRate"
  | "steps" | "sleepHours" | "dyspneaLevel";

const METRIC_DEFS: Record<MetricKey, { label: string; unit: string }> = {
  heartRate: { label: "心率", unit: "bpm" },
  spo2: { label: "血氧饱和度", unit: "%" },
  systolicBP: { label: "收缩压", unit: "mmHg" },
  respiratoryRate: { label: "呼吸频率", unit: "次/分" },
  steps: { label: "活动量（步数）", unit: "步" },
  sleepHours: { label: "睡眠时长", unit: "小时" },
  dyspneaLevel: { label: "呼吸困难评分", unit: "/10" },
};

function summarize(
  vitals: DailyVitals[], key: MetricKey, window: 7 | 30
): TrendSummary {
  const points: TrendPoint[] = vitals.map((v) => ({
    date: v.date,
    value: (v[key] as number | null | undefined) ?? null,
  })).filter((p) => p.value != null);

  const def = METRIC_DEFS[key];
  if (points.length < 2) {
    return { metric: def.label, unit: def.unit, window, points, first: null, last: null, changeAbs: null, changePct: null, direction: "insufficient" };
  }
  const first = points[0].value!;
  const last = points[points.length - 1].value!;
  const changeAbs = last - first;
  const changePct = first !== 0 ? (changeAbs / first) * 100 : null;
  const direction =
    changePct == null || Math.abs(changePct) < 3
      ? "flat"
      : changeAbs > 0 ? "up" : "down";
  return { metric: def.label, unit: def.unit, window, points, first, last, changeAbs: +changeAbs.toFixed(1), changePct: changePct == null ? null : +changePct.toFixed(1), direction };
}

/** 计算 7 天与 30 天趋势摘要 */
export function computeTrends(vitals: DailyVitals[]): { d7: TrendSummary[]; d30: TrendSummary[] } {
  const sorted = [...vitals].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const last30 = sorted.slice(-30);
  const keys: MetricKey[] = ["spo2", "heartRate", "systolicBP", "respiratoryRate", "steps", "sleepHours", "dyspneaLevel"];
  return {
    d7: keys.map((k) => summarize(last7, k, 7)),
    d30: keys.map((k) => summarize(last30, k, 30)),
  };
}

/**
 * 基于趋势的异常信号检测（规则型，非诊断）。
 * 信号等级：1=普通提醒 2=需家属关注 3=建议人工介入
 */
export function detectTrendAlerts(vitals: DailyVitals[]): TrendAlertSignal[] {
  const sorted = [...vitals].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const last5 = sorted.slice(-5);
  const alerts: TrendAlertSignal[] = [];

  // 血氧连续下降（5 天内 ≥2% 且末值偏低）
  const spo2 = last5.map((v) => v.spo2).filter((x): x is number => x != null);
  if (spo2.length >= 3) {
    const first = spo2[0];
    const last = spo2[spo2.length - 1];
    const monotonicDown = spo2.slice(1).every((v, i) => v <= spo2[i]);
    if (monotonicDown && last <= first - 2) {
      alerts.push({
        category: "VITALS",
        level: last <= 92 ? 3 : 2,
        title: "血氧连续下降",
        message: `过去 ${spo2.length} 天血氧从 ${first}% 降至 ${last}%，建议复测血氧并关注呼吸状态。`,
      });
    } else if (last <= 93) {
      alerts.push({ category: "VITALS", level: 2, title: "血氧偏低", message: `最近血氧 ${last}%，低于常规范围，建议复测并告知家属。` });
    }
  }

  // 活动量明显下降（7 天对比，>25%）
  const steps7 = last7.map((v) => v.steps).filter((x): x is number => x != null);
  if (steps7.length >= 5) {
    const half = Math.floor(steps7.length / 2);
    const early = steps7.slice(0, half);
    const late = steps7.slice(-half);
    const avgEarly = early.reduce((a, b) => a + b, 0) / early.length;
    const avgLate = late.reduce((a, b) => a + b, 0) / late.length;
    if (avgEarly > 0 && avgLate / avgEarly < 0.75) {
      const drop = Math.round((1 - avgLate / avgEarly) * 100);
      alerts.push({
        category: "ACTIVITY",
        level: drop > 40 ? 2 : 1,
        title: "活动量明显下降",
        message: `近几日日均步数较前段下降约 ${drop}%，建议了解老人状态、鼓励适度活动。`,
      });
    }
  }

  // 呼吸困难评分上升
  const dysp = last7.map((v) => v.dyspneaLevel).filter((x): x is number => x != null);
  if (dysp.length >= 3 && dysp[dysp.length - 1] >= 3 && dysp[dysp.length - 1] >= (dysp[0] ?? 0) + 1) {
    alerts.push({
      category: "SYMPTOM",
      level: dysp[dysp.length - 1] >= 5 ? 3 : 2,
      title: "呼吸困难评分上升",
      message: `呼吸困难评分升至 ${dysp[dysp.length - 1]}/10，建议复测血氧；${EMERGENCY_HINT}`,
    });
  }

  // 血压偏高
  const sys = last7.map((v) => v.systolicBP).filter((x): x is number => x != null);
  if (sys.length >= 3 && sys.filter((v) => v >= 150).length >= 3) {
    alerts.push({ category: "VITALS", level: 2, title: "血压持续偏高", message: "近几日收缩压多次 ≥150mmHg，建议复测并咨询医生是否需要调整方案。" });
  }

  return alerts;
}
