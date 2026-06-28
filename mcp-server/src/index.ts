#!/usr/bin/env node
// ═══════════════════════════════════════════════
// 衍策银龄 AI MCP Server v2
// Model Context Protocol — stdio transport
// 12 tools for aging care ecosystem
// ═══════════════════════════════════════════════

import { searchAgingPolicyTool, executeSearchAgingPolicy } from "./tools/search_aging_policy";
import { matchElderSubsidyTool, executeMatchElderSubsidy } from "./tools/match_elder_subsidy";
import { summarizePolicyTool, executeSummarizePolicy } from "./tools/summarize_policy";
import { generateApplicationMaterialsTool, executeGenerateApplicationMaterials } from "./tools/generate_application_materials";
import { searchAgingInstitutionTool, executeSearchAgingInstitution } from "./tools/search_aging_institution";
import { profileAgingInstitutionTool, executeProfileAgingInstitution } from "./tools/profile_aging_institution";
import { createCareRecordTool, executeCreateCareRecord } from "./tools/create_care_record";
import { generateElderFamilyReportTool, executeGenerateElderFamilyReport } from "./tools/generate_elder_family_report";
import { detectElderRiskTool, executeDetectElderRisk } from "./tools/detect_elder_risk";
import { generateCareServiceSummaryTool, executeGenerateCareServiceSummary } from "./tools/generate_care_service_summary";
import { generateSalesFollowupPlanTool, executeGenerateSalesFollowupPlan } from "./tools/generate_sales_followup_plan";
import { searchSilverEconomyLeadsTool, executeSearchSilverEconomyLeads } from "./tools/search_silver_economy_leads";

// ─── Server Info ───────────────────────────────
const SERVER_INFO = {
  name: "aging-ai-engine",
  version: "0.2.0",
  description: "衍策银龄 AI MCP Server — 中国老龄化社会 AI 服务引擎",
};

const PROTOCOL_VERSION = "2024-11-05";

// ─── Tool Registry ─────────────────────────────
const tools = [
  searchAgingPolicyTool,
  matchElderSubsidyTool,
  summarizePolicyTool,
  generateApplicationMaterialsTool,
  searchAgingInstitutionTool,
  profileAgingInstitutionTool,
  createCareRecordTool,
  generateElderFamilyReportTool,
  detectElderRiskTool,
  generateCareServiceSummaryTool,
  generateSalesFollowupPlanTool,
  searchSilverEconomyLeadsTool,
];

const toolExecutors: Record<string, (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>> = {
  search_aging_policy: executeSearchAgingPolicy,
  match_elder_subsidy: executeMatchElderSubsidy,
  summarize_policy: executeSummarizePolicy,
  generate_application_materials: executeGenerateApplicationMaterials,
  search_aging_institution: executeSearchAgingInstitution,
  profile_aging_institution: executeProfileAgingInstitution,
  create_care_record: executeCreateCareRecord,
  generate_elder_family_report: executeGenerateElderFamilyReport,
  detect_elder_risk: executeDetectElderRisk,
  generate_care_service_summary: executeGenerateCareServiceSummary,
  generate_sales_followup_plan: executeGenerateSalesFollowupPlan,
  search_silver_economy_leads: executeSearchSilverEconomyLeads,
};

// ─── JSON-RPC Types ────────────────────────────
interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

// ─── Request Handler ───────────────────────────
async function handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
  const { id, method, params } = request;

  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: { tools: { listChanged: false } },
            serverInfo: SERVER_INFO,
          },
        };

      case "notifications/initialized":
        return { jsonrpc: "2.0", id, result: {} };

      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: { tools },
        };

      case "tools/call": {
        const toolName = params?.name as string;
        const toolArgs = (params?.arguments || {}) as Record<string, unknown>;

        if (!toolName || !toolExecutors[toolName]) {
          return {
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `未知的工具: ${toolName}` },
          };
        }

        const executor = toolExecutors[toolName];
        const result = await executor(toolArgs);

        return {
          jsonrpc: "2.0",
          id,
          result: { content: result.content, isError: false },
        };
      }

      case "ping":
        return { jsonrpc: "2.0", id, result: {} };

      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `不支持的方法: ${method}` },
        };
    }
  } catch (error) {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code: -32603,
        message: `内部错误: ${error instanceof Error ? error.message : "未知错误"}`,
      },
    };
  }
}

// ─── stdin/stdout Transport ────────────────────
let buffer = "";

function processInput(data: string): void {
  buffer += data;
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const request: JsonRpcRequest = JSON.parse(trimmed);
      handleRequest(request).then((response) => {
        if (request.method === "notifications/initialized") return;
        process.stdout.write(JSON.stringify(response) + "\n");
      });
    } catch {
      const errorResponse: JsonRpcResponse = {
        jsonrpc: "2.0",
        id: "",
        error: { code: -32700, message: "JSON 解析错误" },
      };
      process.stdout.write(JSON.stringify(errorResponse) + "\n");
    }
  }
}

// ─── Start Server ──────────────────────────────
function startServer(): void {
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", processInput);
  process.stdin.on("end", () => process.exit(0));

  process.stderr.write(
    `[衍策银龄 AI MCP Server] 已启动 (v${SERVER_INFO.version})\n` +
    `[衍策银龄 AI MCP Server] 提供 ${tools.length} 个工具\n` +
    `[衍策银龄 AI MCP Server] 等待 MCP 客户端连接...\n`
  );
}

startServer();
