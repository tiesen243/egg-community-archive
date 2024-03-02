import type { Metadata, NextPage } from 'next'

import Tab from './_tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Update your personal information and security settings',
}

const SettingsLayout: NextPage<React.PropsWithChildren> = async ({ children }) => (
  <main className="container max-w-screen-md flex-grow space-y-4">
    <Tab />
    {children}
    <Button variant="ghost" className="inline-flex w-full md:hidden">
      <Link href="/">Back to Home</Link>
    </Button>
  </main>
)

export default SettingsLayout
