import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const user = req.auth?.user

  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url))
    if (user.role !== 'ADMIN') return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/seeker')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/poster')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.url))
    if (user.role === 'SEEKER') return NextResponse.redirect(new URL('/seeker/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/seeker/:path*', '/poster/:path*'],
}
