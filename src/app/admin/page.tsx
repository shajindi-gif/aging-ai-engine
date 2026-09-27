import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LayoutDashboard, HeartPulse, Users, Bell, PlusCircle, Wrench } from "lucide-react";

const ENTRIES = [
  { href: "/dashboard", title: "原工作台", desc: "既有业务工作台（政策库、CRM、线索等）", icon: LayoutDashboard },
  { href: "/elder", title: "老人端", desc: "大字体健康主页：今日健康、检测、任务、AI 助手", icon: HeartPulse },
  { href: "/family", title: "家属看板", desc: "家人健康状态、风险、趋势与 AI 摘要", icon: Users },
  { href: "/care-center", title: "机构看板", desc: "护理对象总览，按风险排序与筛选（基础版）", icon: Wrench },
  { href: "/alerts", title: "提醒中心", desc: "异常事件分级提醒与处理", icon: Bell },
  { href: "/onboarding", title: "新建老人档案", desc: "快速建立健康档案并开始评估", icon: PlusCircle },
];

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-secondary">
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="yc-eyebrow">系统入口</span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">SilverCare OS 导航</h1>
          <p className="mt-2 text-sm text-text-secondary">YanglaoAI 各端入口总览（需登录后访问）。</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {ENTRIES.map((e) => (
              <Link key={e.href} href={e.href} className="yc-card group flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <e.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-text-primary group-hover:text-brand-700">{e.title}</h2>
                  <p className="mt-1 text-sm text-text-secondary">{e.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
