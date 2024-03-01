import type { Metadata, NextPage } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/server/auth'
import Tab from './_tabs'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Update your personal information and security settings',
}

const SettingsLayout: NextPage<React.PropsWithChildren> = async ({ children }) => {
  const session = await auth()
  if (!session || !session.user) redirect('/auth/signin')
  return (
    <main className="container max-w-screen-md flex-grow">
      <Tab />
      {children}
    </main>
  )
}

export default SettingsLayout
