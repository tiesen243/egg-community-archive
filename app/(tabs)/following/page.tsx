import { PostCard } from '@/components/post'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'

export const dynamic = 'force-dynamic'
const Page: NextPage = async () => {
  const posts = await api.post.getByFollowing.query()

  return (
    <main className="container max-w-screen-md flex-grow space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  )
}

export default Page
