# Agent 工作流文档

## 概述
衍策银龄 AI 提供6个专业 Agent，每个 Agent 有明确的输入、输出、置信度阈值和人工复核规则。

## 1. 政策匹配 Agent (policyMatchAgent)

**触发场景：** 用户填写老人条件，点击"开始匹配"

**输入参数：**
- region: 地区
- age: 年龄
- livingStatus: 居住状态
- careLevel: 护理等级
- disabilityStatus: 失能状态
- incomeLevel: 收入水平
- applicantType: 申请主体

**输出结构：**
```json
{
  "matchedPolicies": [...],
  "matchScore": 0.85,
  "eligibilityReason": "...",
  "missingMaterials": [...],
  "nextSteps": [...],
  "responsibleDepartment": "...",
  "disclaimer": "政策匹配结果仅供参考..."
}
```

**置信度：** 0.75-0.95
**人工复核：** matchScore < 0.75 时触发

## 2. 家属报告 Agent (elderReportAgent)
**输入：** elderId
**输出：** healthSummary, recentCareRecords, medicationReminders, followUpTasks, riskAlerts, familyFriendlySummary
**人工复核：** 始终需要（涉及医疗信息）

## 3. 机构画像 Agent (institutionProfileAgent)
**输入：** institutionId
**输出：** institutionSummary, digitalMaturityScore, purchaseIntentScore, suggestedProducts, salesApproach

## 4. 风险预警 Agent (riskAlertAgent)
**输入：** elderId
**输出：** riskLevel, riskType, evidence, suggestedAction, familyNotificationDraft
**人工复核：** 高风险时触发

## 5. 服务总结 Agent (careSummaryAgent)
**输入：** careOrderId
**输出：** serviceSummary, completedTasks, abnormalEvents, familyMessage

## 6. 销售跟进 Agent (salesFollowupAgent)
**输入：** leadId
**输出：** leadSummary, painPoints, recommendedOffer, firstMessageDraft, followupSteps

## Agent 编排规则
1. 每个 Agent 必须返回 confidence 分数
2. 所有涉及医疗信息的 Agent 输出必须包含 medicalDisclaimer
3. 所有涉及政策信息的 Agent 输出必须包含 policyDisclaimer
4. humanReviewRequired 为 true 时，输出标记为"待人工复核"
5. Agent 输出必须包含 sources 列表

## 置信度阈值
| Agent | 最低阈值 | 触发复核阈值 |
|-------|---------|-------------|
| 政策匹配 | 0.70 | < 0.75 |
| 家属报告 | 0.70 | 始终复核 |
| 机构画像 | 0.65 | < 0.70 |
| 风险预警 | 0.70 | 高风险 |
| 服务总结 | 0.75 | < 0.80 |
| 销售跟进 | 0.65 | < 0.70 |
