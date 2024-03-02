import { PostCard, PublicPostCard } from '@/components/post'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
const Page: NextPage = async () => {
  try {
    const posts = await api.post.getAll.query()

    return (
      <main className="container max-w-screen-md flex-grow space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
    )
  } catch (e) {
    const posts = await api.post.getPublicContent.query()
    return (
      <main className="container max-w-screen-md flex-grow space-y-4">
        <p className="text-center text-2xl font-bold">
          <Link href="/auth/signin" className="text-blue-500 underline-offset-4 hover:underline">
            Login here
          </Link>{' '}
          to unlock more content and features
        </p>
        {posts.map((post) => (
          <PublicPostCard key={post.id} post={post} />
        ))}
      </main>
    )
  }
}

export default Page
