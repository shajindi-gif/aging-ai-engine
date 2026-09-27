"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Camera } from "lucide-react";
import ElderShell from "@/components/silvercare/ElderShell";
import { useSelectedElder } from "@/lib/silvercare/use-elder";
import { RISK_LEVEL_LABEL, RISK_LEVEL_COLOR } from "@/lib/silvercare/ui";

/** 计时器 Hook：start/pause/reset，秒表精度 0.1s */
function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<{ t0: number; acc: number }>({ t0: 0, acc: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setElapsed(ref.current.acc + (Date.now() - ref.current.t0) / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    ref.current.t0 = Date.now();
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  return {
    elapsed,
    running,
    start: () => { ref.current = { t0: Date.now(), acc: ref.current.acc }; setRunning(true); },
    pause: () => { ref.current.acc = ref.current.acc + (Date.now() - ref.current.t0) / 1000; setRunning(false); },
    reset: () => { setRunning(false); ref.current = { t0: 0, acc: 0 }; setElapsed(0); },
    value: () => +elapsed.toFixed(1),
  };
}

const QUESTIONS: { key: string; label: string }[] = [
  { key: "fellLast12Months", label: "最近 12 个月内跌倒过" },
  { key: "usesWalkingAid", label: "平时使用拐杖或助行器" },
  { key: "adlLimited", label: "日常活动（穿衣、洗澡、如厕）需要帮助" },
  { key: "hasDizziness", label: "经常感到头晕" },
  { key: "hasVisionProblem", label: "视力有明显问题" },
];

export default function ElderMobilityPage() {
  const { elder, elderId, loading } = useSelectedElder();
  const sts = useTimer();
  const walk = useTimer();
  const balance = useTimer();
  const [questionnaire, setQuestionnaire] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function submitTest(testType: "STS" | "WALK" | "BALANCE", data: Record<string, unknown>) {
    if (!elderId) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/silvercare/mobility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderlyId: elderId, testType, ...questionnaire, ...data }),
      });
      const json = await res.json();
      if (res.ok && json.success) setResult(json.data);
      else setError(json.error || "提交失败，请重试");
    } catch {
      setError("网络异常，请重试");
    } finally {
      setSubmitting(false);
    }
  }

  function TimerCard({
    title, desc, timer, actionLabel, onSubmit,
  }: { title: string; desc: string; timer: ReturnType<typeof useTimer>; actionLabel: string; onSubmit: (data: Record<string, unknown>) => void }) {
    return (
      <section className="rounded-2xl border-2 border-border bg-white p-6">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        <p className="mt-1 text-base leading-relaxed text-text-secondary">{desc}</p>
        <p className="my-6 text-center text-6xl font-bold tabular-nums text-brand-700">
          {timer.elapsed.toFixed(1)}<span className="ml-1 text-2xl text-text-muted">秒</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={timer.running ? timer.pause : timer.start}
            className={`flex min-h-16 items-center justify-center gap-2 rounded-xl text-xl font-bold text-white transition ${timer.running ? "bg-gold-600 hover:bg-gold-700" : "bg-brand-600 hover:bg-brand-700"}`}
          >
            {timer.running ? <><Pause className="h-7 w-7" aria-hidden="true" /> 暂停</> : <><Play className="h-7 w-7" aria-hidden="true" /> 开始</>}
          </button>
          <button onClick={timer.reset} className="flex min-h-16 items-center justify-center gap-2 rounded-xl border-2 border-border text-xl font-bold text-text-secondary hover:bg-silver-50">
            <RotateCcw className="h-6 w-6" aria-hidden="true" /> 重置
          </button>
        </div>
        <button
          onClick={() => onSubmit({})}
          disabled={submitting || timer.value() <= 0}
          className="yc-btn-secondary mt-3 min-h-14 w-full justify-center text-lg disabled:opacity-50"
        >
          {actionLabel}
        </button>
      </section>
    );
  }

  return (
    <ElderShell title="活动能力测试" active="mobility" elderId={elderId} elderName={elder?.name}>
      {loading ? <p className="text-lg text-text-secondary">加载中…</p> : !elder ? (
        <p className="text-lg text-text-secondary">请先创建老人档案。</p>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-5">
            <Camera className="mt-1 h-8 w-8 shrink-0 text-brand-600" aria-hidden="true" />
            <p className="text-base leading-relaxed text-text-secondary">
              当前版本使用<strong>手动计时</strong>方式完成测试。摄像头姿态识别（自动计数、晃动分析）为下一阶段能力（P4），暂未上线。
            </p>
          </div>

          <TimerCard
            title="① 起立测试（5 次）"
            desc="坐在结实的椅子上，连续完成 5 次「站起来 → 坐下」。家人点击开始计时，全部完成后暂停。"
            timer={sts}
            actionLabel="完成 5 次，保存结果"
            onSubmit={() => submitTest("STS", { reps: 5, durationSec: sts.value() })}
          />

          <TimerCard
            title="② 步行测试（4 米）"
            desc="在地面上量出 4 米距离（可用地板砖估算），老人以平常速度走完，记录用时。"
            timer={walk}
            actionLabel="走完 4 米，保存结果"
            onSubmit={() => submitTest("WALK", { durationSec: walk.value() })}
          />

          <TimerCard
            title="③ 平衡测试（单脚站立）"
            desc="扶着椅背站稳后抬起一只脚，尽量坚持，家人计时。建议有人在旁保护。"
            timer={balance}
            actionLabel="结束并保存坚持时间"
            onSubmit={() => submitTest("BALANCE", { holdTimeSec: balance.value() })}
          />

          <section className="rounded-2xl border-2 border-border bg-white p-6">
            <h2 className="text-xl font-bold text-text-primary">基本情况</h2>
            <div className="mt-4 space-y-3">
              {QUESTIONS.map((q) => (
                <label key={q.key} className="flex min-h-16 items-center gap-4 rounded-xl border-2 border-border px-5 text-lg hover:border-brand-300">
                  <input
                    type="checkbox"
                    checked={!!questionnaire[q.key]}
                    onChange={(e) => setQuestionnaire((v) => ({ ...v, [q.key]: e.target.checked }))}
                    className="h-7 w-7 shrink-0 accent-teal-600"
                  />
                  <span className="font-medium text-text-primary">{q.label}</span>
                </label>
              ))}
            </div>
          </section>

          {error && <p className="rounded-xl bg-red-50 px-5 py-4 text-lg text-red-700">{error}</p>}

          {result?.risk && (
            <section className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-6">
              <h2 className="text-2xl font-bold text-text-primary">跌倒风险评估结果</h2>
              <p className="mt-4 text-5xl font-bold text-text-primary">
                {result.risk.score}<span className="text-2xl text-text-muted">/100</span>
                <span className={`ml-4 text-2xl ${RISK_LEVEL_COLOR[result.risk.level]}`}>
                  {RISK_LEVEL_LABEL[result.risk.level]}
                </span>
              </p>
              <p className="mt-1 text-base text-text-muted">衰弱风险：{RISK_LEVEL_LABEL[result.risk.frailtyLevel]}</p>

              {result.risk.factors?.length > 0 && (
                <>
                  <h3 className="mt-5 text-lg font-bold text-text-primary">主要风险因素</h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-6 text-lg text-text-secondary">
                    {result.risk.factors.slice(0, 5).map((f: any, i: number) => (
                      <li key={i}>{f.detail}</li>
                    ))}
                  </ol>
                </>
              )}
              <h3 className="mt-5 text-lg font-bold text-text-primary">建议</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-lg text-text-secondary">
                {result.risk.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
              <p className="mt-5 rounded-xl bg-white/70 p-4 text-sm leading-relaxed text-text-muted">{result.risk.disclaimer}</p>
            </section>
          )}
        </div>
      )}
    </ElderShell>
  );
}
