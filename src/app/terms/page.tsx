import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText } from "lucide-react";

const LAST_UPDATED = "2026-09-19";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-text-primary sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <FileText className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-center text-3xl font-bold text-text-primary sm:text-4xl">服务条款</h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
            使用衍策银龄 AI 前，请仔细阅读本条款。您继续使用即表示同意本条款与《隐私政策》。
          </p>
          <p className="mt-3 text-center text-xs text-text-muted">最近更新：{LAST_UPDATED}</p>
        </div>
      </section>

      <main className="bg-surface py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm leading-relaxed text-text-secondary">
            本协议由 <strong className="text-text-primary">上海衍策引擎人工智能科技有限公司</strong>
            与您（包括机构用户、其员工、以及经由机构系统录入数据的终端个人）就使用"衍策银龄 AI / Aging AI Engine"（yanglaoai999.com）达成的约定。
          </p>

          <Section title="一、服务内容">
            <p>我们提供面向养老服务场景的软件与工具，包括但不限于：养老政策信息检索与补贴资格匹配、陪诊与护理服务管理（CRM）、老人档案与健康管理辅助、机构信息检索、AI 辅助生成摘要/报告，以及面向开发者开放的接口、SDK 与插件等。具体可用功能以您所选版本及实际开通为准。</p>
          </Section>

          <Section title="二、账户与使用规范">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>您应提供真实、准确的信息，并妥善保管账户与登录凭证，对账户下的操作负责。</li>
              <li>不得用于违法用途，不得侵害他人权益，不得绕过访问控制、爬取或滥用接口、上传恶意代码。</li>
              <li>机构用户录入并处理老人、家属等个人信息时，应自行确保已依法取得相应同意或具备合法处理依据，并遵守《个人信息保护法》等规定。</li>
            </ul>
          </Section>

          <Section title="三、重要边界与免责声明">
            <div className="rounded-lg border border-border bg-silver-50 p-4">
              <p className="font-semibold text-text-primary">本平台不构成医疗或法律意见。</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>平台不提供疾病诊断、治疗方案或用药建议。AI 生成的健康相关内容由算法辅助生成，仅供护理人员参考，<strong>不替代执业医师判断</strong>；请以线下专业医疗意见为准。</li>
                <li>政策与补贴匹配结果基于公开信息整理，仅供参考，<strong>最终资格以当地主管部门审核为准</strong>。平台不代办申请、不承诺申报结果。</li>
                <li>部分 AI 功能在当前版本可能以算法演示形式呈现，实际能力以页面标注为准。</li>
              </ul>
            </div>
          </Section>

          <Section title="四、费用、订单与发票">
            <p>页面展示的价格为公开参考。付费、续费、退款及开票等商务安排，以双方另行签署的合同或订单确认为准。就中国大陆客户，我们可应要求在提供正式服务后开具合规税务发票（开票主体为上海衍策引擎人工智能科技有限公司）；付款收据或页面截图不构成税务发票。</p>
          </Section>

          <Section title="五、知识产权">
            <p>本平台的软件、界面、文档及我们原创内容的知识产权归我们或相应权利人所有。您在平台中录入的业务数据权益归您或相关权利人所有。未经许可，不得复制、转售或用于竞争性产品。</p>
          </Section>

          <Section title="六、服务变更与终止">
            <p>我们可能因业务调整、合规要求或安全需要而变更、中断或终止部分功能，并将在合理范围内提前通知。若您违反本协议，我们有权限制或暂停相关账户功能。</p>
          </Section>

          <Section title="七、责任限制">
            <p>在法律允许的范围内，平台按"现状"和"可用"状态提供。对于因使用或无法使用服务而产生的间接、附带或特殊性损失，我们在法律允许的最大范围内不承担责任；我们的累计责任以您在相关期间实际支付的金额为上限。本条款不排除我们无法依法免责的责任。</p>
          </Section>

          <Section title="八、法律适用与争议解决">
            <p>本协议适用中华人民共和国法律。因本协议产生的争议，双方应友好协商；协商不成的，提交我们住所地有管辖权的人民法院解决。</p>
          </Section>

          <Section title="九、联系我们">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>邮箱：contact@yanglaoai999.com</li>
              <li>咨询表单：/contact</li>
              <li>隐私相关请参见《隐私政策》：/privacy</li>
            </ul>
          </Section>

          <p className="mt-10 text-xs text-text-muted">
            本《服务条款》与《隐私政策》共同构成您使用衍策银龄 AI 的完整约定。
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
