import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShieldCheck } from "lucide-react";

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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <ShieldCheck className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-center text-3xl font-bold text-text-primary sm:text-4xl">隐私政策</h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
            本政策说明衍策银龄 AI 如何收集、使用、存储与保护您的个人信息，以及您可行使的权利。
          </p>
          <p className="mt-3 text-center text-xs text-text-muted">最近更新：{LAST_UPDATED}</p>
        </div>
      </section>

      <main className="bg-surface py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm leading-relaxed text-text-secondary">
            本政策由 <strong className="text-text-primary">上海衍策引擎人工智能科技有限公司</strong>
            （下称"我们"）制定，适用于我们运营的网站及应用服务（域名：yanglaoai999.com，产品名：衍策银龄 AI / Aging AI Engine）。
            我们依据《中华人民共和国个人信息保护法》《数据安全法》《网络安全法》等规定处理个人信息。若您位于中国大陆以外地区访问，请同时留意当地适用法律。
          </p>

          <Section title="一、我们收集哪些信息">
            <p>我们仅在实现服务功能所必需的范围内收集信息，主要包括：</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><strong>咨询与演示留资</strong>：您通过"联系我们"表单主动提交的姓名、公司、邮箱、电话、意向产品与留言，以及您勾选同意本政策的时间记录。</li>
              <li><strong>账户信息</strong>：注册及登录机构用户时，我们处理用户名、手机号、邮箱、所属组织与角色，以及登录会话（JWT）所需的技术信息。</li>
              <li><strong>养老服务数据（由机构/护理人员录入）</strong>：为完成陪诊、护理与健康管理等工作流，机构用户可能录入老年人档案，包括姓名、性别、出生日期、联系电话、住址、照护等级，以及<strong>身份证号等敏感个人信息</strong>。</li>
              <li><strong>健康类敏感信息</strong>：如慢性病、过敏史、用药记录、就诊记录、体征指标等，仅用于服务交付与健康风险辅助提示。</li>
              <li><strong>服务记录</strong>：订单、护理记录、风险事件、服务报告等，个别报告可能包含现场照片或位置信息。</li>
              <li><strong>家属/紧急联系人</strong>：姓名、电话与关系，用于服务通知与应急联络。</li>
            </ul>
            <p>我们<strong>不</strong>投放广告，<strong>不</strong>接入第三方广告或行为追踪分析工具；除服务运行必需的登录会话 Cookie 外，不进行额外跨站追踪。</p>
          </Section>

          <Section title="二、我们为何使用这些信息">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>响应您的咨询、安排产品演示与商务合作；</li>
              <li>提供账户登录、权限隔离与工作台协作等核心功能；</li>
              <li>完成陪诊、护理、补贴匹配、政策查询、报告生成等服务流程；</li>
              <li>履行法定义务、保障系统与安全，以及处理数据权利请求。</li>
            </ul>
            <p>其中健康与身份类信息属<strong>敏感个人信息</strong>，我们仅在取得单独同意、并为提供服务所必需时处理。</p>
          </Section>

          <Section title="三、第三方与服务提供商">
            <p>为运行本服务，我们使用以下受信任的处理方（受托方），其处理范围限于完成自身服务所必需：</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><strong>网站托管（Vercel）</strong>与<strong>数据库服务（Neon PostgreSQL）</strong>：用于承载应用与存储数据。</li>
              <li><strong>域名与 DNS 服务</strong>（阿里云/万网等）：用于域名解析与备案相关配置。</li>
              <li><strong>AI 能力</strong>：产品的部分智能功能在需要时经由服务端调用大模型完成；当前版本的部分 AI 结果为算法模拟演示，具体以页面标注为准。</li>
            </ul>
            <p className="rounded-lg border border-border bg-silver-50 p-3 text-xs text-text-secondary">
              跨境提示：上述部分托管与数据库节点可能位于中国境外（如新加坡等）。我们仅在提供服务的必要范围内处理，并持续评估相应合规安排。若您对数据跨境有特定要求，请通过下方联系方式与我们沟通。
            </p>
            <p>我们不会出售您的个人信息，也不会将其用于广告投放。</p>
          </Section>

          <Section title="四、我们如何存储与保护">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>访问传输通过 HTTPS 加密；</li>
              <li>基于角色（RBAC）的权限控制，敏感数据接口需登录后方可访问；</li>
              <li>数据隔离与操作留痕，降低越权访问风险。</li>
            </ul>
            <p>我们将持续加强安全措施（如静态数据加密、更完善的风险监控等）。请勿将本政策理解为对特定安全认证或等级保护的承诺；如您需要我方配合完成特定安全评估，请另行洽谈。</p>
          </Section>

          <Section title="五、保留期限">
            <p>我们仅在实现本政策所述目的所必需的期限内保留个人信息：账户与相关数据在您注销或提出删除请求并经身份核实后予以删除或匿名化；机构录入的老人档案由其所属机构管理，并在服务关系终止后按合同与法律要求处理。法定留存要求另有规定的除外。</p>
          </Section>

          <Section title="六、您的权利">
            <p>依据个人信息保护法，您有权查阅、复制、更正、补充、删除您的个人信息，撤回同意，以及注销账户。您可随时通过"联系我们"表单或下方邮箱提出请求，我们将在身份核实后于合理期限内处理。</p>
            <p>对于由机构代为录入的老人及家属信息，相关权利请求可由本人或其监护人、机构管理员提出，我们将协助完成。</p>
          </Section>

          <Section title="七、未成年人">
            <p>本服务面向养老行业的机构、护理人员及成年家属，不面向儿童。我们不会主动收集不满十四周岁未成年人的个人信息；如误收集，请通知我们以便删除。</p>
          </Section>

          <Section title="八、政策更新">
            <p>我们可能适时更新本政策。重大变更时，我们会在页面公示或以合理方式通知。继续使用服务即表示您接受更新后的政策。</p>
          </Section>

          <Section title="九、如何联系我们">
            <p>如对本政策或个人信息处理有任何疑问、意见或请求，请通过以下方式联系：</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>邮箱：contact@yanglaoai999.com</li>
              <li>站点内"联系我们"表单：/contact</li>
              <li>主体：上海衍策引擎人工智能科技有限公司</li>
            </ul>
          </Section>

          <p className="mt-10 text-xs text-text-muted">
            本政策与《服务条款》共同构成您使用衍策银龄 AI 的完整约定。
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
