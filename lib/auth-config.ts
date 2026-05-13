import type { NextAuthConfig } from 'next-auth'

// Minimal auth config for Edge runtime (middleware) — no Prisma adapter
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user
      const pathname = nextUrl.pathname

      if (pathname.startsWith('/admin')) {
        return user?.role === 'ADMIN'
      }
      if (pathname.startsWith('/seeker') || pathname.startsWith('/poster')) {
        return !!user
      }
      return true
    },
  },
  providers: [],
}
