import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'
import Link from 'next/link'

interface Props {
  searchParams: { q: string }
}

const Page: NextPage<Props> = async ({ searchParams }) => {
  try {
    const users = await api.user.search.query(searchParams.q)
    const posts = await api.post.search.query(searchParams.q)
    if (users.length === 0 && posts.length === 0) throw new Error('No results found')

    return (
      <main className="container max-w-screen-md flex-grow space-y-4">
        {users.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Users</h2>
            {users.map((user) => (
              <Card
                key={user.id}
                className="cursor-pointer bg-secondary/10 shadow-lg transition-all ease-linear hover:bg-secondary"
              >
                <Link href={`/u/${user.id}`} className="flex items-center gap-4 p-6">
                  <UserAvatar user={user} />
                  {user.name}
                </Link>
              </Card>
            ))}
          </section>
        )}

        {posts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Posts</h2>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </main>
    )
  } catch (e: any) {
    return (
      <main className="container flex min-h-[80dvh] max-w-screen-md flex-grow flex-col items-center justify-center gap-4">
        <p className="text-4xl font-bold">{e.message}</p>
        <Button asChild>
          <Link href="/">Go back</Link>
        </Button>
      </main>
    )
  }
}

export default Page
