// ═══════════════════════════════════════════════
// 衍策银龄 AI SDK v2 — Namespace-based Client
// ═══════════════════════════════════════════════

import {
  AgingAIError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  createErrorFromResponse,
} from "./errors";

import type {
  ApiResponse,
  AgingAIClientOptions,
  Policy,
  PolicyFilters,
  Elder,
  ElderFilters,
  CareOrder,
  CareOrderFilters,
  CareRecord,
  CareRecordFilters,
  Institution,
  InstitutionFilters,
  Lead,
  LeadFilters,
  PolicyMatchAgentResult,
  ElderReportAgentResult,
  InstitutionProfileAgentResult,
  RiskAlertAgentResult,
  CareSummaryAgentResult,
  SalesFollowupAgentResult,
} from "./types";

export * from "./types";
export { AgingAIError, AuthenticationError, RateLimitError, ValidationError };

export class AgingAIClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(options?: AgingAIClientOptions) {
    this.baseUrl = (options?.baseUrl || "http://localhost:3000").replace(/\/+$/, "");
    this.apiKey = options?.apiKey;
    this.timeout = options?.timeout || 30000;
  }

  // ─── Internal HTTP ────────────────────────────────
  private buildHeaders(): Record<string, string> {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (this.apiKey) h["Authorization"] = `Bearer ${this.apiKey}`;
    return h;
  }

  private async get<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
    const qs = params
      ? "?" + new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== "") as [string, string][]
        ).toString()
      : "";
    return this.request<T>("GET", `${path}${qs}`);
  }

  private async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method,
        headers: this.buildHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
      clearTimeout(tid);

      if (!res.ok) {
        let errBody: Record<string, string> = {};
        try { errBody = await res.json(); } catch { /* noop */ }
        throw createErrorFromResponse(res.status, errBody);
      }

      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(tid);
      if (err instanceof AgingAIError) throw err;
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new AgingAIError(`请求超时 (${this.timeout}ms): ${method} ${path}`);
      }
      throw new AgingAIError(`网络请求失败: ${err instanceof Error ? err.message : "未知错误"}`);
    }
  }

  // ─── Policies ─────────────────────────────────────
  policies = {
    list: (filters?: PolicyFilters) =>
      this.get<ApiResponse<Policy[]>>("/api/policies", {
        region: filters?.region,
        policyType: filters?.policyType,
        keyword: filters?.keyword,
      }).then((r) => r.data),

    get: (id: string) =>
      this.get<ApiResponse<Policy>>(`/api/policies/${id}`).then((r) => r.data),

    match: (input: Record<string, unknown>) =>
      this.post<ApiResponse<unknown>>("/api/policy-match", input).then((r) => r.data),
  };

  // ─── Elders ───────────────────────────────────────
  elders = {
    list: (filters?: ElderFilters) =>
      this.get<ApiResponse<Elder[]>>("/api/elders", {
        careLevel: filters?.careLevel,
        livingStatus: filters?.livingStatus,
        region: filters?.region,
      }).then((r) => r.data),

    get: (id: string) =>
      this.get<ApiResponse<Elder>>(`/api/elders/${id}`).then((r) => r.data),

    create: (data: Record<string, unknown>) =>
      this.post<ApiResponse<Elder>>("/api/elders", data).then((r) => r.data),
  };

  // ─── Care Orders ──────────────────────────────────
  careOrders = {
    list: (filters?: CareOrderFilters) =>
      this.get<ApiResponse<CareOrder[]>>("/api/care-orders", {
        status: filters?.status,
        serviceType: filters?.serviceType,
        elderId: filters?.elderId,
      }).then((r) => r.data),

    create: (data: Record<string, unknown>) =>
      this.post<ApiResponse<CareOrder>>("/api/care-orders", data).then((r) => r.data),
  };

  // ─── Care Records ─────────────────────────────────
  careRecords = {
    list: (filters?: CareRecordFilters) =>
      this.get<ApiResponse<CareRecord[]>>("/api/care-records", {
        elderId: filters?.elderId,
        recordType: filters?.recordType,
        careOrderId: filters?.careOrderId,
      }).then((r) => r.data),

    create: (data: Record<string, unknown>) =>
      this.post<ApiResponse<CareRecord>>("/api/care-records", data).then((r) => r.data),
  };

  // ─── Institutions ─────────────────────────────────
  institutions = {
    list: (filters?: InstitutionFilters) =>
      this.get<ApiResponse<Institution[]>>("/api/institutions", {
        region: filters?.region,
        institutionType: filters?.institutionType,
      }).then((r) => r.data),

    get: (id: string) =>
      this.get<ApiResponse<Institution>>(`/api/institutions/${id}`).then((r) => r.data),
  };

  // ─── Leads ────────────────────────────────────────
  leads = {
    list: (filters?: LeadFilters) =>
      this.get<ApiResponse<Lead[]>>("/api/leads", {
        followUpStatus: filters?.followUpStatus,
        leadType: filters?.leadType,
      }).then((r) => r.data),

    create: (data: Record<string, unknown>) =>
      this.post<ApiResponse<Lead>>("/api/leads", data).then((r) => r.data),
  };

  // ─── Agents ───────────────────────────────────────
  agents = {
    policyMatch: (input: Record<string, unknown>) =>
      this.post<ApiResponse<PolicyMatchAgentResult>>("/api/agents/policy-match", input).then((r) => r.data),

    elderReport: (elderId: string) =>
      this.post<ApiResponse<ElderReportAgentResult>>("/api/agents/elder-report", { elderId }).then((r) => r.data),

    institutionProfile: (institutionId: string) =>
      this.post<ApiResponse<InstitutionProfileAgentResult>>("/api/agents/institution-profile", { institutionId }).then((r) => r.data),

    riskAlert: (elderId: string) =>
      this.post<ApiResponse<RiskAlertAgentResult>>("/api/agents/risk-alert", { elderId }).then((r) => r.data),

    careSummary: (careOrderId: string) =>
      this.post<ApiResponse<CareSummaryAgentResult>>("/api/agents/care-summary", { careOrderId }).then((r) => r.data),

    salesFollowup: (leadId: string) =>
      this.post<ApiResponse<SalesFollowupAgentResult>>("/api/agents/sales-followup", { leadId }).then((r) => r.data),
  };
}

export default AgingAIClient;
