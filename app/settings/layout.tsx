import type { Metadata, NextPage } from 'next'

import Tab from './_tabs'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Update your personal information and security settings',
}

const SettingsLayout: NextPage<React.PropsWithChildren> = async ({ children }) => (
  <main className="container max-w-screen-md flex-grow">
    <Tab />
    {children}
  </main>
)

export default SettingsLayout
