'use client'

import TRPCProvider from '@/lib/trpc/client'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

const Provider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <TRPCProvider>
    <SessionProvider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </SessionProvider>
  </TRPCProvider>
)

export default Provider
