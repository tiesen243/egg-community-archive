import { PostCardSkeleton } from '@/components/post/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { NextPage } from 'next'

const Loading: NextPage = () => {
  return (
    <main className="container flex max-w-screen-md flex-grow flex-col gap-4">
      <section className="flex items-center justify-between">
        <div className="flex-grow space-y-3">
          <Skeleton className="h-8 w-1/2" />

          <Skeleton className="h-6 w-2/3" />

          <Skeleton className="h-6 w-3/4" />

          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="size-24 rounded-full" />
      </section>

      <Skeleton className="h-10 w-full" />

      <ul className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </ul>
    </main>
  )
}

export default Loading
