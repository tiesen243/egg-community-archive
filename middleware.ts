import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './server/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

export const config = {
  matcher: ['/search', '/following', '/create', '/settings/:path*', '/u/:path*'],
}
