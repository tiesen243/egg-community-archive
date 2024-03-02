'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Tab: React.FC = () => {
  const pathName = usePathname()
  const activeTab = pathName.split('/').pop() === 'security' ? 'security' : 'info'

  return (
    <Tabs defaultValue={activeTab} className="mb-4 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info" asChild>
          <Link href="/settings">Infomation</Link>
        </TabsTrigger>

        <TabsTrigger value="security" asChild>
          <Link href="/settings/security">Security</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default Tab
