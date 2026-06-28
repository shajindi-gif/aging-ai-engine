// ═══════════════════════════════════════════════
// 衍策银龄 AI SDK — 错误类
// ═══════════════════════════════════════════════

/** SDK 基础错误类 */
export class AgingAIError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AgingAIError";
    this.statusCode = statusCode;
    this.details = details;
    // 修复 prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 认证/授权错误 */
export class AuthenticationError extends AgingAIError {
  constructor(message = "认证失败,请检查 API 密钥是否有效") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

/** 请求频率限制错误 */
export class RateLimitError extends AgingAIError {
  public readonly retryAfter: number;

  constructor(message = "请求过于频繁,请稍后重试", retryAfter = 60) {
    super(message, 429);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

/** 请求参数验证错误 */
export class ValidationError extends AgingAIError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 400);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

/** 从 HTTP 响应创建对应的错误实例 */
export function createErrorFromResponse(status: number, body: { error?: string; message?: string }): AgingAIError {
  const message = body.error || body.message || "未知错误";

  switch (status) {
    case 401:
      return new AuthenticationError(message);
    case 429:
      return new RateLimitError(message);
    case 400:
      return new ValidationError(message);
    default:
      return new AgingAIError(message, status);
  }
}
