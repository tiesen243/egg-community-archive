import CreatePost from '@/components/create-post'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import { auth, signOut } from '@/server/auth'
import type { NextPage } from 'next'
import { redirect } from 'next/navigation'
import UpdateDialog from './_update'

const Page: NextPage = async () => {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const userPosts = await api.post.getByUser.query()

  return (
    <main className="container grid flex-grow grid-cols-1 gap-4 md:grid-cols-12">
      <section className="space-y-4 md:col-span-5">
        <div className="flex items-center gap-2">
          <UserAvatar user={session.user} />
          <div>
            <p className="ml-2">{session.user.name}</p>
            <p className="ml-2">{session.user.email}</p>
          </div>
        </div>

        <blockquote>{session.user.bio}</blockquote>

        <CreatePost user={session.user} />

        <div className="flex items-center justify-center gap-4">
          <UpdateDialog user={session.user} />

          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <Button type="submit" variant="destructive">
              Sign out
            </Button>
          </form>
        </div>
      </section>

      <section className="space-y-4 md:col-span-7">
        <h2 className="text-xl font-bold">All your posts</h2>

        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  )
}

export default Page
