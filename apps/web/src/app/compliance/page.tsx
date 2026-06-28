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
} from "lucide-react";
import { MEDICAL_DISCLAIMER, POLICY_DISCLAIMER } from "@/lib/types";

const sections = [
  {
    icon: Shield,
    title: "数据合规",
    content: [
      "严格遵守《中华人民共和国数据安全法》和《个人信息保护法》，对用户数据的收集、存储、使用和传输实行全流程安全管理。",
      "所有个人身份信息（PII）采用 AES-256 加密存储，传输链路采用 TLS 1.3 协议。",
      "实行数据最小化原则，仅收集提供服务所必需的信息，不采集与服务无关的个人数据。",
      "用户有权随时查看、修改或删除其个人数据。数据删除请求将在 30 个工作日内完成。",
      "定期开展数据安全评估和渗透测试，确保系统安全性。",
    ],
  },
  {
    icon: Stethoscope,
    title: "医疗合规",
    content: [
      "本平台不提供医疗诊断、治疗建议或医疗决策服务。平台功能限于健康信息整理、服务记录和风险提示。",
      "AI 生成的健康风险评估报告仅供护理人员参考，不能替代执业医生的专业判断。",
      "平台不存储、不传输任何电子处方信息。用药提醒功能仅基于用户手动录入的信息。",
      "涉及健康信息展示的所有页面均标注医疗免责声明。",
      "如平台功能发生医疗相关变更，将提前通知用户并重新评估合规性。",
    ],
    highlight: true,
  },
  {
    icon: BookOpen,
    title: "政策合规",
    content: [
      "平台收录的养老政策信息来源于各级政府官方网站公开信息，经人工核实后录入。",
      "政策匹配算法基于规则引擎和语义理解，匹配结果仅供参考，具体资格以当地主管部门最终审核为准。",
      "政策信息定期更新（至少每季度一次），如遇重大政策变更将在 48 小时内推送通知。",
      "平台不代办政策申请，不提供任何政策结果的承诺或保证。",
      "用户应自行核实最新政策信息，平台不对因信息滞后造成的损失承担责任。",
    ],
  },
  {
    icon: Lock,
    title: "隐私保护",
    content: [
      "用户隐私是我们的核心价值。我们承诺：不向第三方出售用户数据，不将用户数据用于广告投放。",
      "AI 模型训练不使用用户个人数据。模型仅基于公开政策文本和脱敏后的行业数据。",
      "家属端和护理人员端的数据访问实行严格的权限控制和审计日志。",
      "企业版客户可选择私有化部署，数据完全存储在客户自有环境中。",
      "发生数据安全事件时，将在 72 小时内通知受影响用户并向主管部门报告。",
    ],
  },
  {
    icon: Server,
    title: "安全标准",
    content: [
      "系统通过国家信息安全等级保护三级认证（等保三级）。",
      "采用多层安全架构：WAF 防护、DDoS 防御、入侵检测、漏洞扫描。",
      "代码安全审计：每次发布前进行静态代码分析和安全审查。",
      "访问控制：基于 RBAC 的细粒度权限管理，支持双因素认证（2FA）。",
      "备份与恢复：数据每日增量备份，每周全量备份，RTO < 4小时，RPO < 1小时。",
    ],
  },
];

export default function CompliancePage() {
  return (
    <>
      <Header />

      {/* Header */}
      <section className="bg-surface-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <Shield className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            合规声明
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            我们重视数据安全、医疗合规和用户隐私，以下是我们的合规承诺
          </p>
        </div>
      </section>

      {/* Medical Disclaimer - Prominent */}
      <section className="bg-surface py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="yc-disclaimer yc-disclaimer-medical flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">医疗免责声明</p>
              <p className="mt-1">{MEDICAL_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Disclaimer */}
      <section className="bg-surface pb-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="yc-disclaimer flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">政策免责声明</p>
              <p className="mt-1">{POLICY_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Sections */}
      <section className="bg-surface py-12">
        <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    section.highlight ? "bg-red-50" : "bg-brand-50"
                  }`}
                >
                  <section.icon
                    className={`h-5 w-5 ${
                      section.highlight ? "text-danger" : "text-brand-600"
                    }`}
                  />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t border-border bg-surface-secondary py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold text-text-primary">
            合规咨询与反馈
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-text-secondary">
            如您对平台的合规性有任何疑问或建议，欢迎通过以下方式联系我们
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="yc-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <Mail className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">邮箱</p>
                <p className="text-sm font-medium text-text-primary">
                  compliance@yance.ai
                </p>
              </div>
            </div>
            <div className="yc-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <Phone className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">电话</p>
                <p className="text-sm font-medium text-text-primary">
                  021-8888-9999
                </p>
              </div>
            </div>
            <div className="yc-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <FileText className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">地址</p>
                <p className="text-sm font-medium text-text-primary">
                  上海市浦东新区
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
