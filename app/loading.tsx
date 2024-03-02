import { PostCardSkeleton } from '@/components/post/card'
import type { NextPage } from 'next'

const Loading: NextPage = () => (
  <main className="container max-w-screen-md flex-grow space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </main>
)

export default Loading
