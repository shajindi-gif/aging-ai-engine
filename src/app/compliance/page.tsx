import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Shield,
  Stethoscope,
  BookOpen,
  Lock,
  Server,
  Mail,
  MessageSquare,
  MapPin,
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
      "个人信息在传输过程中通过 HTTPS 加密保护；静态数据加密等措施在持续加强。",
      "数据最小化原则，仅收集服务必需信息。",
      "敏感数据接口需登录访问，并按角色进行权限隔离。",
      "用户可通过账户或联系客服申请查阅、更正、删除个人数据，请求在身份核实后处理。",
    ],
  },
  {
    icon: Stethoscope,
    title: "2. 医疗合规",
    content: [
      "本平台不提供医疗诊断、治疗建议或医疗决策。",
      "AI 健康评估报告仅供护理人员参考，不替代执业医生判断。",
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
      "平台不代办政策申请，不提供结果承诺。",
      "政策数据随来源更新持续维护，重大变更尽力及时推送。",
    ],
  },
  {
    icon: Lock,
    title: "4. 隐私保护",
    content: [
      "不向第三方出售用户数据，不用于广告投放。",
      "不使用您的个人数据训练第三方大模型；AI 功能仅在提供服务所必需时经服务端调用。",
      "数据访问实行权限控制，关键操作留痕可追溯。",
      "支持按需评估私有化部署方案。",
      "发生安全事件时，依法及时告知用户并向主管部门报告。",
    ],
  },
  {
    icon: Server,
    title: "5. 安全标准",
    content: [
      "传输层启用 HTTPS；部署于成熟云平台，具备基础网络防护能力。",
      "基于角色（RBAC）的权限管理。",
      "关键功能发布前进行代码与安全审查。",
      "静态数据加密、双因素认证、入侵检测等属持续建设项，尚未全部落地。",
      "如客户合规需要，我们可配合开展安全评估，并就等级保护（等保）备案与认证另行推进。",
    ],
  },
  {
    icon: Eye,
    title: "6. AI 透明度",
    content: [
      "对 AI 辅助生成的内容提供说明与风险提示。",
      "高风险 AI 输出标注需人工复核后使用。",
      "本版本部分 AI 能力为算法演示，实际效果以页面标注为准。",
      "不夸大模型准确率或保密能力。",
    ],
  },
  {
    icon: Database,
    title: "7. 数据治理",
    content: [
      "数据分类分级管理，敏感数据特殊保护。",
      "数据保留与删除依《隐私政策》执行，账户注销或服务终止后按约定处理。",
      "数据导出支持标准格式（能力随版本迭代完善）。",
      "访问与操作留痕，便于审计与追溯。",
    ],
  },
  {
    icon: Users,
    title: "8. 无障碍与适老化",
    content: [
      "界面设计参考无障碍与适老化实践。",
      "逐步优化大字体、高对比度等可访问性支持。",
      "家属和护理人员可代为操作。",
    ],
  },
  {
    icon: Scale,
    title: "9. 商业合规",
    content: [
      "价格公开，无隐藏费用。",
      "合同条款清晰，服务等级以正式合同约定为准。",
      "退款与开票按合同约定执行，可开具合规税务发票。",
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
            我们在数据安全、医疗边界和用户隐私方面的实践与承诺（部分为持续建设项，以实际落地为准）
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
                <p className="text-sm font-medium text-text-primary">contact@yanglaoai999.com</p>
              </div>
            </div>
            <a href="/contact" className="yc-card flex items-center gap-3 transition-colors hover:border-brand-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <MessageSquare className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">在线咨询</p>
                <p className="text-sm font-medium text-text-primary">填写联系表单</p>
              </div>
            </a>
            <div className="yc-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <MapPin className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted">主体</p>
                <p className="text-sm font-medium text-text-primary">上海衍策引擎 · 浦东新区</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
