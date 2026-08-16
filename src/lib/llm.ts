import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
})

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o'

export interface LLMCallResult {
  content: string
  model: string
  tokens: { prompt: number; completion: number; total: number }
  latencyMs: number
}

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number
    maxTokens?: number
    jsonMode?: boolean
    model?: string
  }
): Promise<LLMCallResult> {
  const start = Date.now()
  const model = options?.model || MODEL

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.maxTokens ?? 4096,
      ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    })

    const content = response.choices[0]?.message?.content || ''
    const usage = response.usage

    return {
      content,
      model,
      tokens: {
        prompt: usage?.prompt_tokens || 0,
        completion: usage?.completion_tokens || 0,
        total: usage?.total_tokens || 0,
      },
      latencyMs: Date.now() - start,
    }
  } catch (error: any) {
    console.error(`LLM call failed: ${error.message}`)
    throw new Error(`LLM call failed: ${error.message}`)
  }
}

export async function callLLMStructured<T>(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; model?: string }
): Promise<{ data: T; result: LLMCallResult }> {
  const result = await callLLM(systemPrompt, userPrompt, {
    ...options,
    jsonMode: true,
  })

  try {
    const data = JSON.parse(result.content) as T
    return { data, result }
  } catch {
    throw new Error(`LLM returned invalid JSON: ${result.content.substring(0, 200)}`)
  }
}

export function isLLMConfigured(): boolean {
  return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-placeholder')
}
