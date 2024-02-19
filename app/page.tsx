'use client'

import { PostCard, PostCardSkeleton } from '@/components/post-card'
import { api } from '@/lib/trpc/client'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  const { data, isLoading } = api.post.getAll.useQuery()
  if (isLoading)
    return (
      <main className="container max-w-screen-md flex-grow space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </main>
    )

  return (
    <main className="container max-w-screen-md flex-grow space-y-4">
      {data?.map((post) => <PostCard key={post.id} post={post} />)}
    </main>
  )
}

export default Page
