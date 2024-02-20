import CreatePost from '@/components/create-post'
import { PostCard } from '@/components/post-card'
import PostMenu from '@/components/post-menu'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'
import UpdateDialog from './_update'
import { auth } from '@/server/auth'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  const session = await auth()
  const user = await api.user.getById.query(params.id)
  const userPosts = await api.post.getByUser.query(params.id)

  return (
    <main className="container grid flex-grow grid-cols-1 gap-4 md:grid-cols-12">
      <section className="space-y-4 md:col-span-5">
        <div className="flex items-center gap-2">
          <UserAvatar user={user} />
          <div>
            <p className="ml-2">{user.name}</p>
            <p className="ml-2">{user.email}</p>
          </div>
        </div>

        <blockquote>{user.bio}</blockquote>

        {session?.user?.id === user.id && (
          <>
            <CreatePost user={user} />

            <UpdateDialog user={user} />
          </>
        )}
      </section>

      <section className="md:col-span-7">
        <h2 className="text-xl font-bold">All your posts</h2>

        <ul className="mt-4 space-y-4">
          {userPosts.map((post) => (
            <li key={post.id}>
              {session?.user?.id === user.id && <PostMenu post={post} />}
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Page
