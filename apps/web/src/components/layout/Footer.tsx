import Link from "next/link";
import { Heart } from "lucide-react";

const productLinks = [
  { href: "/pricing", label: "产品定价" },
  { href: "/dashboard", label: "工作台" },
  { href: "#", label: "政策数据库" },
  { href: "#", label: "陪诊CRM" },
];

const resourceLinks = [
  { href: "#", label: "帮助文档" },
  { href: "#", label: "API 文档" },
  { href: "#", label: "行业报告" },
  { href: "#", label: "合作伙伴" },
];

const legalLinks = [
  { href: "/compliance", label: "合规声明" },
  { href: "#", label: "隐私政策" },
  { href: "#", label: "服务条款" },
  { href: "#", label: "数据安全" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-silver-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <Heart className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="text-base font-semibold text-text-primary">
                衍策银龄 AI
              </span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              AI 驱动的养老服务基础设施，为老人家庭、陪诊团队和护理机构提供智能工作助手。
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              产品
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              资源
            </h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              法律
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-border pt-8">
          {/* Company & ICP */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} 上海衍策引擎人工智能科技有限公司
            </p>
            <p className="text-xs text-text-muted">
              沪ICP备2025XXXXXX号-1
            </p>
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            免责声明：本平台提供的健康信息整理、政策解读和补贴匹配等服务仅供
            参考，不替代专业医疗诊断、治疗建议或官方政策文件。具体医疗问题
            请咨询执业医生，政策资格以当地主管部门最终审核为准。
          </p>
        </div>
      </div>
    </footer>
  );
}
