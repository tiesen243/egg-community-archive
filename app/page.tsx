import { PostCard } from '@/components/post-card'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'
import { redirect } from 'next/navigation'

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
    return redirect('/auth/signin')
  }
}

export default Page
