import type { NextPage } from 'next'

import { Skeleton } from '@/components/ui/skeleton'

const Page: NextPage = () => (
  <main className="container max-w-screen-md flex-grow space-y-4">
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </main>
)

export default Page
