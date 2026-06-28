import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Shield,
  Stethoscope,
  BookOpen,
  Lock,
  Server,
  Mail,
  Phone,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Eye,
  Database,
  Users,
  Scale,
} from "lucide-react";
import { MEDICAL_DISCLAIMER, POLICY_DISCLAIMER } from "@/lib/types";

const sections = [
  {
    icon: Shield,
    title: "1. 数据合规",
    content: [
      "严格遵守《数据安全法》和《个人信息保护法》，全流程安全管理。",
      "所有PII采用AES-256加密存储，传输链路TLS 1.3。",
      "数据最小化原则，仅收集服务必需信息。",
      "用户可随时查看、修改或删除个人数据。",
      "定期安全评估和渗透测试。",
    ],
  },
  {
    icon: Stethoscope,
    title: "2. 医疗合规",
    content: [
      "本平台不提供医疗诊断、治疗建议或医疗决策。",
      "AI健康评估报告仅供护理人员参考，不替代执业医生判断。",
      "平台不存储、不传输电子处方信息。",
      "所有健康信息页面标注医疗免责声明。",
      "医疗相关变更将提前通知并重新评估合规性。",
    ],
    highlight: true,
  },
  {
    icon: BookOpen,
    title: "3. 政策合规",
    content: [
      "政策信息来源于各级政府官方网站公开信息，经人工核实。",
      "匹配结果仅供参考，具体资格以当地主管部门审核为准。",
      "政策信息至少每季度更新一次，重大变更48小时内推送。",
      "平台不代办政策申请，不提供结果承诺。",
    ],
  },
  {
    icon: Lock,
    title: "4. 隐私保护",
    content: [
      "不向第三方出售用户数据，不用于广告投放。",
      "AI模型训练不使用用户个人数据。",
      "数据访问实行严格权限控制和审计日志。",
      "企业版支持私有化部署。",
      "安全事件72小时内通知用户并报告主管部门。",
    ],
  },
  {
    icon: Server,
    title: "5. 安全标准",
    content: [
      "国家信息安全等级保护三级认证（等保三级）。",
      "多层安全架构：WAF、DDoS防御、入侵检测。",
      "每次发布前静态代码分析和安全审查。",
      "RBAC权限管理，支持双因素认证（2FA）。",
      "每日增量备份，RTO < 4小时，RPO < 1小时。",
    ],
  },
  {
    icon: Eye,
    title: "6. AI 透明度",
    content: [
      "AI生成内容明确标注，与人工内容区分显示。",
      "提供AI决策的可解释性说明和置信度指标。",
      "高风险AI输出需经人工审核后发布。",
      "用户可选择关闭AI辅助功能。",
    ],
  },
  {
    icon: Database,
    title: "7. 数据治理",
    content: [
      "数据分类分级管理，敏感数据特殊保护。",
      "数据保留策略：服务停止后90天自动清除。",
      "数据迁移支持标准格式导出。",
      "数据审计日志完整可追溯。",
    ],
  },
  {
    icon: Users,
    title: "8. 无障碍与适老化",
    content: [
      "界面设计遵循WCAG 2.1 AA标准。",
      "支持大字体模式和高对比度显示。",
      "语音交互和屏幕阅读器兼容。",
      "家属和护理人员可代为操作。",
    ],
  },
  {
    icon: Scale,
    title: "9. 商业合规",
    content: [
      "价格透明，无隐藏费用。",
      "合同条款清晰，SLA保障。",
      "退款政策：年付方案30天内无理由退款。",
      "遵守《反不正当竞争法》和《消费者权益保护法》。",
    ],
  },
];

export default function CompliancePage() {
  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <Shield className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">合规声明</h1>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            我们重视数据安全、医疗合规和用户隐私，以下是我们的9项合规承诺
          </p>
        </div>
      </section>

      <section className="bg-surface py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="yc-disclaimer yc-disclaimer-medical flex items-start gap-3 mb-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">医疗免责声明</p>
              <p className="mt-1">{MEDICAL_DISCLAIMER}</p>
            </div>
          </div>
          <div className="yc-disclaimer flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">政策免责声明</p>
              <p className="mt-1">{POLICY_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.highlight ? "bg-red-50" : "bg-brand-50"}`}>
                  <section.icon className={`h-5 w-5 ${section.highlight ? "text-danger" : "text-brand-600"}`} />
                </div>
                <h2 className="text-xl font-bold text-text-primary">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface-secondary py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold text-text-primary">合规咨询与反馈</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-text-secondary">
            如对平台合规性有疑问，欢迎联系我们
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="yc-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <Mail className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">邮箱</p>
                <p className="text-sm font-medium text-text-primary">compliance@yance.ai</p>
              </div>
            </div>
            <div className="yc-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <Phone className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">电话</p>
                <p className="text-sm font-medium text-text-primary">021-8888-9999</p>
              </div>
            </div>
            <div className="yc-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <FileText className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">地址</p>
                <p className="text-sm font-medium text-text-primary">上海市浦东新区</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
