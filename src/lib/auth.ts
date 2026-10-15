import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { findUserByIdentifier, ensureIdentity, logAuth, verifyPassword } from '@/lib/authz/identity'
import { verifyCode } from '@/lib/authz/codes'
import { normalizeEmail, normalizePhone } from '@/lib/authz/identifiers'

function reqHeader(req: any, name: string): string | null {
  try { return req?.headers?.get?.(name) ?? null } catch { return null }
}

async function touchLogin(userId: string) {
  try { await prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } }) } catch { /* ignore */ }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 3600 },
  pages: { signIn: '/login' },
  providers: [
    // ① 邮箱/手机号 + 密码（兼容历史邮箱用户，新增手机号+密码登录）
    Credentials({
      id: 'password',
      name: '密码登录',
      credentials: {
        identifier: { label: '邮箱或手机号', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const c = (credentials || {}) as Record<string, unknown>
        const identifier = String(c.identifier || c.email || '')
        const password = String(c.password || '')
        if (!identifier || !password) return null

        const ip = reqHeader(req, 'x-forwarded-for')?.split(',')[0]?.trim() || null
        const ua = reqHeader(req, 'user-agent')
        const user = await findUserByIdentifier(identifier)
        // 统一失败响应：不区分「无此账户」与「密码错误」（防账户枚举）
        if (!user) {
          await logAuth({ event: 'login_failed', ip, ua, success: false, meta: { via: 'password', reason: 'no_user' } })
          return null
        }
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        const ok = await verifyPassword(password, dbUser?.passwordHash)
        if (!ok) {
          await logAuth({ event: 'login_failed', userId: user.id, ip, ua, success: false, meta: { via: 'password', reason: 'bad_pwd' } })
          return null
        }

        await touchLogin(user.id)
        await ensureIdentity(user.id, identifier, false) // 密码登录不视为邮箱/手机号已验证
        await logAuth({ event: 'login_success', userId: user.id, ip, meta: { via: 'password' } })
        return { id: user.id, email: user.email, name: user.name, role: user.role, authVersion: user.authVersion } as any
      },
    }),
    // ② 手机号/邮箱 + 验证码（手机号未注册即验即注册 = 低摩擦；邮箱需已有账户）
    Credentials({
      id: 'code',
      name: '验证码登录',
      credentials: {
        identifier: { label: '手机号或邮箱', type: 'text' },
        code: { label: '验证码', type: 'text' },
      },
      async authorize(credentials, req) {
        const c = (credentials || {}) as Record<string, unknown>
        const identifier = String(c.identifier || '')
        const code = String(c.code || '')
        if (!identifier || !/^\d{6}$/.test(code)) return null

        const email = normalizeEmail(identifier)
        const phone = email ? null : normalizePhone(identifier)
        const target = email || phone
        if (!target) return null

        const ip = reqHeader(req, 'x-forwarded-for')?.split(',')[0]?.trim() || null
        const r = await verifyCode({ purpose: 'login', identifier: target, code })
        if (r !== 'ok') {
          await logAuth({ event: 'login_failed', ip, success: false, meta: { via: 'code', reason: r } })
          return null
        }

        let user = await findUserByIdentifier(target)
        if (!user && phone) {
          const created = await prisma.user.create({ data: { phone, role: 'FAMILY' } })
          await ensureIdentity(created.id, phone, true)
          await logAuth({ event: 'register', userId: created.id, ip, meta: { via: 'phone_code' } })
          user = { id: created.id, email: null, phone, name: null, role: created.role, authVersion: created.authVersion }
        }
        if (!user) {
          await logAuth({ event: 'login_failed', ip, success: false, meta: { via: 'code', reason: 'no_account' } })
          return null
        }

        await ensureIdentity(user.id, target, true)
        await touchLogin(user.id)
        await logAuth({ event: 'login_success', userId: user.id, ip, meta: { via: 'code' } })
        return { id: user.id, email: user.email, name: user.name, role: user.role, authVersion: user.authVersion } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.av = (user as any).authVersion ?? 0
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role
        ;(session.user as any).av = (token.av as number) ?? 0
      }
      return session
    },
  },
})
