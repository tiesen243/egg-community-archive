import bcrypt from 'bcryptjs'
import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth'
import 'next-auth/jwt'
import credentials from 'next-auth/providers/credentials'

import db from '@/prisma'
import type { User } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user']
  }
}

/* declare module 'next-auth/jwt' { */
/*   interface JWT { */
/*     user: User & DefaultSession['user'] */
/*   } */
/* } */

const authOptions = {
  providers: [
    credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) return null

        const user = await db.user.findUnique({ where: { email: String(credentials.email) } })
        if (!user) throw new Error('No user found')

        const isValid = bcrypt.compareSync(String(credentials.password), user.password)
        if (!isValid) throw new Error('Password is incorrect')

        return user
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.user = user as User

      /* if (token.user) token.user = (await db.user.findUnique({ where: { id: token.user.id } })) as User */

      return token
    },
    session: async ({ session, token }) => {
      if (token) session.user = token.user as any
      return session
    },
  },
} satisfies NextAuthConfig

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)
