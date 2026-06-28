// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils/cn";
import {
  BookOpen, Users, Building2, Shield, FileText, TrendingUp,
  Play, Loader2, CheckCircle2, AlertTriangle, Clock,
} from "lucide-react";

const agentDefs = [
  { id: "policy_match", name: "政策匹配 Agent", icon: BookOpen, color: "bg-brand-50 text-brand-600", desc: "根据老人信息智能匹配可享受的养老补贴政策", inputLabel: "请输入老人年龄、城市、护理等级", inputPlaceholder: "例：75岁，上海，半自理" },
  { id: "family_report", name: "家属报告 Agent", icon: Users, color: "bg-gold-50 text-gold-600", desc: "自动生成家属周报，包含健康观察和服务总结", inputLabel: "请输入老人姓名或档案ID", inputPlaceholder: "例：王秀兰 或 eld-001" },
  { id: "institution_profile", name: "机构画像 Agent", icon: Building2, color: "bg-blue-50 text-blue-600", desc: "分析养老机构数字化成熟度，生成画像报告", inputLabel: "请输入机构名称或ID", inputPlaceholder: "例：上海和熹颐养院" },
  { id: "risk_assessment", name: "风险预警 Agent", icon: Shield, color: "bg-red-50 text-red-600", desc: "评估老人健康风险等级，生成预警建议", inputLabel: "请输入老人姓名或症状描述", inputPlaceholder: "例：李国华，血氧偏低" },
  { id: "service_report", name: "服务总结 Agent", icon: FileText, color: "bg-green-50 text-green-600", desc: "汇总服务记录，生成月度/季度服务报告", inputLabel: "请输入时间段或老人姓名", inputPlaceholder: "例：2024年10月 王秀兰" },
  { id: "sales_followup", name: "销售跟进 Agent", icon: TrendingUp, color: "bg-purple-50 text-purple-600", desc: "分析销售线索状态，建议跟进策略", inputLabel: "请输入机构名或线索ID", inputPlaceholder: "例：杭州金色年华" },
];

interface AgentResult {
  output: string;
  confidence: number;
  sources: string[];
  requiresReview: boolean;
}

const mockOutputs: Record<string, AgentResult> = {
  policy_match: { output: JSON.stringify({ matched_policies: 5, top_match: "上海市高龄老人津贴", score: 92, estimated_benefit: "每月300元", next_steps: ["前往街道社区事务受理中心", "携带身份证和户口本"] }, null, 2), confidence: 0.91, sources: ["上海市民政局官网", "政策数据库 v2024.10"], requiresReview: false },
  family_report: { output: JSON.stringify({ elder: "王秀兰", period: "2024-10-07 ~ 2024-10-13", services: 3, health_status: "稳定", highlights: ["血压正常", "血糖偏高需关注"], recommendations: ["控制碳水摄入", "按时服药"] }, null, 2), confidence: 0.88, sources: ["服务记录系统", "健康监测数据"], requiresReview: true },
  institution_profile: { output: JSON.stringify({ name: "上海和熹颐养院", maturity_level: "L3", score: 72, strengths: ["信息系统完善", "服务数字化程度高"], weaknesses: ["数据管理待提升", "员工技术采用率偏低"], recommendation: "推荐数据中台+智能床垫方案" }, null, 2), confidence: 0.85, sources: ["机构数据库", "行业报告"], requiresReview: false },
  risk_assessment: { output: JSON.stringify({ elder: "李国华", risk_level: "高", risks: ["血氧饱和度低于90%风险", "多药并用相互作用"], urgent_actions: ["密切监测血氧", "药物相互作用检查"], follow_up: "建议48小时内复诊" }, null, 2), confidence: 0.93, sources: ["健康档案", "用药记录", "最近就诊记录"], requiresReview: true },
  service_report: { output: JSON.stringify({ period: "2024年10月", elder: "王秀兰", total_services: 6, total_hours: 18, health_trend: "稳定偏好", key_findings: ["血糖控制改善", "跌倒风险降低"], cost: "¥1,280" }, null, 2), confidence: 0.90, sources: ["CRM系统", "财务系统"], requiresReview: false },
  sales_followup: { output: JSON.stringify({ institution: "杭州金色年华", status: "已联系", suggested_action: "安排线上演示", priority: "高", estimated_value: "¥120,000", timeline: "预计2周内推进到方案阶段", talking_points: ["电子服务记录", "家属沟通小程序"] }, null, 2), confidence: 0.82, sources: ["CRM线索库", "历史沟通记录"], requiresReview: false },
};

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [recentTasks] = useState([
    { id: "task-001", type: "政策匹配", status: "completed", time: "2024-10-16 14:30", confidence: 0.91 },
    { id: "task-002", type: "家属报告", status: "review", time: "2024-10-16 10:15", confidence: 0.88 },
    { id: "task-003", type: "风险预警", status: "completed", time: "2024-10-15 16:45", confidence: 0.93 },
  ]);

  const currentAgent = agentDefs.find((a) => a.id === selectedAgent);

  const handleRun = () => {
    if (!selectedAgent || !input.trim()) return;
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(mockOutputs[selectedAgent] ?? mockOutputs.policy_match);
      setRunning(false);
    }, 1500);
  };

  return (
    <>
      <Header />

      <section className="bg-surface-secondary py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="yc-badge yc-badge-brand">AI Agent</span>
          <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">AI Agent 工作台</h1>
          <p className="mt-2 text-text-secondary">内置多种行业专属 Agent，自动执行复杂任务</p>
        </div>
      </section>

      {/* Agent Cards */}
      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agentDefs.map((agent) => (
              <div key={agent.id} onClick={() => { setSelectedAgent(agent.id); setResult(null); setInput(""); }}
                className={cn("yc-card cursor-pointer transition-all hover:shadow-md",
                  selectedAgent === agent.id ? "ring-2 ring-brand-400 border-brand-300" : ""
                )}>
                <div className={cn("mb-3 flex h-11 w-11 items-center justify-center rounded-lg", agent.color)}>
                  <agent.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
                <p className="mt-1 text-xs text-text-secondary">{agent.desc}</p>
                <button className="mt-3 text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  <Play className="h-3 w-3" /> 运行
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Execution Panel */}
      {currentAgent && (
        <section className="bg-surface-secondary py-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="yc-card">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", currentAgent.color)}>
                  <currentAgent.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{currentAgent.name}</h3>
              </div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{currentAgent.inputLabel}</label>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={currentAgent.inputPlaceholder}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none mb-4" />
              <button onClick={handleRun} disabled={running || !input.trim()} className="yc-btn-primary w-full justify-center">
                {running ? <><Loader2 className="h-4 w-4 animate-spin" /> 执行中...</> : <>执行</>}
              </button>

              {result && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-border bg-silver-50 p-4">
                    <p className="text-xs font-medium text-text-muted mb-2">输出结果</p>
                    <pre className="text-xs text-text-primary overflow-x-auto whitespace-pre-wrap">{result.output}</pre>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">置信度:</span>
                      <div className="h-1.5 w-20 rounded-full bg-silver-100">
                        <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${result.confidence * 100}%` }} />
                      </div>
                      <span className="font-medium text-text-primary">{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <span className={cn("yc-badge flex items-center gap-1",
                      result.requiresReview ? "bg-gold-50 text-gold-700" : "bg-green-50 text-green-700"
                    )}>
                      {result.requiresReview ? <><AlertTriangle className="h-3 w-3" /> 需人工审核</> : <><CheckCircle2 className="h-3 w-3" /> 自动通过</>}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">数据来源</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.sources.map((s) => (
                        <span key={s} className="rounded bg-silver-50 px-2 py-0.5 text-xs text-text-muted">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="yc-disclaimer flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-gold-600 mt-0.5" />
                    <p className="text-xs text-text-muted">AI 生成内容仅供参考，请结合实际情况进行判断和决策。</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recent Tasks */}
      <section className="bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">最近 Agent 任务</h2>
          <div className="yc-card !p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-silver-50 text-left text-xs text-text-muted">
                  <th className="px-4 py-3 font-medium">任务ID</th>
                  <th className="px-4 py-3 font-medium">类型</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">时间</th>
                  <th className="px-4 py-3 font-medium">置信度</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-primary">{task.id}</td>
                    <td className="px-4 py-3 text-text-secondary">{task.type}</td>
                    <td className="px-4 py-3">
                      <span className={cn("yc-badge text-xs",
                        task.status === "completed" ? "bg-green-50 text-green-700" : "bg-gold-50 text-gold-700"
                      )}>
                        {task.status === "completed" ? "已完成" : "待审核"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs flex items-center gap-1"><Clock className="h-3 w-3" />{task.time}</td>
                    <td className="px-4 py-3 text-text-primary">{Math.round(task.confidence * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
