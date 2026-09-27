// ═══════════════════════════════════════════════
// SilverCare MVP Demo Seed — 5 名模拟老人 × 30 天数据
// 运行：npx tsx prisma/seed-silvercare.ts
// 数据为演示用途（source="demo"），不含真实个人信息
// ═══════════════════════════════════════════════
import { PrismaClient } from "@prisma/client";
import { computeFallRisk } from "../src/lib/silvercare/risk-engine";

const prisma = new PrismaClient();

// 确定性伪随机（保证每次 seed 的演示数据一致）
let seedState = 42;
function rand() {
  seedState = (seedState * 9301 + 49297) % 233280;
  return seedState / 233280;
}
const jitter = (base: number, amp: number) => Math.round(base + (rand() - 0.5) * 2 * amp);
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8, 0, 0, 0);
  return d;
};

interface ElderSpec {
  name: string; gender: "MALE" | "FEMALE"; birthYear: number; livingStatus: string;
  careLevel: "INDEPENDENT" | "SEMI_DEPENDENT" | "DEPENDENT" | "CRITICAL";
  questionnaire: { fellLast12Months: boolean; usesWalkingAid: boolean; adlLimited: boolean; hasDizziness: boolean; hasVisionProblem: boolean; medicationCount: number };
  mobility: { stsSec: number; walk4mSec: number; balanceSec: number };
  vitals: (day: number) => Partial<{
    systolicBP: number; diastolicBP: number; heartRate: number; spo2: number;
    respiratoryRate: number; steps: number; sleepHours: number; dyspneaLevel: number; fatigueLevel: number;
  }>;
}

const ELDER_C_VITALS = (day: number) => {
  // 王奶奶（Elder C）：越接近今天（day 越小）状况越差 —— 血氧持续下降 + 活动量下降 + 呼吸困难上升
  // day: 0=今天, 29=29天前
  const clamp = (n: number) => Math.max(0, Math.min(4, n));
  const spo2 = 92 + clamp(day);              // 今天92 → 4天前96 → 更早96
  const steps = 2200 + clamp(day) * 500;     // 今天2200 → 4天前4200 → 更早4200
  const dyspnea = 4 - clamp(day);            // 今天4 → 4天前0
  return {
    systolicBP: jitter(132, 6), diastolicBP: jitter(78, 4), heartRate: jitter(76, 5),
    spo2, respiratoryRate: jitter(17, 1), steps,
    sleepHours: +(6.2 + (rand() - 0.5)).toFixed(1), dyspneaLevel: Math.max(0, dyspnea), fatigueLevel: jitter(3, 1),
  };
};

const ELDER_SPECS: ElderSpec[] = [
  {
    name: "李国强", gender: "MALE", birthYear: 1954, livingStatus: "与子女同住", careLevel: "INDEPENDENT",
    questionnaire: { fellLast12Months: false, usesWalkingAid: false, adlLimited: false, hasDizziness: false, hasVisionProblem: false, medicationCount: 1 },
    mobility: { stsSec: 10.5, walk4mSec: 5.2, balanceSec: 14 },
    vitals: (day) => ({ systolicBP: jitter(126, 5), diastolicBP: jitter(76, 4), heartRate: jitter(70, 4), spo2: jitter(97, 0.5), respiratoryRate: jitter(15, 1), steps: jitter(5800, 500), sleepHours: +(7 + (rand() - 0.5)).toFixed(1), dyspneaLevel: 0, fatigueLevel: jitter(1, 1) }),
  },
  {
    name: "赵凤珍", gender: "FEMALE", birthYear: 1945, livingStatus: "独居", careLevel: "SEMI_DEPENDENT",
    questionnaire: { fellLast12Months: true, usesWalkingAid: true, adlLimited: false, hasDizziness: false, hasVisionProblem: true, medicationCount: 3 },
    mobility: { stsSec: 14.8, walk4mSec: 7.5, balanceSec: 6 },
    vitals: (day) => ({ systolicBP: jitter(142, 8), diastolicBP: jitter(84, 5), heartRate: jitter(74, 5), spo2: jitter(95, 0.5), respiratoryRate: jitter(16, 1), steps: jitter(2400, 400), sleepHours: +(6 + (rand() - 0.5)).toFixed(1), dyspneaLevel: jitter(1, 1), fatigueLevel: jitter(2, 1) }),
  },
  {
    name: "王秀兰", gender: "FEMALE", birthYear: 1950, livingStatus: "居家", careLevel: "SEMI_DEPENDENT", // 76 岁，术后康复
    questionnaire: { fellLast12Months: false, usesWalkingAid: true, adlLimited: false, hasDizziness: false, hasVisionProblem: false, medicationCount: 4 },
    mobility: { stsSec: 13.5, walk4mSec: 7.0, balanceSec: 7 },
    vitals: ELDER_C_VITALS,
  },
  {
    name: "陈志明", gender: "MALE", birthYear: 1942, livingStatus: "养老机构", careLevel: "DEPENDENT",
    questionnaire: { fellLast12Months: false, usesWalkingAid: false, adlLimited: true, hasDizziness: true, hasVisionProblem: true, medicationCount: 6 },
    mobility: { stsSec: 17.2, walk4mSec: 9.8, balanceSec: 4 },
    vitals: (day) => ({ systolicBP: jitter(148, 8), diastolicBP: jitter(86, 5), heartRate: jitter(80, 6), spo2: jitter(93, 1), respiratoryRate: jitter(19, 1), steps: jitter(1100, 250), sleepHours: +(5.5 + (rand() - 0.5)).toFixed(1), dyspneaLevel: jitter(3, 1), fatigueLevel: jitter(4, 1) }),
  },
  {
    name: "孙桂英", gender: "FEMALE", birthYear: 1957, livingStatus: "社区照护", careLevel: "INDEPENDENT",
    questionnaire: { fellLast12Months: false, usesWalkingAid: false, adlLimited: false, hasDizziness: false, hasVisionProblem: false, medicationCount: 2 },
    mobility: { stsSec: 11.2, walk4mSec: 5.6, balanceSec: 12 },
    vitals: (day) => ({ systolicBP: jitter(124, 5), diastolicBP: jitter(74, 4), heartRate: jitter(72, 4), spo2: jitter(97, 0.5), respiratoryRate: jitter(15, 1), steps: jitter(5200, 450), sleepHours: +(7.2 + (rand() - 0.5)).toFixed(1), dyspneaLevel: 0, fatigueLevel: jitter(1, 1) }),
  },
];

async function main() {
  console.log("── SilverCare Demo Seed 开始 ──");

  for (const spec of ELDER_SPECS) {
    // 若同名演示老人已存在则跳过（幂等）
    const exists = await prisma.elderlyProfile.findFirst({ where: { name: spec.name } });
    if (exists) {
      console.log(`跳过已存在：${spec.name}`);
      continue;
    }

    const elder = await prisma.elderlyProfile.create({
      data: {
        name: spec.name,
        gender: spec.gender,
        birthDate: new Date(`${spec.birthYear}-03-15T00:00:00Z`),
        livingStatus: spec.livingStatus,
        careLevel: spec.careLevel,
        serviceType: "HOME",
        tags: ["demo", "silvercare"],
      },
    });

    // 30 天健康数据
    for (let day = 29; day >= 0; day--) {
      await prisma.chronicMetric.create({
        data: {
          elderlyId: elder.id,
          metricDate: daysAgo(day),
          source: "demo",
          ...spec.vitals(day),
        },
      });
    }

    // 运动能力评估（3 项）+ 跌倒风险评分
    const gaitSpeed = +(4 / spec.mobility.walk4mSec).toFixed(2);
    const risk = computeFallRisk({
      age: new Date().getFullYear() - spec.birthYear,
      ...spec.questionnaire,
      sitToStandSec: spec.mobility.stsSec,
      gaitSpeed,
      balanceHoldSec: spec.mobility.balanceSec,
    });
    const stsAssessment = await prisma.mobilityAssessment.create({
      data: { elderlyId: elder.id, testType: "STS", reps: 5, durationSec: spec.mobility.stsSec, source: "manual", confidence: 0.8, notes: "演示数据" },
    });
    await prisma.mobilityAssessment.create({ data: { elderlyId: elder.id, testType: "WALK", durationSec: spec.mobility.walk4mSec, source: "manual", confidence: 0.8, notes: "4 米步行（演示）" } });
    await prisma.mobilityAssessment.create({ data: { elderlyId: elder.id, testType: "BALANCE", holdTimeSec: spec.mobility.balanceSec, source: "manual", confidence: 0.8, notes: "演示数据" } });
    await prisma.fallRiskScore.create({
      data: {
        elderlyId: elder.id, assessmentId: stsAssessment.id,
        score: risk.score, level: risk.level, frailtyLevel: risk.frailtyLevel,
        factors: risk.factors as object, recommendations: risk.recommendations, source: "rule-engine",
      },
    });

    // 今日照护任务
    const todayTaskTitles = [
      { title: "早上测一次血压", type: "VITALS_BP" },
      { title: "按时服用早/晚药物", type: "MEDICATION" },
      { title: "下午散步 15 分钟", type: "WALK" },
    ];
    for (const t of todayTaskTitles) {
      await prisma.careTask.create({
        data: { elderlyId: elder.id, title: t.title, type: t.type, scheduledTime: new Date(), source: "manual" },
      });
    }

    console.log(`✓ ${spec.name}（${new Date().getFullYear() - spec.birthYear} 岁）跌倒风险 ${risk.score}/100 ${risk.level}`);
  }

  console.log("── Seed 完成：5 名老人 × 30 天数据 ──");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
