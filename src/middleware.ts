import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicPaths = [
  '/', '/login', '/register', '/pricing', '/products', '/contact',
  '/compliance', '/trust', '/privacy', '/terms', '/demo', '/docs', '/developers',
  '/login/forgot', '/verify-email',
  '/tools', '/templates', '/solutions', '/resources', '/city',
  '/policies', '/institutions', '/policy-match', '/agents',
  // P0 路由收敛：业务数据页（care-crm/care-orders/care-records/elders）从匿名白名单移除，统一走登录态
]

const isPublicPath = (pathname: string) => {
  return publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Debug header to confirm middleware is running
  const response = NextResponse.next()
  response.headers.set('x-mw-debug', `path=${pathname}`)

  // Allow public paths
  if (isPublicPath(pathname)) {
    return response
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return response
  }

  // Check auth for protected page routes (dashboard, etc.)
  // 生产经 nginx 反代，req.url 协议为 http，但会话 Cookie 实为 __Secure- 前缀；
  // 需按 X-Forwarded-Proto 显式指定 cookieName，否则 getToken 读不到会话。
  const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '')
  const secure = proto === 'https'
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: secure ? '__Secure-authjs.session-token' : 'authjs.session-token',
    secureCookie: secure,
  })

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Exclude /api, _next/static, _next/image, favicon.ico from middleware
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico).*)'],
}
