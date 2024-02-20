import CreatePost from '@/components/create-post'
import { PostCard } from '@/components/post-card'
import PostMenu from '@/components/post-menu'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import { auth } from '@/server/auth'
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

        <UpdateDialog user={session.user} />
      </section>

      <section className="md:col-span-7">
        <h2 className="text-xl font-bold">All your posts</h2>

        <ul className="mt-4 space-y-4">
          {userPosts.map((post) => (
            <li key={post.id}>
              <PostMenu post={post} />
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Page
