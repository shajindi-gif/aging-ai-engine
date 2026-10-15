// 服务端会话守卫：校验 JWT 会话 + authVersion（支持"退出所有设备"即时失效）
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"

export async function requireFreshSession() {
  const session = await auth()
  const uid = (session?.user as any)?.id
  if (!uid || !session) return null
  const dbUser = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, email: true, phone: true, name: true, nickname: true, avatarUrl: true, role: true, authVersion: true, emailVerified: true, lastLoginAt: true, createdAt: true },
  })
  if (!dbUser) return null
  if (dbUser.authVersion !== ((session.user as any).av ?? 0)) return null // 会话已被撤销
  return { session, user: dbUser }
}

/** 同源校验（配合 SameSite Cookie 的额外 CSRF 防线） */
export function sameOriginOk(req: Request): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return true // 无 Origin 的表单/服务端调用交给 SameSite
  try { return new URL(origin).host === new URL(req.url).host } catch { return false }
}
