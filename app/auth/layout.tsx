import { Card } from '@/components/ui/card'
import type { NextPage, Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication for the application',
}
const AuthLayout: NextPage<React.PropsWithChildren> = ({ children }) => (
  <main className="container grid min-h-[90dvh] flex-grow place-items-center">
    <Card className="w-full border-none md:w-2/3 lg:w-1/2">{children}</Card>
  </main>
)

export default AuthLayout
