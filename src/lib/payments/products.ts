// 支付商品目录 — 服务端可信来源（前端不可传价格）
export interface PayProduct {
  id: string;
  name: string;
  amountFen: number;      // 金额:分
  featureKey: string;     // 支付成功后开通的权益
  durationDays: number;   // 权益有效期
  description: string;
  active: boolean;        // 是否开放在线购买
}

export const PAY_PRODUCTS: Record<string, PayProduct> = {
  // 当前开放在线购买的商品（支付宝）
  "pro-monthly": {
    id: "pro-monthly",
    name: "衍策银龄 AI · 专业版（1个月）",
    amountFen: 298000,          // ¥2,980.00
    featureKey: "silvercare.pro",
    durationDays: 30,
    description: "陪诊护理团队专业版服务一个月",
    active: true,
  },
  // 1 分钱真实联调商品（验证后可在支付宝/微信后台原路退款）
  "test-1fen": {
    id: "test-1fen",
    name: "支付联调测试（0.01 元）",
    amountFen: 1,
    featureKey: "silvercare.test",
    durationDays: 1,
    description: "支付链路联调用，请勿当作正式商品",
    active: true,
  },
  "team-monthly": {
    id: "team-monthly",
    name: "衍策银龄 AI · 小团队版（1个月）",
    amountFen: 98000,           // ¥980.00
    featureKey: "silvercare.team",
    durationDays: 30,
    description: "小团队版服务一个月",
    active: true,
  },
};

export function getProduct(id: string): PayProduct | null {
  return PAY_PRODUCTS[id] ?? null;
}
