// ═══════════════════════════════════════════════
// 衍策银龄 AI — Client-side API Client
// ═══════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
  error?: string;
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Elders ──────────────────────────────────
export async function fetchElders(params?: {
  careLevel?: string;
  province?: string;
  city?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.careLevel && params.careLevel !== "all") sp.set("careLevel", params.careLevel);
  if (params?.province) sp.set("province", params.province);
  if (params?.city) sp.set("city", params.city);
  if (params?.search) sp.set("search", params.search);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
  return request<any[]>(`/api/elders?${sp}`);
}

export async function fetchElder(id: string) {
  return request<any>(`/api/elders/${id}`);
}

// ─── Policies ────────────────────────────────
export async function fetchPolicies(params?: {
  category?: string;
  level?: string;
  province?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.category && params.category !== "all") sp.set("category", params.category);
  if (params?.level && params.level !== "all") sp.set("level", params.level);
  if (params?.province) sp.set("province", params.province);
  if (params?.status) sp.set("status", params.status);
  if (params?.search) sp.set("search", params.search);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
  return request<any[]>(`/api/policies?${sp}`);
}

export async function fetchPolicy(id: string) {
  return request<any>(`/api/policies/${id}`);
}

// ─── Care Orders ─────────────────────────────
export async function fetchCareOrders(params?: {
  status?: string;
  serviceType?: string;
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.status && params.status !== "all") sp.set("status", params.status);
  if (params?.serviceType) sp.set("serviceType", params.serviceType);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
  return request<any[]>(`/api/care-orders?${sp}`);
}

// ─── Care Records ────────────────────────────
export async function fetchCareRecords(params?: {
  elderId?: string;
  orderId?: string;
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.elderId) sp.set("elderId", params.elderId);
  if (params?.orderId) sp.set("orderId", params.orderId);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
  return request<any[]>(`/api/care-records?${sp}`);
}

// ─── Institutions ────────────────────────────
export async function fetchInstitutions(params?: {
  type?: string;
  province?: string;
  city?: string;
  search?: string;
  minRating?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.type && params.type !== "all") sp.set("type", params.type);
  if (params?.province) sp.set("province", params.province);
  if (params?.city) sp.set("city", params.city);
  if (params?.search) sp.set("search", params.search);
  if (params?.minRating) sp.set("minRating", String(params.minRating));
  return request<any[]>(`/api/institutions?${sp}`);
}

// ─── Sales Leads ─────────────────────────────
export async function fetchSalesLeads(params?: {
  status?: string;
  source?: string;
}) {
  const sp = new URLSearchParams();
  if (params?.status && params.status !== "all") sp.set("status", params.status);
  if (params?.source) sp.set("source", params.source);
  return request<any[]>(`/api/sales-leads?${sp}`);
}

// ─── Health Records ──────────────────────────
export async function fetchHealthRecords(id?: string) {
  const sp = new URLSearchParams();
  if (id) sp.set("id", id);
  return request<any>(`/api/health-records?${sp}`);
}

// ─── Policy Match ────────────────────────────
export async function matchPolicies(query: {
  region?: string;
  age?: number;
  careLevel?: string;
  disabilityLevel?: string;
  incomeLevel?: string;
  applicantType?: string;
}) {
  return request<any>("/api/policy-match", {
    method: "POST",
    body: JSON.stringify(query),
  });
}

// ─── Cases ───────────────────────────────────
export async function fetchCases(params?: {
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set("page", String(params.page));
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
  return request<any[]>(`/api/cases?${sp}`);
}

export async function fetchCase(id: string) {
  return request<any>(`/api/cases/${id}`);
}

export async function runOrchestrator(caseId: string) {
  return request<any>(`/api/cases/${caseId}/run-orchestrator`, {
    method: "POST",
  });
}

// ─── Dashboard Stats ─────────────────────────
export async function fetchDashboardStats() {
  return request<any>("/api/dashboard/stats");
}
