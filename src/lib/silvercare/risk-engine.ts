// ═══════════════════════════════════════════════
// SilverMove 风险引擎 — 规则型 MVP（非临床验证）
// Experimental / For Health Management Only
// ═══════════════════════════════════════════════

export interface FallRiskInput {
  age: number;
  fellLast12Months?: boolean;
  usesWalkingAid?: boolean;
  /** 5 次起立-坐下总耗时（秒），>=12s 视为偏慢（参考 30s STS 方向性阈值，非诊断） */
  sitToStandSec?: number | null;
  /** 步行速度（米/秒），<0.8 偏慢 */
  gaitSpeed?: number | null;
  /** 单脚站立坚持秒数（或半串联） */
  balanceHoldSec?: number | null;
  /** 日常活动能力受限 */
  adlLimited?: boolean;
  hasDizziness?: boolean;
  hasVisionProblem?: boolean;
  medicationCount?: number;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  detail: string;
}

export interface FallRiskResult {
  score: number; // 0-100
  level: "LOW" | "MODERATE" | "HIGH";
  frailtyLevel: "LOW" | "MODERATE" | "HIGH";
  factors: RiskFactor[];
  recommendations: string[];
  disclaimer: string;
}

export const RISK_DISCLAIMER =
  "本评估为实验性健康管理工具（Experimental / For Health Management Only），基于规则计算，未经临床验证，不构成医疗诊断。";

function levelFromScore(score: number): "LOW" | "MODERATE" | "HIGH" {
  if (score >= 65) return "HIGH";
  if (score >= 40) return "MODERATE";
  return "LOW";
}

export function computeFallRisk(input: FallRiskInput): FallRiskResult {
  const factors: RiskFactor[] = [];
  let score = 0;

  // 年龄（基础）
  if (input.age >= 80) {
    score += 15;
    factors.push({ factor: "age", weight: 15, detail: `${input.age} 岁，高龄` });
  } else if (input.age >= 70) {
    score += 8;
    factors.push({ factor: "age", weight: 8, detail: `${input.age} 岁` });
  }

  if (input.fellLast12Months) {
    score += 20;
    factors.push({ factor: "recent_fall", weight: 20, detail: "最近 12 个月内曾跌倒" });
  }
  if (input.usesWalkingAid) {
    score += 12;
    factors.push({ factor: "walking_aid", weight: 12, detail: "使用助行器" });
  }
  if (input.sitToStandSec != null && input.sitToStandSec >= 12) {
    const w = input.sitToStandSec >= 16 ? 15 : 10;
    score += w;
    factors.push({ factor: "sit_to_stand", weight: w, detail: `起立测试耗时 ${input.sitToStandSec}s（偏慢）` });
  }
  if (input.gaitSpeed != null && input.gaitSpeed < 0.8) {
    const w = input.gaitSpeed < 0.6 ? 14 : 9;
    score += w;
    factors.push({ factor: "gait_speed", weight: w, detail: `步行速度 ${input.gaitSpeed.toFixed(2)} m/s（偏慢）` });
  }
  if (input.balanceHoldSec != null && input.balanceHoldSec < 10) {
    const w = input.balanceHoldSec < 5 ? 12 : 7;
    score += w;
    factors.push({ factor: "balance", weight: w, detail: `平衡坚持 ${input.balanceHoldSec}s（偏短）` });
  }
  if (input.adlLimited) {
    score += 8;
    factors.push({ factor: "adl", weight: 8, detail: "日常活动能力受限" });
  }
  if (input.hasDizziness) {
    score += 8;
    factors.push({ factor: "dizziness", weight: 8, detail: "存在头晕症状" });
  }
  if (input.hasVisionProblem) {
    score += 5;
    factors.push({ factor: "vision", weight: 5, detail: "存在视力问题" });
  }
  if ((input.medicationCount ?? 0) >= 5) {
    score += 8;
    factors.push({ factor: "polypharmacy", weight: 8, detail: `用药 ${input.medicationCount} 种（多重用药）` });
  } else if ((input.medicationCount ?? 0) >= 3) {
    score += 4;
    factors.push({ factor: "polypharmacy", weight: 4, detail: `用药 ${input.medicationCount} 种` });
  }

  score = Math.min(100, Math.max(0, Math.round(score)));
  const level = levelFromScore(score);

  // 衰弱：功能表现主导
  let frailtyScore = 0;
  if (input.sitToStandSec != null && input.sitToStandSec >= 14) frailtyScore += 30;
  if (input.gaitSpeed != null && input.gaitSpeed < 0.7) frailtyScore += 30;
  if (input.balanceHoldSec != null && input.balanceHoldSec < 8) frailtyScore += 20;
  if (input.adlLimited) frailtyScore += 20;
  const frailtyLevel = levelFromScore(frailtyScore);

  const recommendations: string[] = [];
  if (level !== "LOW") {
    recommendations.push("建议在护理人员或家人陪同下进行下肢力量与平衡训练（如坐站练习、扶椅单脚站立）");
    recommendations.push("建议进行家庭环境防跌倒检查：地面防滑、夜间照明、扶手、去除通道障碍物");
  }
  if (input.fellLast12Months) {
    recommendations.push("近一年有跌倒史，建议咨询专业医护人员评估跌倒原因");
  }
  if ((input.medicationCount ?? 0) >= 5) {
    recommendations.push("用药种类较多，建议请医生或药师复核用药方案");
  }
  if (recommendations.length === 0) {
    recommendations.push("目前风险较低，建议保持规律活动与均衡饮食，定期复查");
  }

  return {
    score,
    level,
    frailtyLevel,
    factors: factors.sort((a, b) => b.weight - a.weight),
    recommendations,
    disclaimer: RISK_DISCLAIMER,
  };
}
