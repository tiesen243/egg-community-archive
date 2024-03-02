import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const cookies = request.cookies
  const sessionToken =
    process.env.VERCEL_ENV === 'production'
      ? cookies.get('__Secure-authjs.session-token')
      : cookies.get('authjs.session-token')

  if (!sessionToken) return NextResponse.redirect(new URL('/auth/signin', request.url))
}

export const config = {
  matcher: ['/search', '/following', '/create', '/settings/:path*', '/u/:path*'],
}
