// ═══════════════════════════════════════════════
// SilverCare Service Coordination Agent
// 将照护计划转化为真实服务任务和工单
// ═══════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callLLMStructured, isLLMConfigured } from "@/lib/llm";
import type { CarePlanAgentOutput } from "./care-plan-agent";

// ─── Output Types ──────────────────────────────
export interface ServiceAgentOutput {
  created_tasks: Array<{
    task_id: string;
    type: string;
    description: string;
    scheduled_at: string;
    assigned_to: string | null;
    priority: string;
  }>;
  total_tasks_created: number;
  pending_confirmation: Array<{
    task_type: string;
    reason: string;
    requires_human_approval: boolean;
  }>;
  summary: string;
  confidence: number;
}

// ─── System Prompt ─────────────────────────────
const SYSTEM_PROMPT = `你是一名养老服务调度协调员。你的任务是将照护计划中的服务任务转化为可执行的工单。

重要规则：
1. 每个任务必须有明确的时间安排
2. 高风险任务（涉及健康、用药）必须标记为需人工确认
3. 尽量匹配已有的护理员资源
4. 不要自动提交任何政府申请
5. 用中文输出

输出要求（严格JSON）：
{
  "created_tasks": [{"task_id":"ID","type":"类型","description":"描述","scheduled_at":"计划时间","assigned_to":"分配人","priority":"优先级"}],
  "total_tasks_created": 数字,
  "pending_confirmation": [{"task_type":"类型","reason":"原因","requires_human_approval":true}],
  "summary": "总结",
  "confidence": 0.0-1.0
}`;

// ─── Mock Fallback ─────────────────────────────
function getMockOutput(carePlan: CarePlanAgentOutput): ServiceAgentOutput {
  const tasks = carePlan.service_tasks.map((t, i) => ({
    task_id: `TASK-${String(i + 1).padStart(4, "0")}`,
    type: t.type,
    description: t.description,
    scheduled_at: new Date(Date.now() + (i + 1) * 24 * 3600 * 1000).toISOString(),
    assigned_to: null,
    priority: t.priority,
  }));

  return {
    created_tasks: tasks,
    total_tasks_created: tasks.length,
    pending_confirmation: [
      {
        task_type: "护理服务",
        reason: "需要确认护理员排班和老人时间偏好",
        requires_human_approval: true,
      },
    ],
    summary: `已创建 ${tasks.length} 项服务任务，其中 1 项需要人工确认后分配。`,
    confidence: 0.78,
  };
}

// ─── Agent Function ────────────────────────────
export async function serviceAgent(
  caseId: string,
  carePlan: CarePlanAgentOutput
): Promise<ServiceAgentOutput> {
  const startTime = Date.now();

  const run = await prisma.agentRun.create({
    data: {
      caseId,
      agentName: "service-agent",
      skillName: "service-task-create",
      status: "RUNNING",
      input: { carePlan } as any,
      startTime: new Date(),
    },
  });

  try {
    // Get case to find elderlyId
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      select: { elderlyId: true, elderly: { select: { name: true } } },
    });

    const elderlyId = caseRecord?.elderlyId;
    const elderlyName = caseRecord?.elderly?.name ?? "老人";

    let output: ServiceAgentOutput;

    if (isLLMConfigured()) {
      try {
        const userPrompt = `请将以下照护计划转化为具体的服务工单：\n\n老人：${elderlyName}\n\n${JSON.stringify(carePlan.service_tasks, null, 2)}`;
        const { data } = await callLLMStructured<ServiceAgentOutput>(SYSTEM_PROMPT, userPrompt);
        output = data;
      } catch (err) {
        console.warn("[service-agent] LLM call failed, falling back to mock:", err);
        output = getMockOutput(carePlan);
      }
    } else {
      output = getMockOutput(carePlan);
    }

    // Create real ServiceTask records in DB
    if (elderlyId) {
      // Find or create a CareOrder to attach tasks to
      const existingOrder = await prisma.careOrder.findFirst({
        where: { elderlyId, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } },
        select: { id: true },
      });

      let careOrderId = existingOrder?.id;
      if (!careOrderId) {
        const newOrder = await prisma.careOrder.create({
          data: {
            orderNo: `SVC-${Date.now()}`,
            elderlyId,
            elderlyName,
            type: "NURSING",
            status: "CONFIRMED",
            scheduledAt: new Date(),
            organizationId: "ORG-001",
          },
        });
        careOrderId = newOrder.id;
      }

      for (const task of output.created_tasks) {
        await prisma.serviceTask.create({
          data: {
            careOrderId,
            taskType: task.type,
            description: task.description,
            assignedTo: task.assigned_to,
            scheduledAt: new Date(task.scheduled_at),
            status: "PENDING",
          },
        });
      }
    }

    // Update AgentRun
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        output: output as any,
        confidence: output.confidence,
        fallbackUsed: !isLLMConfigured(),
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    });

    // Update Case status
    await prisma.case.update({
      where: { id: caseId },
      data: { status: "TASK_CREATED" },
    });

    return output;
  } catch (error: any) {
    console.error("[service-agent] Error:", error);
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        retryCount: { increment: 1 },
        latencyMs: Date.now() - startTime,
        endTime: new Date(),
      },
    }).catch((e) => console.error("[service-agent] Failed to update AgentRun:", e));
    throw error;
  }
}
