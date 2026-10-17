// 验证码与通知的发送渠道适配器
// 邮件：Resend 兼容 API（RESEND_API_KEY）；开发环境落 .outbox 文件；生产未配置直接失败（绝不静默 mock）
// 短信：SMS_PROVIDER = aliyun | tencent | mock（mock 仅非生产可用）
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { maskIdentifier } from "./identifiers";

const IS_PROD = process.env.NODE_ENV === "production" && process.env.AUTH_DEV_OUTBOX !== "1";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://yanglaoai999.com";
const BRAND = "衍策银龄";

function outboxWrite(kind: string, to: string, subject: string, body: string) {
  try {
    const dir = path.join(process.cwd(), ".outbox");
    fs.mkdirSync(dir, { recursive: true });
    const name = `${Date.now()}-${kind}-${crypto.randomBytes(3).toString("hex")}.txt`;
    fs.writeFileSync(path.join(dir, name), `To: ${to}\nSubject: ${subject}\n\n${body}\n`);
  } catch { /* 忽略写盘失败 */ }
}

const PURPOSE_TEXT: Record<string, string> = {
  login: "登录验证码",
  email_verify: "邮箱验证",
  phone_verify: "手机号验证",
  password_reset: "重置密码",
};

// ── 邮件 ────────────────────────────────────────
// 优先级：SMTP（腾讯云 Sendify 等）> Resend API > 开发 outbox
// SMTP 环境变量：SMTP_HOST(默认 smtp.qcloudmail.com) SMTP_PORT(465) SMTP_USER SMTP_PASS [MAIL_FROM]

function smtpConfigured(): boolean {
  return !!(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

async function sendEmailSmtp(to: string, subject: string, text: string, html: string): Promise<void> {
  const { createTransport } = await import("nodemailer");
  const host = process.env.SMTP_HOST?.trim() || "smtp.qcloudmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER!.trim();
  const from = process.env.MAIL_FROM?.trim() || user;
  const transporter = createTransport({
    host, port, secure: port === 465,
    auth: { user, pass: process.env.SMTP_PASS!.trim() },
    pool: true, maxConnections: 2,
    tls: { servername: host },
  });
  const info = await transporter.sendMail({ from: `${BRAND} <${from}>`, to, subject, text, html });
  if (info.response && /5\d\d|4\d\d/.test(String(info.response))) {
    throw new Error("smtp_rejected:" + String(info.response).slice(0, 100));
  }
}

export async function sendEmail(opts: {
  to: string;
  purpose: string;
  code?: string;
  subject?: string;
  body?: string;
}): Promise<void> {
  const subject = opts.subject || `${BRAND} · ${PURPOSE_TEXT[opts.purpose] || "通知"}`;
  const body = opts.body
    || `您的验证码是：${opts.code}\n\n有效期 5 分钟，请勿泄露给他人。\n如非本人操作，请忽略本邮件。\n\n— ${BRAND}（${SITE.replace(/^https?:\/\//, "")}）`;

  const html = `<div style="font-family:-apple-system,'PingFang SC',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#2b2926">
  <div style="font-size:15px;font-weight:700;color:#1d6f67;margin-bottom:20px">${BRAND}</div>
  <p style="font-size:14px;line-height:1.7">${subject.replace(/ · .*/, " · ")}</p>
  ${opts.code ? `<div style="font-size:34px;font-weight:700;letter-spacing:8px;color:#1d6f67;background:#f2f7f6;border-radius:10px;padding:16px;text-align:center;margin:20px 0">${opts.code}</div>
  <p style="font-size:13px;color:#78716c">有效期 5 分钟，请勿泄露给他人。如非本人操作，请忽略本邮件。</p>` : `<p style="font-size:14px;line-height:1.7">${body.split("\n")[0]}</p>`}
  <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e7e2da;font-size:12px;color:#a8a196">${BRAND} · 上海衍策引擎人工智能科技有限公司 · <a href="${SITE}" style="color:#78716c">${SITE.replace(/^https?:\/\//, "")}</a></div>
</div>`;

  if (smtpConfigured()) {
    try {
      await sendEmailSmtp(opts.to, subject, body, html);
      return;
    } catch (e: any) {
      console.error(`[email:smtp] failed host=${process.env.SMTP_HOST || "smtp.qcloudmail.com"} to=${maskIdentifier(opts.to)} err=${String(e?.message || e).slice(0, 120)}`);
      throw new Error("email_send_failed:" + String(e?.message || e).slice(0, 120));
    }
  }

  const key = process.env.RESEND_API_KEY?.trim();
  if (key) {
    const from = process.env.RESEND_FROM || `${BRAND} <noreply@yanglaoai999.com>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject,
        text: body,
        html: `<div style="font-family:-apple-system,'PingFang SC',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#2b2926">
  <div style="font-size:15px;font-weight:700;color:#1d6f67;margin-bottom:20px">${BRAND}</div>
  <p style="font-size:14px;line-height:1.7">${subject.replace(/ · .*/, " · ")}</p>
  ${opts.code ? `<div style="font-size:34px;font-weight:700;letter-spacing:8px;color:#1d6f67;background:#f2f7f6;border-radius:10px;padding:16px;text-align:center;margin:20px 0">${opts.code}</div>
  <p style="font-size:13px;color:#78716c">有效期 5 分钟，请勿泄露给他人。如非本人操作，请忽略本邮件。</p>` : `<p style="font-size:14px;line-height:1.7">${body.split("\n")[0]}</p>`}
  <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e7e2da;font-size:12px;color:#a8a196">${BRAND} · 上海衍策引擎人工智能科技有限公司 · <a href="${SITE}" style="color:#78716c">${SITE.replace(/^https?:\/\//, "")}</a></div>
</div>`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`[email] send failed status=${res.status} to=${maskIdentifier(opts.to)}`); // 不记录正文/收件人明文
      throw new Error("email_send_failed:" + t.slice(0, 120));
    }
    return;
  }

  if (!IS_PROD) {
    outboxWrite("email", opts.to, subject, body);
    console.log(`[email:dev] → ${maskIdentifier(opts.to)} code=${opts.code ?? "-"}（写入 .outbox/）`);
    return;
  }
  throw new Error("email_channel_unavailable");
}

// ── 短信 ────────────────────────────────────────

function pct(s: string): string {
  return encodeURIComponent(s).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
}

async function sendSmsAliyun(phone: string, code: string): Promise<void> {
  const ak = process.env.ALIYUN_SMS_ACCESS_KEY_ID;
  const sk = process.env.ALIYUN_SMS_ACCESS_KEY_SECRET;
  const signName = process.env.ALIYUN_SMS_SIGN_NAME;
  const tpl = process.env.ALIYUN_SMS_TEMPLATE_CODE;
  if (!ak || !sk || !signName || !tpl) throw new Error("sms_channel_unavailable");

  const params: Record<string, string> = {
    AccessKeyId: ak, Action: "SendSms", Format: "JSON", RegionId: process.env.ALIYUN_SMS_REGION || "cn-hangzhou",
    PhoneNumbers: phone.replace(/^\+86/, ""), SignName: signName, TemplateCode: tpl,
    TemplateParam: JSON.stringify({ code }),
    SignatureMethod: "HMAC-SHA1", SignatureNonce: crypto.randomUUID(), SignatureVersion: "1.0",
    Timestamp: new Date().toISOString().replace(/\.\d+Z$/, "Z"), Version: "2017-05-25",
  };
  const qs = Object.keys(params).sort().map((k) => `${pct(k)}=${pct(params[k])}`).join("&");
  const strToSign = `GET&${pct("/")}&${pct(qs)}`;
  const sig = crypto.createHmac("sha1", sk + "&").update(strToSign).digest("base64");
  const res = await fetch(`https://dysmsapi.aliyuncs.com/?${qs}&Signature=${pct(sig)}`, { signal: AbortSignal.timeout(15_000) });
  const j = await res.json().catch(() => ({}));
  if (j.Code !== "OK") {
    console.error(`[sms:aliyun] failed code=${j.Code} msg=${j.Message} to=${maskIdentifier(phone)}`);
    throw new Error("sms_send_failed:" + (j.Code || "unknown"));
  }
}

async function sendSmsTencent(phone: string, code: string): Promise<void> {
  const sid = process.env.TENCENT_SMS_SECRET_ID;
  const sk = process.env.TENCENT_SMS_SECRET_KEY;
  const appId = process.env.TENCENT_SMS_SDK_APP_ID;
  const sign = process.env.TENCENT_SMS_SIGN_NAME;
  const tpl = process.env.TENCENT_SMS_TEMPLATE_ID;
  if (!sid || !sk || !appId || !sign || !tpl) throw new Error("sms_channel_unavailable");

  const payload = JSON.stringify({
    PhoneNumberSet: [phone.startsWith("+86") ? phone : "+" + phone],
    SmsSdkAppId: appId, SignName: sign, TemplateId: tpl,
    TemplateParamSet: [code],
  });
  const host = "sms.tencentcloudapi.com", service = "sms", action = "SendSms", version = "2021-01-11";
  const ts = Math.floor(Date.now() / 1000);
  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\n`;
  const signedHeaders = "content-type;host";
  const hashedPayload = crypto.createHash("sha256").update(payload).digest("hex");
  const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;
  const date = new Date(ts * 1000).toISOString().slice(0, 10);
  const credentialScope = `${date}/${service}/tc3_request`;
  const stringToSign = `TC3-HMAC-SHA256\n${ts}\n${credentialScope}\n` + crypto.createHash("sha256").update(canonicalRequest).digest("hex");
  const hmac = (k: crypto.BinaryLike | Buffer, d: string) => crypto.createHmac("sha256", k).update(d).digest();
  const secretDate = hmac("TC3" + sk, date);
  const secretService = hmac(secretDate, service);
  const secretSigning = hmac(secretService, "tc3_request");
  const signature = crypto.createHmac("sha256", secretSigning).update(stringToSign).digest("hex");
  const authorization = `TC3-HMAC-SHA256 Credential=${sid}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${host}`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8", Host: host, Authorization: authorization, "X-TC-Action": action, "X-TC-Version": version, "X-TC-Timestamp": String(ts), "X-TC-Region": process.env.TENCENT_SMS_REGION || "ap-guangzhou" },
    body: payload,
    signal: AbortSignal.timeout(15_000),
  });
  const j = await res.json().catch(() => ({}));
  const err = j?.Response?.Error;
  if (err) {
    console.error(`[sms:tencent] failed code=${err.Code} to=${maskIdentifier(phone)}`);
    throw new Error("sms_send_failed:" + err.Code);
  }
}

export async function sendSms(phone: string, purpose: string, code: string): Promise<void> {
  const provider = (process.env.SMS_PROVIDER || "mock").toLowerCase();
  if (provider === "aliyun") return sendSmsAliyun(phone, code);
  if (provider === "tencent") return sendSmsTencent(phone, code);
  // mock：仅非生产
  if (!IS_PROD) {
    outboxWrite("sms", phone, `短信验证码（${PURPOSE_TEXT[purpose] || purpose}）`, `验证码：${code}，5 分钟内有效。`);
    console.log(`[sms:mock] → ${maskIdentifier(phone)} code=${code}（写入 .outbox/）`);
    return;
  }
  throw new Error("sms_channel_unavailable");
}
