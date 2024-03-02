import { Skeleton } from '@/components/ui/skeleton'
import type { NextPage } from 'next'

const Loading: NextPage = async () => (
  <main className="container max-w-screen-md flex-grow space-y-4">
    <Skeleton className="h-10 w-1/2" />

    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton key={i} className="h-20 w-full" />
    ))}
  </main>
)

export default Loading
