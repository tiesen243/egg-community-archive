import type { Metadata, NextPage, ResolvingMetadata } from 'next'

import { PostMenu } from '@/components/post'
import { PostCard } from '@/components/post/card'
import { buttonVariants } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import { auth } from '@/server/auth'
import Link from 'next/link'
import FollowBtn from './_follow-btn'

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> => {
  const user = await api.user.getById.query(params.id)
  if (!user) return { title: 'Post not found' }
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: user.name,
    description: user.bio,
    openGraph: {
      title: user.name,
      description: user.bio ?? '',
      images: [...(user.image ? [{ url: user.image }] : []), ...previousImages],
    },
    twitter: {
      title: user.name,
      description: user.bio ?? '',
      images: [...(user.image ? [{ url: user.image }] : []), ...previousImages],
    },
  }
}

const Page: NextPage<Props> = async ({ params }) => {
  const session = await auth()
  const user = await api.user.getById.query(params.id)
  const userPosts = await api.post.getByUser.query(params.id)

  return (
    <main className="container flex max-w-screen-md flex-grow flex-col gap-4">
      <section className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-4xl font-bold">{user.name}</p>
          <p className="text-muted-foreground">Joined at {new Date(user.createdAt).toDateString()}</p>

          {user.bio && <p className="text-lg">{user.bio}</p>}

          <p className="text-muted-foreground">
            {user._count.posts} {user._count.posts === 1 ? 'post' : 'posts'}
            <span className="mx-2">•</span>
            <Link href={`/u/${user.id}/followers`}>
              {user._count.followers} {user._count.followers === 1 ? 'follower' : 'followers'}
            </Link>
            <span className="mx-2">•</span>
            <Link href={`/u/${user.id}/followings`}>
              {user._count.following} {user._count.following === 1 ? 'following' : 'followings'}
            </Link>
          </p>
        </div>
        <UserAvatar user={user} className="size-24" />
      </section>

      {user.id !== session?.user?.id ? (
        <FollowBtn user={user} />
      ) : (
        <Link href="/settings" className={buttonVariants()}>
          Edit profile
        </Link>
      )}

      <ul className="space-y-4">
        {userPosts.map((post) => (
          <li key={post.id}>
            {session?.user?.id === user.id && <PostMenu post={post} />}
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Page
