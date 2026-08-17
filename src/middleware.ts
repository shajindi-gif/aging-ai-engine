import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicPaths = [
  '/', '/login', '/register', '/pricing', '/products', '/contact',
  '/compliance', '/trust', '/demo', '/docs', '/developers',
  '/tools', '/templates', '/solutions', '/resources', '/city',
  '/policies', '/institutions', '/care-crm', '/care-orders',
  '/care-records', '/policy-match', '/elders', '/agents',
]

const isPublicPath = (pathname: string) => {
  return publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow all API routes through — individual handlers manage their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check auth for protected page routes (dashboard, etc.)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
