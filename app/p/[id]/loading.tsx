import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { NextPage } from 'next'

const Loading: NextPage = () => {
  return (
    <main className="container max-w-screen-md flex-grow">
      <div className="flex items-center gap-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <Separator className="my-4" />

      <Skeleton className="h-44 w-full" />
    </main>
  )
}

export default Loading
