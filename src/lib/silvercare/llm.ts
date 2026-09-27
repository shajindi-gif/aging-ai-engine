// ═══════════════════════════════════════════════
// LLM Provider Adapter — OpenAI 兼容接口
// 不写死供应商；未配置密钥时返回 null（上层降级为规则模式）
// 环境变量：LLM_API_KEY / LLM_BASE_URL / LLM_MODEL
// ═══════════════════════════════════════════════

export interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function getLlmConfig(): LlmConfig | null {
  const apiKey = process.env.LLM_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: (process.env.LLM_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, ""),
    model: process.env.LLM_MODEL?.trim() || "gpt-4o-mini",
  };
}

export async function llmChatJSON(
  messages: { role: "system" | "user"; content: string }[],
  opts?: { timeoutMs?: number }
): Promise<unknown | null> {
  const cfg = getLlmConfig();
  if (!cfg) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 30_000);
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return null;
    return JSON.parse(content);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
