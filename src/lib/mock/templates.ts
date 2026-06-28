// 衍策银龄 AI — 模板库 Mock 数据 (35 templates)
export interface Template {
  id: string; slug: string; name: string; description: string;
  category: "family" | "service" | "policy" | "operations" | "sales";
  targetAudience: string; useCase: string;
  inputFields: string[]; outputSample: string;
}

export const mockTemplates: Template[] = [
  // ── 家属沟通模板 (7) ──
  { id: "tpl-1", slug: "family-visit-notification", name: "陪诊后家属通知", description: "陪诊结束后向家属发送结构化就诊通知", category: "family", targetAudience: "陪诊公司、护理团队", useCase: "每次陪诊完成后，自动生成家属通知消息",
    inputFields: ["老人姓名","就诊医院","诊断摘要","处方变更","下次复诊时间"], outputSample: "【陪诊通知】张大爷今日于上海瑞金医院心内科就诊。诊断：血压控制良好，调药为氨氯地平5mg。下次复诊：7月12日。" },
  { id: "tpl-2", slug: "family-care-completion", name: "护理服务完成通知", description: "上门护理或照料完成后发送服务摘要", category: "family", targetAudience: "护理公司、居家护理团队", useCase: "每次护理服务完成后自动生成",
    inputFields: ["老人姓名","服务类型","服务时间","服务内容","异常情况"], outputSample: "【服务完成】李奶奶今日上门护理已完成。服务：血压测量+用药指导+生活照料。时长：2小时。状态：一切正常。" },
  { id: "tpl-3", slug: "family-risk-alert", name: "异常风险提醒", description: "检测到健康或服务风险时通知家属", category: "family", targetAudience: "养老机构、社区服务站", useCase: "跌倒、用药异常、生命体征异常等事件",
    inputFields: ["老人姓名","风险类型","风险等级","详细描述","已采取措施"], outputSample: "【风险提醒】王大爷今日上午10:15在走廊跌倒，已进行现场检查，无骨折迹象。已安排观察，建议家属来院了解情况。" },
  { id: "tpl-4", slug: "family-followup-reminder", name: "复诊提醒", description: "提前通知家属即将到期的复诊安排", category: "family", targetAudience: "陪诊公司、护理团队", useCase: "复诊前3天/1天自动发送提醒",
    inputFields: ["老人姓名","复诊日期","复诊医院","复诊科室","需携带材料"], outputSample: "【复诊提醒】赵大爷将于7月15日在上海中山医院内分泌科复诊，请携带近期血糖监测记录和用药清单。" },
  { id: "tpl-5", slug: "family-medication-reminder", name: "用药提醒", description: "向家属同步老人用药情况和依从性", category: "family", targetAudience: "护理团队、家属", useCase: "每日用药提醒 + 每周用药依从性报告",
    inputFields: ["老人姓名","药物清单","提醒时间","本周依从率"], outputSample: "【用药周报】张大爷本周用药依从率 92%。漏服记录：周三晚间二甲双胍1次。建议关注。" },
  { id: "tpl-6", slug: "family-weekly-report", name: "家属周报", description: "每周向家属发送老人健康和服务综合报告", category: "family", targetAudience: "养老机构、社区服务站", useCase: "每周自动生成，发送给异地子女",
    inputFields: ["老人姓名","报告周期","健康指标摘要","服务记录","风险事件","下周计划"], outputSample: "【周报】张大爷第26周报告：血压稳定(130/85)，陪诊1次，护理3次，无风险事件。下周计划：周三复诊。" },
  { id: "tpl-7", slug: "family-emergency-notice", name: "紧急事件通知", description: "紧急情况下的快速家属通知模板", category: "family", targetAudience: "养老机构、急诊团队", useCase: "突发状况需立即通知家属",
    inputFields: ["老人姓名","事件类型","发生时间","当前状态","联系人"], outputSample: "【紧急通知】王大爷今日14:30突发胸闷，已送上海瑞金医院急诊。当前状态：稳定，正在检查中。联系人：护工小刘。" },

  // ── 服务记录模板 (7) ──
  { id: "tpl-8", slug: "service-visit-record", name: "陪诊记录", description: "结构化陪诊服务记录模板", category: "service", targetAudience: "陪诊公司", useCase: "每次陪诊服务后填写",
    inputFields: ["老人姓名","医院","科室","医生","诊断","处方","复诊安排"], outputSample: "陪诊记录：张大爷，上海瑞金医院心内科，李医生。诊断：高血压二级，调药。复诊：7月12日。" },
  { id: "tpl-9", slug: "service-home-nursing", name: "上门护理记录", description: "上门护理服务标准记录", category: "service", targetAudience: "护理公司", useCase: "上门护理完成后填写",
    inputFields: ["老人姓名","护理员","服务时长","护理项目","生命体征","异常情况"], outputSample: "上门护理：李奶奶，护理员小王，2小时。血压128/82，血糖7.2。护理项目：伤口换药+用药指导。无异常。" },
  { id: "tpl-10", slug: "service-rehab", name: "康复陪护记录", description: "康复训练和陪护过程记录", category: "service", targetAudience: "康复机构、护理团队", useCase: "康复训练完成后记录",
    inputFields: ["老人姓名","康复师","训练项目","训练时长","完成情况","疼痛评分"], outputSample: "康复记录：赵大爷，康复师小张。项目：下肢力量训练+平衡训练。时长：45分钟。完成度80%。疼痛评分2/10。" },
  { id: "tpl-11", slug: "service-daily-care", name: "生活照料记录", description: "日常起居照料服务记录", category: "service", targetAudience: "养老机构、居家护理", useCase: "每日照料记录",
    inputFields: ["老人姓名","照料员","饮食情况","睡眠质量","个人卫生","活动情况"], outputSample: "生活照料：张大爷，照料员小刘。饮食：三餐正常，食欲好。睡眠：22:00-6:00。卫生：已洗澡。活动：散步30分钟。" },
  { id: "tpl-12", slug: "service-post-surgery", name: "术后照护记录", description: "手术后的专业照护记录", category: "service", targetAudience: "护理公司、康复机构", useCase: "术后恢复期每日记录",
    inputFields: ["老人姓名","手术类型","术后天数","伤口状态","疼痛评分","饮食","活动能力"], outputSample: "术后照护：李奶奶，髋关节置换术后第3天。伤口：干燥无红肿。疼痛3/10。饮食：半流质。可在助行器辅助下站立。" },
  { id: "tpl-13", slug: "service-bathing", name: "助浴服务记录", description: "助浴服务标准记录", category: "service", targetAudience: "护理公司、社区服务站", useCase: "每次助浴服务后记录",
    inputFields: ["老人姓名","护理员","水温","皮肤状况","协助程度","特殊情况"], outputSample: "助浴记录：王大爷，护理员小陈。水温38℃。皮肤状况：背部轻微干燥，已涂润肤霜。协助程度：需全程协助。" },
  { id: "tpl-14", slug: "service-meal", name: "助餐服务记录", description: "送餐或助餐服务记录", category: "service", targetAudience: "社区服务站、送餐团队", useCase: "每日助餐服务后记录",
    inputFields: ["老人姓名","餐次","菜品","进食量","特殊饮食需求","异常情况"], outputSample: "助餐记录：张大爷，午餐。菜品：清蒸鱼+蔬菜+米饭。进食量：正常。特殊需求：低盐。无异常。" },

  // ── 政策申报模板 (7) ──
  { id: "tpl-15", slug: "policy-elderly-allowance", name: "高龄津贴材料清单", description: "高龄津贴申请所需材料完整清单", category: "policy", targetAudience: "老人家庭、社区服务站", useCase: "申请高龄津贴时参考",
    inputFields: ["所在城市","老人年龄","户籍类型"], outputSample: "上海高龄津贴申请材料：1.身份证 2.户口簿 3.银行卡 4.一寸照片 5.申请表。办理地点：户籍所在街道社区事务受理中心。" },
  { id: "tpl-16", slug: "policy-ltc-insurance", name: "长护险申请材料清单", description: "长期护理保险申请完整材料清单", category: "policy", targetAudience: "老人家庭、护理公司", useCase: "申请长期护理保险",
    inputFields: ["所在城市","参保类型","失能等级"], outputSample: "上海长护险申请：1.身份证 2.医保卡 3.失能评估报告 4.近期病历。流程：社区申请→评估→审批→服务。" },
  { id: "tpl-17", slug: "policy-home-modification", name: "适老化改造申请材料清单", description: "居家适老化改造补贴申请材料", category: "policy", targetAudience: "老人家庭、改造企业", useCase: "申请适老化改造补贴",
    inputFields: ["所在城市","房屋性质","老人情况"], outputSample: "适老化改造申请：1.身份证 2.房产证/租赁合同 3.房屋照片 4.改造方案 5.预算报价。补贴上限：上海3000元。" },
  { id: "tpl-18", slug: "policy-community-meal", name: "社区助餐补贴材料清单", description: "社区助餐服务补贴申请材料", category: "policy", targetAudience: "老人家庭、社区服务站", useCase: "申请助餐补贴",
    inputFields: ["所在城市","老人年龄","特殊情况"], outputSample: "社区助餐补贴申请：1.身份证 2.老年卡 3.低保证明(如适用)。办理地点：社区服务站。补贴标准：每餐2-5元。" },
  { id: "tpl-19", slug: "policy-nursing-home-subsidy", name: "养老机构运营补贴材料清单", description: "养老机构申请运营补贴的材料清单", category: "policy", targetAudience: "养老机构", useCase: "申请床位补贴和运营补贴",
    inputFields: ["所在城市","机构类型","床位数"], outputSample: "养老机构运营补贴：1.营业执照 2.消防合格证 3.食品许可证 4.入住老人名册 5.服务评估报告。补贴标准：新建床位5000-10000元/张。" },
  { id: "tpl-20", slug: "policy-disabled-care", name: "失能老人照护补贴材料清单", description: "失能老人照护服务补贴申请", category: "policy", targetAudience: "老人家庭、护理公司", useCase: "申请失能照护补贴",
    inputFields: ["所在城市","失能等级","照护方式"], outputSample: "失能照护补贴：1.失能评估报告 2.照护服务合同 3.服务记录 4.发票。补贴标准：重度失能每月400-600元。" },
  { id: "tpl-21", slug: "policy-caregiver-training", name: "护理员培训补贴材料清单", description: "护理员职业技能培训补贴申请", category: "policy", targetAudience: "护理公司、培训机构", useCase: "申请护理员培训补贴",
    inputFields: ["所在城市","培训类型","培训人数"], outputSample: "护理员培训补贴：1.培训机构资质 2.学员名册 3.培训课时表 4.考核合格证书。补贴标准：初级1500元/人，高级3000元/人。" },

  // ── 机构运营模板 (7) ──
  { id: "tpl-22", slug: "ops-nursing-daily", name: "养老机构运营日报", description: "机构每日运营数据和事件汇总", category: "operations", targetAudience: "养老机构管理者", useCase: "每日运营例会参考",
    inputFields: ["日期","入住率","新增入住","出院","风险事件","设备告警"], outputSample: "运营日报(6/28)：入住率92%，新增1人，出院0人。风险：王大爷跌倒1次(低风险)。设备：3号楼呼叫器已修。" },
  { id: "tpl-23", slug: "ops-community-weekly", name: "社区养老站周报", description: "社区养老服务站每周服务汇总", category: "operations", targetAudience: "社区服务站", useCase: "每周服务统计和汇报",
    inputFields: ["周期","服务人次","助餐人次","活动次数","风险事件","下周计划"], outputSample: "社区站周报(第26周)：服务128人次，助餐86人次，活动3次(太极/手工/健康讲座)。无风险事件。" },
  { id: "tpl-24", slug: "ops-escort-daily", name: "陪诊公司订单日报", description: "陪诊公司每日订单和服务汇总", category: "operations", targetAudience: "陪诊公司", useCase: "每日运营数据",
    inputFields: ["日期","今日订单","完成订单","取消订单","客户反馈","明日预约"], outputSample: "陪诊日报(6/28)：订单12单，完成11单，取消1单(客户改期)。好评率100%。明日预约8单。" },
  { id: "tpl-25", slug: "ops-nursing-review", name: "护理团队服务复盘", description: "护理团队定期服务质量复盘", category: "operations", targetAudience: "护理公司管理者", useCase: "周/月度团队复盘",
    inputFields: ["周期","服务单量","客户满意度","异常事件","培训情况","改进措施"], outputSample: "护理团队月报(6月)：服务320单，满意度4.8/5。异常：2次迟到(已提醒)。培训：新入职3人完成培训。" },
  { id: "tpl-26", slug: "ops-risk-review", name: "风险事件复盘", description: "对发生的安全/健康风险事件进行复盘分析", category: "operations", targetAudience: "养老机构、护理公司", useCase: "每次风险事件后复盘",
    inputFields: ["事件类型","发生时间","涉及人员","事件经过","处理措施","根因分析","改进方案"], outputSample: "风险复盘：6/25王大爷跌倒。根因：走廊照明不足+鞋底磨损。改进：更换走廊灯+发放防滑鞋。" },
  { id: "tpl-27", slug: "ops-staff-schedule", name: "护理人员排班模板", description: "周度/月度护理人员排班计划", category: "operations", targetAudience: "护理公司、养老机构", useCase: "每周排班规划",
    inputFields: ["周期","人员列表","客户列表","服务需求","休息规则"], outputSample: "本周排班：小王(周一~五：张大爷上午+李奶奶下午)、小陈(全周：王大爷全天)、小刘(轮休)。" },
  { id: "tpl-28", slug: "ops-quality-monthly", name: "服务质量月报", description: "月度服务质量评估和改进报告", category: "operations", targetAudience: "养老机构管理者", useCase: "月度质量管理会议",
    inputFields: ["月份","服务总量","满意度","投诉数","培训完成率","改进计划"], outputSample: "6月质量报告：服务1200次，满意度95%，投诉2件(已处理)。培训完成率88%。改进：加强新入职培训。" },

  // ── 销售线索模板 (7) ──
  { id: "tpl-29", slug: "sales-institution-profile", name: "养老机构画像", description: "快速生成养老机构的客户画像和销售建议", category: "sales", targetAudience: "销售团队", useCase: "新线索首次跟进前准备",
    inputFields: ["机构名称","类型","床位数","地区","现有系统","联系人"], outputSample: "机构画像：XX养老院，200床，浦东新区。数字化评分35/100。痛点：纸质档案管理。建议产品：护理CRM+健康档案。" },
  { id: "tpl-30", slug: "sales-modification-profile", name: "适老化改造客户画像", description: "适老化改造企业的目标客户画像", category: "sales", targetAudience: "适老化改造企业", useCase: "B2B销售线索评估",
    inputFields: ["企业类型","规模","区域","主要产品","目标客户"], outputSample: "客户画像：XX智能科技，50人，深圳。产品：智能扶手/紧急呼叫器。目标：养老机构+政府采购。采购意向评分72/100。" },
  { id: "tpl-31", slug: "sales-hardware-pitch", name: "智慧养老硬件销售话术", description: "面向养老机构的智能硬件销售话术", category: "sales", targetAudience: "智慧养老企业", useCase: "首次客户接触和演示",
    inputFields: ["产品名称","目标机构","痛点","竞品情况"], outputSample: "话术：张院长您好，了解到贵院在跌倒预警方面有需求。我们的智能床垫可以实时监测离床和体动，已服务50+养老机构..." },
  { id: "tpl-32", slug: "sales-followup-plan", name: "护理设备客户跟进计划", description: "对已接触客户的系统跟进计划", category: "sales", targetAudience: "护理设备企业", useCase: "客户跟进管理",
    inputFields: ["客户名称","接触阶段","需求","竞品","预算","决策人"], outputSample: "跟进计划：XX养老院，已首次演示。需求：护理呼叫系统。预算20万。决策人：李院长。下一步：7月5日二次演示+试用方案。" },
  { id: "tpl-33", slug: "sales-b2b-email", name: "银发经济B2B销售邮件", description: "面向银发经济企业的冷启动邮件", category: "sales", targetAudience: "银发经济企业", useCase: "新客户冷启动触达",
    inputFields: ["目标公司","联系人","产品卖点","行业痛点"], outputSample: "邮件：李总您好，我是衍策银龄AI的XX。注意到贵公司在智慧养老领域...我们的AI政策匹配引擎已帮助30+机构提升补贴申请效率60%..." },
  { id: "tpl-34", slug: "sales-proposal-outline", name: "销售方案大纲", description: "为客户定制的解决方案提案框架", category: "sales", targetAudience: "销售团队", useCase: "正式提案准备",
    inputFields: ["客户名称","需求摘要","产品方案","价格","实施周期"], outputSample: "方案大纲：1.客户现状分析 2.解决方案概述 3.产品模块 4.实施计划(3个月) 5.投资回报 6.服务保障。总价：XX万/年。" },
  { id: "tpl-35", slug: "sales-exhibition-pitch", name: "展会推介话术", description: "养老行业展会快速推介话术", category: "sales", targetAudience: "销售团队、市场团队", useCase: "养老产业展会/论坛",
    inputFields: ["产品名称","展会名称","目标客户","核心卖点"], outputSample: "展会展板：衍策银龄AI — 中国银发经济AI原生服务基础设施。核心功能：政策匹配+护理CRM+机构线索库。扫码体验Demo。" },
];
