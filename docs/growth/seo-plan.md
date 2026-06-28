# 衍策银龄 AI — SEO 内容策略

---

## 目标

通过可索引的内容页面矩阵，建立养老服务和银发经济领域的搜索流量入口。

## 三层内容架构

### 第一层：工具入口页（高转化，10 页）

| 页面 | 目标关键词 | 月搜索量预估 |
|------|-----------|-------------|
| /tools/subsidy-checker | 养老补贴查询、高龄津贴申请、养老补贴资格 | 高 |
| /tools/family-care-report | 老人健康报告、家属照护周报 | 中 |
| /tools/medical-companion-summary | 陪诊记录、就诊总结 | 中 |
| /tools/care-plan-generator | 居家护理方案、照护计划 | 中 |
| /tools/medication-reminder-plan | 用药提醒、老人用药管理 | 中 |
| /tools/follow-up-reminder | 复诊提醒、就诊跟进 | 低 |
| /tools/elder-risk-check | 老人跌倒风险、照护安全评估 | 中 |
| /tools/home-aging-modification-checklist | 适老化改造、居家改造补贴 | 高 |
| /tools/nursing-home-lead-score | 养老机构评估、B2B线索 | 低（B2B） |
| /tools/policy-materials-generator | 补贴申请材料、政策申报 | 中 |

### 第二层：城市 SEO 页（长尾流量，12 页）

| 页面 | 目标关键词 | 内容模块 |
|------|-----------|----------|
| /city/shanghai | 上海养老政策、上海高龄津贴、上海长护险 | 7 模块 |
| /city/beijing | 北京养老政策、北京高龄津贴 | 7 模块 |
| /city/shenzhen | 深圳养老政策、深圳智慧养老 | 7 模块 |
| /city/guangzhou | 广州养老政策、广州长者饭堂 | 7 模块 |
| /city/hangzhou | 杭州养老政策、杭州浙里康养 | 7 模块 |
| /city/suzhou | 苏州养老政策、苏州尊老金 | 7 模块 |
| /city/nanjing | 南京养老政策 | 7 模块 |
| /city/chengdu | 成都养老政策 | 7 模块 |
| /city/wuhan | 武汉养老政策 | 7 模块 |
| /city/tianjin | 天津养老政策 | 7 模块 |
| /city/chongqing | 重庆养老政策 | 7 模块 |
| /city/xian | 西安养老政策 | 7 模块 |

**每页 7 模块**：城市概况、高龄津贴、长护险、适老化改造、社区助餐、居家养老服务、机构类型 + 适合工具 + 相关政策。

### 第三层：专题内容页（知识流量，10 页）

| 页面 | 目标关键词 | 内容方向 |
|------|-----------|----------|
| /resources/aging-policy-database | 中国养老政策、养老政策大全 | 政策索引 |
| /resources/city-aging-policy | 城市养老政策对比 | 城市对比 |
| /resources/long-term-care-insurance | 长护险、长期护理保险 | 制度解读 |
| /resources/home-care | 社区居家养老、居家养老服务 | 服务指南 |
| /resources/medical-companion | 陪诊服务、陪诊流程 | 行业指南 |
| /resources/elder-care-saas | 养老SaaS、养老管理系统 | 产品选型 |
| /resources/silver-economy | 银发经济、银发产业 | 产业分析 |
| /resources/aging-modification | 适老化改造、无障碍改造 | 改造指南 |
| /resources/nursing-care | 老年护理、护理服务 | 服务标准 |
| /resources/elder-family-guide | 子女照护父母、异地养老 | 实用指南 |

## 内链网络

```
工具页 ←→ 城市页（"上海用户推荐使用的工具"）
工具页 ←→ 专题页（"了解长护险详情"）
城市页 ←→ 政策库（"查看全部上海政策"）
专题页 ←→ 解决方案页（"陪诊公司解决方案"）
模板页 ←→ 工具页（"使用陪诊记录总结器"）
```

## 技术 SEO 要求

- 所有页面 SSR/SSG（确保搜索引擎可抓取）
- 独立 title、description、H1
- canonical URL
- 结构化数据 JSON-LD（后续补充）
- 图片 alt 文本
- sitemap.xml 自动生成
- robots.txt 配置
- 页面加载 < 2 秒

## 扩展计划（P1/P2）

- 增加更多城市（30+ → 100+）
- 增加政策问答页（FAQ schema）
- 增加行业报告/白皮书下载页
- 增加博客/新闻页（持续更新）
