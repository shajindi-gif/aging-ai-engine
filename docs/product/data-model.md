# 数据模型文档

## 实体关系概述

```
Organization 1──N User
Organization 1──N Elder
Organization 1──N CareProvider
Organization 1──N CareOrder
Organization 1──N AgentTask
Organization 1──N Report

Elder 1──N FamilyMember
Elder 1──N CareOrder
Elder 1──N MedicalVisit
Elder 1──N MedicationReminder
Elder 1──N ChronicMetric
Elder 1──N RiskEvent
Elder 1──N Report

CareOrder 1──N CareRecord
CareOrder 1──N RiskEvent

Policy 1──N PolicyEligibilityRule
Policy 1──N SubsidyApplication

Institution 1──N Lead
```

## 18个实体详情

### 1. Organization（组织）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| name | string | 组织名称 |
| type | enum | nursing_home/community_station/care_company/hospital/government/enterprise |
| region | string | 所在区域 |
| contactName | string | 联系人 |
| contactPhone | string | 联系电话 |
| contactEmail | string | 联系邮箱 |
| subscriptionPlan | string | 订阅方案 |

### 2. User（用户）
### 3. Elder（老人档案）
### 4. FamilyMember（家属）
### 5. CareProvider（服务人员）
### 6. CareOrder（服务订单）
### 7. CareRecord（服务记录）
### 8. MedicalVisit（就诊记录）
### 9. MedicationReminder（用药提醒）
### 10. ChronicMetric（慢病指标）
### 11. Policy（政策）
### 12. PolicyEligibilityRule（政策资格规则）
### 13. SubsidyApplication（补贴申请）
### 14. Institution（养老机构）
### 15. Lead（销售线索）
### 16. AgentTask（Agent任务）
### 17. RiskEvent（风险事件）
### 18. Report（报告）

（完整字段定义见 src/lib/types/index.ts 和 prisma/schema.prisma）

## 数据隐私分级

| 级别 | 数据 | 处理方式 |
|------|------|----------|
| 高敏感 | 身份证号、病历、用药 | 加密存储，授权访问 |
| 中敏感 | 姓名、电话、地址 | 脱敏展示，权限控制 |
| 低敏感 | 政策、机构、标签 | 公开可查 |

## 索引策略
- Elder: organizationId + careLevel, region
- CareOrder: organizationId + status, elderId
- Policy: region + policyType, level
- Institution: region + institutionType
- Lead: institutionId, followUpStatus
