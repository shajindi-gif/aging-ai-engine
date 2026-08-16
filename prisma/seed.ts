import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Import mock data (type-only imports in mock files are stripped by tsx/esbuild)
import { mockPolicies } from "../src/lib/mock/policies";
import {
  mockElders,
  mockFamilyMembers,
  mockMedicalVisits,
  mockMedicationReminders,
  mockChronicMetrics,
  mockRiskEvents,
} from "../src/lib/mock/elders";
import { mockCareOrders, mockCareRecords } from "../src/lib/mock/care-orders";
import { mockInstitutions } from "../src/lib/mock/institutions";
import { mockLeads } from "../src/lib/mock/sales-leads";
import { mockProviders } from "../src/lib/mock/providers";
import { mockPricingPlans } from "../src/lib/mock/growth-data";

const prisma = new PrismaClient();

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function parseRegion(region: string): { province: string; city: string; district?: string } {
  // e.g. "上海市浦东新区" → { province: "上海市", city: "上海市", district: "浦东新区" }
  // e.g. "全国" → { province: "全国", city: "" }
  if (region === "全国") return { province: "全国", city: "" };
  const m = region.match(/^(.+?省|.+?市)(.+?市|.+?区|.+?县|.+?区)?(.*)$/);
  if (m) {
    const province = m[1];
    const city = m[2] || m[1];
    const district = m[3] || undefined;
    return { province, city, district };
  }
  return { province: region, city: region };
}

const careLevelMap: Record<string, "INDEPENDENT" | "SEMI_DEPENDENT" | "DEPENDENT" | "CRITICAL"> = {
  independent: "INDEPENDENT",
  semi_dependent: "SEMI_DEPENDENT",
  dependent: "DEPENDENT",
  critical: "CRITICAL",
};

const genderMap: Record<string, "MALE" | "FEMALE"> = {
  male: "MALE",
  female: "FEMALE",
};

const policyCategoryMap: Record<string, string> = {
  subsidy: "SUBSIDY",
  insurance: "INSURANCE",
  service: "SERVICE",
  housing: "HOUSING",
  medical: "MEDICAL",
  employment: "EMPLOYMENT",
  tax: "TAX",
  long_term_care: "LONG_TERM_CARE",
  smart_aging: "SMART_AGING",
  training: "TRAINING",
};

const policyLevelMap: Record<string, string> = {
  national: "NATIONAL",
  provincial: "PROVINCIAL",
  municipal: "MUNICIPAL",
  district: "DISTRICT",
};

const policyStatusMap: Record<string, string> = {
  active: "ACTIVE",
  expired: "EXPIRED",
  upcoming: "UPCOMING",
};

const careOrderTypeMap: Record<string, string> = {
  escort: "ESCORT",
  nursing: "NURSING",
  rehabilitation: "REHABILITATION",
  companion: "COMPANION",
  bathing: "BATHING",
  meal: "MEAL",
  cleaning: "CLEANING",
  medication_reminder: "MEDICATION_REMINDER",
  followup: "FOLLOWUP",
  post_surgery: "POST_SURGERY",
};

const careOrderStatusMap: Record<string, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  in_progress: "IN_PROGRESS",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

const paymentStatusMap: Record<string, string> = {
  unpaid: "UNPAID",
  paid: "PAID",
  refunded: "REFUNDED",
};

const institutionTypeMap: Record<string, string> = {
  nursing_home: "NURSING_HOME",
  nursing_facility: "NURSING_HOME",
  rehab_center: "REHABILITATION_CENTER",
  community_station: "COMMUNITY_DAY_CARE",
  day_care: "DAY_CARE_CENTER",
  escort_company: "ESCORT_COMPANY",
  home_care_team: "HOME_CARE_AGENCY",
  renovation_vendor: "RENOVATION_VENDOR",
};

const riskFlagTypeMap: Record<string, string> = {
  fall: "FALL",
  medication: "MEDICATION",
  vital: "VITAL",
  behavior: "BEHAVIOR",
  nutrition: "NUTRITION",
  wandering: "OTHER",
  infection: "OTHER",
  other: "OTHER",
};

const riskLevelMap: Record<string, string> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  critical: "CRITICAL",
};

const salesLeadSourceMap: Record<string, string> = {
  policy_scan: "POLICY_SCAN",
  web_crawl: "WEB_CRAWL",
  referral: "REFERRAL",
  exhibition: "EXHIBITION",
  cold_call: "COLD_CALL",
};

const salesLeadStatusMap: Record<string, string> = {
  new: "NEW",
  contacted: "CONTACTED",
  qualified: "QUALIFIED",
  proposal: "PROPOSAL",
  negotiation: "NEGOTIATION",
  won: "WON",
  lost: "LOST",
};

function digitalMaturityLevel(score: number): string {
  if (score >= 80) return "L5";
  if (score >= 65) return "L4";
  if (score >= 50) return "L3";
  if (score >= 35) return "L2";
  return "L1";
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  console.log("🌱 Starting database seed...\n");
  const start = Date.now();

  // ─── 1. Clear existing data (reverse dependency order) ───
  console.log("🗑  Clearing existing data...");
  await prisma.agentRun.deleteMany();
  await prisma.case.deleteMany();
  await prisma.serviceReport.deleteMany();
  await prisma.serviceRecord.deleteMany();
  await prisma.serviceTask.deleteMany();
  await prisma.riskEvent.deleteMany();
  await prisma.careOrder.deleteMany();
  await prisma.followUpReminder.deleteMany();
  await prisma.medicationReminder.deleteMany();
  await prisma.chronicMetric.deleteMany();
  await prisma.riskFlag.deleteMany();
  await prisma.visitRecord.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.healthSummary.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.carePlan.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.elderlyProfile.deleteMany();
  await prisma.policyChunk.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.digitalMaturity.deleteMany();
  await prisma.salesLead.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.careProvider.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.report.deleteMany();
  await prisma.entitlement.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.verificationToken.deleteMany();
  console.log("   ✔ All tables cleared\n");

  // ─── 2. Organizations ───
  console.log("📦 Inserting Organizations...");
  const orgs = [];
  const orgNames = [
    { name: "上海阳光养老服务中心", type: "NURSING_HOME" as const, province: "上海市", city: "上海市" },
    { name: "北京和睦健康养老有限公司", type: "CARE_COMPANY" as const, province: "北京市", city: "北京市" },
    { name: "深圳康乐社区养老服务站", type: "COMMUNITY_STATION" as const, province: "广东省", city: "深圳市" },
    { name: "杭州仁爱医养结合医院", type: "HOSPITAL" as const, province: "浙江省", city: "杭州市" },
    { name: "苏州幸福居家养老科技", type: "ENTERPRISE" as const, province: "江苏省", city: "苏州市" },
  ];
  for (let i = 0; i < 5; i++) {
    const org = await prisma.organization.create({
      data: {
        id: `ORG-${String(i + 1).padStart(3, "0")}`,
        name: orgNames[i].name,
        type: orgNames[i].type as any,
        address: `${orgNames[i].city}某某路${100 + i * 50}号`,
        city: orgNames[i].city,
        province: orgNames[i].province,
        contactName: ["陈经理", "王主任", "李院长", "赵主管", "刘总监"][i],
        contactPhone: `138${String(10000000 + i * 1234567).slice(0, 8)}`,
        licenseNo: `LIC-2024-${String(i + 1).padStart(4, "0")}`,
      },
    });
    orgs.push(org);
  }
  console.log(`   ✔ ${orgs.length} organizations created\n`);

  // ─── 3. Users ───
  console.log("👤 Inserting Users...");
  const demoPassword = await bcrypt.hash("demo123456", 10);
  const adminPassword = await bcrypt.hash("admin123456", 10);

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@yanglaoai999.com",
      name: "演示用户",
      passwordHash: demoPassword,
      role: "FAMILY",
      emailVerified: new Date(),
      organizationId: "ORG-001",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@yanglaoai999.com",
      name: "管理员",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
      organizationId: "ORG-001",
    },
  });
  console.log(`   ✔ 2 users created (demo + admin)\n`);

  // ─── 4. ElderlyProfiles ───
  console.log("👴 Inserting ElderlyProfiles...");
  const elderIdMap = new Map<string, string>(); // mockId → prismaId
  const elderNameMap = new Map<string, string>(); // mockId → name
  for (const e of mockElders) {
    const { province, city } = parseRegion(e.region);
    const profile = await prisma.elderlyProfile.create({
      data: {
        id: e.id,
        name: e.name,
        gender: (genderMap[e.gender] || "MALE") as any,
        birthDate: new Date(e.birthYear, 0, 1),
        phone: `1${3 + (parseInt(e.id.replace("ELD-", "")) % 7)}${String(50000000 + parseInt(e.id.replace("ELD-", "")) * 1111111).slice(0, 8)}`,
        address: e.address,
        city: city,
        province: province,
        careLevel: (careLevelMap[e.careLevel] || "INDEPENDENT") as any,
        serviceType: "HOME",
        livingStatus: e.livingStatus,
        incomeLevel: "中等",
        disabilityLevel: e.careLevel === "critical" ? "重度" : e.careLevel === "dependent" ? "中度" : "无",
        tags: e.chronicDiseases,
        organizationId: e.organizationId,
        userId: parseInt(e.id.replace("ELD-", "")) <= 5 ? demoUser.id : null,
      },
    });
    elderIdMap.set(e.id, profile.id);
    elderNameMap.set(e.id, e.name);
  }
  console.log(`   ✔ ${mockElders.length} elderly profiles created\n`);

  // ─── 5. EmergencyContacts ───
  console.log("📞 Inserting EmergencyContacts...");
  let ecCount = 0;
  for (const e of mockElders) {
    await prisma.emergencyContact.create({
      data: {
        name: e.emergencyContactName,
        phone: e.emergencyContactPhone,
        relationship: "家属",
        elderlyId: e.id,
      },
    });
    ecCount++;
  }
  console.log(`   ✔ ${ecCount} emergency contacts created\n`);

  // ─── 6. FamilyMembers ───
  console.log("👨‍👩‍👧 Inserting FamilyMembers...");
  let fmCount = 0;
  for (const fm of mockFamilyMembers) {
    await prisma.familyMember.create({
      data: {
        id: fm.id,
        name: fm.name,
        relationship: fm.relation,
        phone: fm.phone,
        isPrimary: mockFamilyMembers.findIndex((f) => f.elderId === fm.elderId) === mockFamilyMembers.indexOf(fm) ? true : false,
        elderlyId: fm.elderId,
      },
    });
    fmCount++;
  }
  console.log(`   ✔ ${fmCount} family members created\n`);

  // ─── 7. HealthSummaries ───
  console.log("🏥 Inserting HealthSummaries...");
  let hsCount = 0;
  const bloodTypes = ["A", "B", "AB", "O"];
  for (let i = 0; i < mockElders.length; i++) {
    const e = mockElders[i];
    await prisma.healthSummary.create({
      data: {
        elderlyId: e.id,
        chronicDiseases: e.chronicDiseases,
        allergies: i % 5 === 0 ? ["青霉素过敏"] : [],
        bloodType: bloodTypes[i % 4],
        disabilityLevel: e.careLevel === "critical" ? "重度" : e.careLevel === "dependent" ? "中度" : null,
      },
    });
    hsCount++;
  }
  console.log(`   ✔ ${hsCount} health summaries created\n`);

  // ─── 8. Medications ───
  console.log("💊 Inserting Medications...");
  const medsList = [
    { name: "氨氯地平", dosage: "5mg", frequency: "每日1次" },
    { name: "二甲双胍", dosage: "500mg", frequency: "每日2次" },
    { name: "阿司匹林", dosage: "100mg", frequency: "每日1次" },
    { name: "美多芭", dosage: "250mg", frequency: "每日3次" },
    { name: "阿仑膦酸钠", dosage: "70mg", frequency: "每周1次" },
    { name: "瑞舒伐他汀", dosage: "10mg", frequency: "每晚1次" },
    { name: "噻托溴铵", dosage: "18μg", frequency: "每日1次" },
    { name: "氯吡格雷", dosage: "75mg", frequency: "每日1次" },
  ];
  let medCount = 0;
  for (let i = 0; i < mockElders.length; i++) {
    const e = mockElders[i];
    // Give each elder 1-3 medications based on their chronic diseases
    const numMeds = Math.min(e.chronicDiseases.length, 3);
    for (let j = 0; j < numMeds; j++) {
      const med = medsList[(i + j) % medsList.length];
      await prisma.medication.create({
        data: {
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: new Date("2025-01-01"),
          endDate: null,
          prescribingDoctor: `张医生`,
          elderlyId: e.id,
        },
      });
      medCount++;
    }
  }
  console.log(`   ✔ ${medCount} medications created\n`);

  // ─── 9. VisitRecords ───
  console.log("📋 Inserting VisitRecords...");
  let vrCount = 0;
  for (const v of mockMedicalVisits) {
    await prisma.visitRecord.create({
      data: {
        id: v.id,
        date: new Date(v.visitDate),
        hospital: v.hospitalName,
        department: v.departmentName,
        diagnosis: v.diagnosisText,
        doctor: v.doctorName,
        notes: v.summary,
        elderlyId: v.elderId,
      },
    });
    vrCount++;
  }
  console.log(`   ✔ ${vrCount} visit records created\n`);

  // ─── 10. RiskFlags (elder-level, from mockRiskEvents) ───
  console.log("🚩 Inserting RiskFlags...");
  let rfCount = 0;
  for (const re of mockRiskEvents) {
    await prisma.riskFlag.create({
      data: {
        id: re.id.replace("RSK", "RF"),
        type: (riskFlagTypeMap[re.riskType] || "OTHER") as any,
        level: (riskLevelMap[re.riskLevel] || "LOW") as any,
        description: re.description,
        detectedAt: new Date(re.createdAt),
        resolvedAt: null,
        elderlyId: re.elderId,
      },
    });
    rfCount++;
  }
  console.log(`   ✔ ${rfCount} risk flags created\n`);

  // ─── 11. ChronicMetrics ───
  console.log("📊 Inserting ChronicMetrics...");
  let cmCount = 0;
  for (const m of mockChronicMetrics) {
    const data: any = {
      elderlyId: m.elderId,
      metricDate: new Date(m.measuredAt),
      notes: m.note,
    };
    // Map metricType to specific Prisma fields
    switch (m.metricType) {
      case "blood_pressure":
        data.systolicBP = Math.round(m.value);
        data.diastolicBP = Math.round(m.value * 0.6);
        break;
      case "blood_sugar":
        data.bloodSugar = m.value;
        break;
      case "heart_rate":
        data.heartRate = Math.round(m.value);
        break;
      case "weight":
        data.weight = m.value;
        break;
      case "temperature":
        data.temperature = m.value;
        break;
      case "oxygen":
        data.notes = `血氧饱和度: ${m.value}${m.unit}。${m.note}`;
        break;
    }
    await prisma.chronicMetric.create({ data });
    cmCount++;
  }
  console.log(`   ✔ ${cmCount} chronic metrics created\n`);

  // ─── 12. MedicationReminders ───
  console.log("⏰ Inserting MedicationReminders...");
  let mrCount = 0;
  for (const mr of mockMedicationReminders) {
    await prisma.medicationReminder.create({
      data: {
        id: mr.id,
        elderlyId: mr.elderId,
        medicationName: mr.medicationName,
        dosage: mr.dosage,
        frequency: mr.frequency,
        reminderTime: mr.reminderTime,
        active: mr.status === "active",
        missedCount: mr.status === "completed" ? 0 : Math.floor(Math.random() * 5),
      },
    });
    mrCount++;
  }
  console.log(`   ✔ ${mrCount} medication reminders created\n`);

  // ─── 13. FollowUpReminders (from medical visits with followUpDate) ───
  console.log("📅 Inserting FollowUpReminders...");
  let fuCount = 0;
  for (const v of mockMedicalVisits) {
    if (v.followUpDate) {
      await prisma.followUpReminder.create({
        data: {
          elderlyId: v.elderId,
          hospital: v.hospitalName,
          department: v.departmentName,
          doctor: v.doctorName,
          scheduledDate: new Date(v.followUpDate),
          reason: `${v.diagnosisText}复查`,
          notified: false,
          completed: false,
        },
      });
      fuCount++;
    }
  }
  console.log(`   ✔ ${fuCount} follow-up reminders created\n`);

  // ─── 14. CareOrders ───
  console.log("📝 Inserting CareOrders...");
  // Build provider name lookup
  const providerNameMap = new Map<string, string>();
  for (const p of mockProviders) {
    providerNameMap.set(p.id, p.name);
  }

  let coCount = 0;
  for (let i = 0; i < mockCareOrders.length; i++) {
    const co = mockCareOrders[i];
    const elderlyName = elderNameMap.get(co.elderId) || "未知";
    const caregiverName = providerNameMap.get(co.careProviderId) || null;
    await prisma.careOrder.create({
      data: {
        id: co.id,
        orderNo: `CO-${String(i + 1).padStart(6, "0")}`,
        elderlyId: co.elderId,
        elderlyName: elderlyName,
        type: (careOrderTypeMap[co.serviceType] || "ESCORT") as any,
        status: (careOrderStatusMap[co.status] || "PENDING") as any,
        scheduledAt: new Date(co.scheduledStartAt),
        completedAt: co.status === "completed" ? new Date(co.scheduledEndAt) : null,
        caregiverId: co.careProviderId,
        caregiverName: caregiverName,
        location: `服务地点${i + 1}`,
        notes: null,
        familyNotified: co.familyNotificationStatus !== "pending",
        price: co.price,
        paymentStatus: (paymentStatusMap[co.paymentStatus] || "UNPAID") as any,
        organizationId: co.organizationId,
      },
    });
    coCount++;
  }
  console.log(`   ✔ ${coCount} care orders created\n`);

  // ─── 15. RiskEvents (order-level, from mockRiskEvents linked to care orders) ───
  console.log("⚠️  Inserting RiskEvents...");
  let reCount = 0;
  for (const re of mockRiskEvents) {
    await prisma.riskEvent.create({
      data: {
        id: re.id,
        orderId: re.careOrderId,
        type: re.riskType,
        description: re.description,
        severity: (re.riskLevel === "critical" ? "HIGH" : riskLevelMap[re.riskLevel] || "LOW") as any,
        occurredAt: new Date(re.createdAt),
        handledBy: re.familyNotified ? "系统自动处理" : null,
        handledAt: re.familyNotified ? new Date(re.updatedAt) : null,
        resolution: re.actionTaken,
      },
    });
    reCount++;
  }
  console.log(`   ✔ ${reCount} risk events created\n`);

  // ─── 16. ServiceReports (for completed care orders) ───
  console.log("📄 Inserting ServiceReports...");
  let srCount = 0;
  for (const co of mockCareOrders) {
    if (co.status === "completed") {
      await prisma.serviceReport.create({
        data: {
          orderId: co.id,
          summary: `${careOrderTypeMap[co.serviceType] || "服务"}已完成，老人状态良好。`,
          healthObservations: ["生命体征正常", "精神状态良好"],
          recommendations: ["继续当前照护方案", "注意饮食均衡"],
          photos: [],
          submittedBy: providerNameMap.get(co.careProviderId) || "护理员",
        },
      });
      srCount++;
    }
  }
  console.log(`   ✔ ${srCount} service reports created\n`);

  // ─── 17. ServiceRecords ───
  console.log("📑 Inserting ServiceRecords...");
  let srecCount = 0;
  for (const rec of mockCareRecords) {
    await prisma.serviceRecord.create({
      data: {
        id: rec.id,
        careOrderId: rec.careOrderId,
        elderlyId: rec.elderId,
        providerId: rec.careProviderId,
        recordType: rec.recordType,
        content: rec.content,
        riskLevel: rec.riskLevel === "none" ? null : rec.riskLevel,
        familyVisible: rec.familyVisible,
      },
    });
    srecCount++;
  }
  console.log(`   ✔ ${srecCount} service records created\n`);

  // ─── 18. Policies ───
  console.log("📜 Inserting Policies...");
  let polCount = 0;
  for (const p of mockPolicies) {
    const { province, city } = parseRegion(p.region);
    await prisma.policy.create({
      data: {
        id: p.id,
        title: p.title,
        category: (policyCategoryMap[p.policyType] || "OTHER") as any,
        level: (policyLevelMap[p.level] || "MUNICIPAL") as any,
        province: province,
        city: city || null,
        department: p.department,
        effectiveDate: new Date(p.effectiveDate),
        expiryDate: new Date(p.expireDate),
        status: (policyStatusMap[p.status] || "ACTIVE") as any,
        summary: p.summary,
        fullText: p.eligibilityText,
        eligibility: [p.targetAudience],
        benefits: p.eligibilityText,
        requiredDocuments: p.materialsText.split("、").map((s) => s.trim()),
        applicationProcess: p.processText.split("→").map((s) => s.trim()),
        applicationUrl: null,
        contactPhone: null,
        tags: p.tags,
        sourceUrl: p.sourceUrl,
      },
    });
    polCount++;
  }
  console.log(`   ✔ ${polCount} policies created\n`);

  // ─── 19. Institutions ───
  console.log("🏢 Inserting Institutions...");
  let insCount = 0;
  for (const inst of mockInstitutions) {
    const { province, city, district } = parseRegion(inst.region);
    await prisma.institution.create({
      data: {
        id: inst.id,
        name: inst.name,
        type: (institutionTypeMap[inst.institutionType] || "NURSING_HOME") as any,
        province: province,
        city: city,
        district: district || null,
        address: inst.address,
        beds: inst.bedCount,
        occupancyRate: inst.bedCount > 0 ? 0.5 + (parseInt(inst.id.replace("INS-", "")) % 40) / 100 : null,
        priceMin: 2000 + (parseInt(inst.id.replace("INS-", "")) % 20) * 200,
        priceMax: 5000 + (parseInt(inst.id.replace("INS-", "")) % 20) * 300,
        priceUnit: "MONTH",
        services: inst.serviceTags,
        rating: 3.0 + (parseInt(inst.id.replace("INS-", "")) % 20) / 10,
        contactName: inst.contactName,
        contactPhone: inst.contactPhone,
        website: inst.sourceUrl,
        licenseNo: `INS-LIC-${inst.id.replace("INS-", "")}`,
        establishedYear: 2010 + (parseInt(inst.id.replace("INS-", "")) % 15),
        tags: inst.serviceTags,
      },
    });
    insCount++;
  }
  console.log(`   ✔ ${insCount} institutions created\n`);

  // ─── 20. DigitalMaturities ───
  console.log("📱 Inserting DigitalMaturities...");
  let dmCount = 0;
  for (const inst of mockInstitutions) {
    const score = inst.digitalMaturityScore;
    const level = digitalMaturityLevel(score);
    await prisma.digitalMaturity.create({
      data: {
        institutionId: inst.id,
        score: score,
        level: level as any,
        informationSystem: Math.min(score * 1.1, 100),
        dataManagement: Math.min(score * 0.9, 100),
        serviceDigitization: Math.min(score * 1.05, 100),
        staffTechAdoption: Math.min(score * 0.85, 100),
        familyEngagement: Math.min(score * 0.8, 100),
        recommendations: [
          score < 50 ? "建议引入基础信息化管理系统" : "建议升级到智能化管理平台",
          score < 30 ? "优先完善电子健康档案" : "建议增加家属互动功能",
        ],
      },
    });
    dmCount++;
  }
  console.log(`   ✔ ${dmCount} digital maturities created\n`);

  // ─── 21. SalesLeads ───
  console.log("🎯 Inserting SalesLeads...");
  let slCount = 0;
  for (const lead of mockLeads) {
    // Find institution name
    const inst = mockInstitutions.find((i) => i.id === lead.institutionId);
    await prisma.salesLead.create({
      data: {
        id: lead.id,
        institutionId: lead.institutionId,
        institutionName: inst?.name || "未知机构",
        contactName: inst?.contactName || null,
        contactPhone: inst?.contactPhone || null,
        contactRole: "负责人",
        source: (salesLeadSourceMap[lead.leadType] || "REFERRAL") as any,
        status: (salesLeadStatusMap[lead.followUpStatus] || "NEW") as any,
        priority: lead.score >= 70 ? "HIGH" : lead.score >= 40 ? "MEDIUM" : "LOW",
        estimatedValue: lead.score * 100,
        productInterest: [lead.suggestedProduct],
        score: lead.score,
        reason: lead.reason,
        notes: null,
        lastContactAt: null,
        nextFollowUpAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedTo: null,
      },
    });
    slCount++;
  }
  console.log(`   ✔ ${slCount} sales leads created\n`);

  // ─── 22. CareProviders ───
  console.log("👩‍⚕️ Inserting CareProviders...");
  let cpCount = 0;
  for (const p of mockProviders) {
    await prisma.careProvider.create({
      data: {
        id: p.id,
        name: p.name,
        type: p.role,
        phone: p.phone,
        certification: `${p.role === "nurse" ? "护理师" : p.role === "rehab" ? "康复师" : "护理员"}资格证`,
        specialties: p.skillTags,
        rating: p.rating,
        available: p.availabilityStatus === "available",
        organizationId: p.organizationId,
      },
    });
    cpCount++;
  }
  console.log(`   ✔ ${cpCount} care providers created\n`);

  // ─── 23. PricingPlans ───
  console.log("💰 Inserting PricingPlans...");
  let ppCount = 0;
  for (let i = 0; i < mockPricingPlans.length; i++) {
    const plan = mockPricingPlans[i];
    const priceNum =
      plan.price === "免费" ? 0 : parseInt(plan.price.replace(/[¥,]/g, "")) || 0;
    await prisma.pricingPlan.create({
      data: {
        id: plan.id,
        name: plan.name,
        tier: `tier-${i + 1}`,
        price: priceNum,
        currency: "CNY",
        period: plan.period.includes("月") ? "month" : plan.period.includes("年") ? "year" : null,
        features: plan.features as any,
        isActive: true,
        sortOrder: i,
      },
    });
    ppCount++;
  }
  console.log(`   ✔ ${ppCount} pricing plans created\n`);

  // ─── 24. Demo Case ───
  console.log("📁 Creating demo Case for demo user...");
  const firstElder = mockElders[0];
  await prisma.case.create({
    data: {
      userId: demoUser.id,
      elderlyId: firstElder.id,
      title: `${firstElder.name}的养老服务案例`,
      status: "PROFILE_READY",
      elderlyProfile: {
        name: firstElder.name,
        age: firstElder.age,
        gender: firstElder.gender,
        careLevel: firstElder.careLevel,
        chronicDiseases: firstElder.chronicDiseases,
      } as any,
      assessment: {
        type: "COMPREHENSIVE",
        score: 72,
        findings: "老人整体健康状况良好，需要关注慢性病管理。",
      } as any,
      policyMatches: {
        matchedPolicies: [mockPolicies[0].id, mockPolicies[5].id],
        totalSubsidy: 800,
      } as any,
    },
  });
  console.log("   ✔ 1 demo case created\n");

  // ─── Summary ───
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log("═══════════════════════════════════════");
  console.log(`🎉 Seed completed in ${elapsed}s`);
  console.log("═══════════════════════════════════════");
  console.log(`  Organizations:     5`);
  console.log(`  Users:             2 (demo + admin)`);
  console.log(`  ElderlyProfiles:   ${mockElders.length}`);
  console.log(`  EmergencyContacts: ${ecCount}`);
  console.log(`  FamilyMembers:     ${fmCount}`);
  console.log(`  HealthSummaries:   ${hsCount}`);
  console.log(`  Medications:       ${medCount}`);
  console.log(`  VisitRecords:      ${vrCount}`);
  console.log(`  RiskFlags:         ${rfCount}`);
  console.log(`  ChronicMetrics:    ${cmCount}`);
  console.log(`  MedicationReminders: ${mrCount}`);
  console.log(`  FollowUpReminders: ${fuCount}`);
  console.log(`  CareOrders:        ${coCount}`);
  console.log(`  RiskEvents:        ${reCount}`);
  console.log(`  ServiceReports:    ${srCount}`);
  console.log(`  ServiceRecords:    ${srecCount}`);
  console.log(`  Policies:          ${polCount}`);
  console.log(`  Institutions:      ${insCount}`);
  console.log(`  DigitalMaturities: ${dmCount}`);
  console.log(`  SalesLeads:        ${slCount}`);
  console.log(`  CareProviders:     ${cpCount}`);
  console.log(`  PricingPlans:      ${ppCount}`);
  console.log(`  Cases:             1`);
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("Demo login: demo@yanglaoai999.com / demo123456");
  console.log("Admin login: admin@yanglaoai999.com / admin123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
