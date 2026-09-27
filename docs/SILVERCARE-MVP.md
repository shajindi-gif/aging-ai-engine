# YanglaoAI · SilverCare OS — MVP 交付说明

**定位**：面向老年人的 AI 健康风险预测、康复与照护操作系统（第一阶段聚焦：跌倒/衰弱风险评估、心肺健康趋势监测、AI Care Agent）。

**产品边界声明**：本产品用于健康管理、风险提示及照护辅助，**不替代专业医疗诊断或治疗**。所有风险评分均标注为 `Experimental / For Health Management Only`（规则型 MVP，未经临床验证）。

---

## 一、改造方式

在现有 `aging-ai-engine`（Next.js 16 + Prisma + NextAuth + Neon PostgreSQL）上**增量开发**，未推翻重写、未新建独立支付/域名。新增能力全部落在 `silvercare` 命名空间下，与既有综合养老平台功能（政策库/CRM/线索）物理隔离：新表、新 API（`/api/silvercare/*`）、新页面（`/elder` `/family` `/alerts` `/care-center` `/onboarding` `/admin`）。既有生产数据与页面不受影响。

## 二、核心架构

```
数据层 (ElderlyProfile / ChronicMetric / MobilityAssessment)
   ↓
风险引擎 Risk Engine (规则型：computeFallRisk + detectTrendAlerts)
   ↓
Agent 引擎 SilverCare Agent (Tool Calling，结构化 JSON 输出，Pydantic 式校验)
   ↓
照护工作流 Care Workflow (CareTask / HealthAlert 落库)
   ↓
人工介入 (家属看板 / 机构看板 / 提醒中心)
```

不是「输入问题→LLM 回答」。LLM 仅用于摘要叙述增强；**未配置 `LLM_API_KEY` 时自动降级为规则引擎模式**，闭环仍可完整运行（已验证）。

## 三、模块

**模块一 SilverMove — 跌倒/衰弱风险评估**
- 起立测试(5 次计时)、步行测试(4 米计时→步速)、平衡测试(单脚坚持计时)，当前为**手动计时**；摄像头姿态识别（MediaPipe/MoveNet）为下一阶段（P4）。
- 规则型 Fall Risk Score 0–100 + Low/Moderate/High，输入含年龄、跌倒史、助行器、步速、平衡、ADL、头晕、视力、用药数；输出主要风险因素与建议。

**模块二 SilverHeart — 心肺趋势监测**
- 每日健康打卡：心率/血压/血氧/呼吸/步数/睡眠/体温 + 咳嗽/呼吸困难/胸闷/疲劳评分（0–10）。
- 7/30 天趋势计算与异常信号检测（血氧连续下降、活动量下降、呼吸困难上升、血压持续偏高），分级 Level 1/2/3。

**模块三 SilverCare Agent — 工具调用**
- 工具：`get_elder_profile` `get_latest_vitals` `get_health_trend` `get_fall_risk` `generate_daily_plan` `create_alert` `create_care_task` `generate_family_report`。
- 流程：读数据→检测风险→结构化判断→生成任务→创建提醒→家属报告；输出经字段校验，不直接信任模型内容；每次运行记录 `CareAgentRun`。

## 四、数据模型（新增）

`MobilityAssessment`、`FallRiskScore`、`CareTask`、`HealthAlert`、`CareAgentRun`；`ChronicMetric` 扩展 `spo2 / respiratoryRate / steps / sleepHours / coughLevel / dyspneaLevel / chestTightness / fatigueLevel / restingHR / source`。均含 `createdAt/updatedAt`，关键表含 `source`、`confidence`。

## 五、API（`/api/silvercare/*`，均需登录）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/silvercare/overview` | 家属/机构总览，按关注优先级排序 |
| POST/GET | `/api/silvercare/mobility` | 提交活动测试→计算跌倒风险 |
| POST/GET | `/api/silvercare/vitals` | 每日指标录入 / 趋势与信号 |
| GET/POST/PATCH | `/api/silvercare/care-tasks` | 照护任务增改查 |
| GET/PATCH | `/api/silvercare/alerts` | 提醒中心 |
| POST/GET | `/api/silvercare/agent` | 运行 AI Care Agent / 取最近结果 |

## 六、页面

`/`（官网 Hero 已更新为健康 OS 定位）· `/elder`（老人端大字体：今日健康/任务/检测/AI 助手/联系家人）· `/elder/check` · `/elder/mobility` · `/elder/assistant` · `/family` · `/family/elder/[id]` · `/alerts` · `/care-center` · `/onboarding` · `/admin`。均含医疗免责声明与紧急提示。

## 七、启动

```bash
cp .env.example .env.local   # 填 DATABASE_URL、NEXTAUTH_SECRET、AUTH_TRUST_HOST=true
npm install
npx prisma db push
npx tsx prisma/seed-silvercare.ts   # 5 名演示老人 × 30 天数据
npm run dev    # 或 npm run build && npm start
```

**演示账号**：`demo@yanglaoai999.com` / `demo123456`（登录后访问 `/elder`、`/family`、`/alerts`、`/care-center`）。

**演示剧情数据**（虚构，`source=demo`）：王秀兰 76 岁术后康复 → 跌倒 MODERATE → 近 5 天血氧 96→92、活动量下降、呼吸困难上升 → Agent 生成摘要 + 复测血氧任务 + 家属提醒。

## 八、验证结果

闭环脚本 `verify-silvercare.py` 全绿：登录→总览排序→活动测试评分(51/MODERATE)→每日录入→Agent(concern/high, findings=4/tasks=4/alerts=3)→任务与提醒落库→任务完成→家属报告。`next build` 通过。页面截图见交付。

## 九、已知限制（如实说明）

1. **RBAC 简化**：家属/机构端当前对已登录用户展示全部老人，未按「家属仅见授权老人、护理员仅见本机构」过滤 —— 下一阶段补 `family_relations`/`organization` 级鉴权。
2. **摄像头姿态识别未实现**（P4），活动测试为手动计时。
3. **支付/权益未接入**：MVP 未含收款，需选定目标市场支付渠道与资质后接入（订单/回调验签/幂等/权益开通为待办）。
4. **LLM 默认规则模式**：未配 `LLM_API_KEY` 时摘要由规则引擎生成（真实、可运行，非大模型叙述）。
5. 演示数据与既有 30 名平台 seed 老人共存于同一库；机构看板会一并列出（可按 `tags` 过滤，属后续优化）。

## 十、下一阶段（MVP → PoC → 商业）

P4 摄像头 Pose（MediaPipe 浏览器端）· P5 机构看板筛选/分组增强 · 支付与权益闭环 · RBAC 与审计日志完善 · 语音输入转写 · 微信小程序 · 长护险/上门护理派单。
