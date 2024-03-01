import type { NextPage } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { FormField } from '@/components/form-field'
import { PostCard } from '@/components/post-card'
import { Card } from '@/components/ui/card'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import { Button } from '@/components/ui/button'

interface Props {
  searchParams: { q: string }
}

const Page: NextPage<Props> = async ({ searchParams }) => {
  const users = await api.user.search.query(searchParams.q ?? '')
  const posts = await api.post.search.query(searchParams.q ?? '')
  const action = async (formData: FormData) => {
    'use server'
    const q = String(formData.get('q'))
    if (!q) return
    redirect(`/search?q=${q}`)
  }

  return (
    <main className="container max-w-screen-md flex-grow space-y-4">
      <form action={action} className="flex gap-4">
        <FormField name="q" placeholder="Search" className="w-full" />
        <Button type="submit" className="hidden md:block">
          Search
        </Button>
      </form>

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

      {users.length === 0 && posts.length === 0 && (
        <p className="text-center text-muted-foreground">No results found</p>
      )}
    </main>
  )
}

export default Page
