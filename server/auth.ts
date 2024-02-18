import NextAuth, { NextAuthConfig } from 'next-auth'

import Credential from 'next-auth/providers/credentials'

const authConfig = {
  providers: [
    Credential({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (_credentials) => {
        const user = { name: 'J Smith', email: 'dsads@dasdas.da' }
        if (user) {
          return Promise.resolve(user)
        } else {
          return Promise.resolve(null)
        }
      },
    }),
  ],
} satisfies NextAuthConfig

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig)
