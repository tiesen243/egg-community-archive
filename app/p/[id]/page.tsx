import type { Metadata, NextPage, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import CommentCard from '@/components/comment-card'
import CommentMenu from '@/components/comment-menu'
import CommentPost from '@/components/comment-post'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> => {
  const postDetail = await api.post.getById.query(params.id)
  if (!postDetail) return { title: 'Post not found' }
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: postDetail.author.name,
    description: postDetail.content,
    openGraph: {
      title: postDetail.author.name,
      description: postDetail.content,
      images: [...(postDetail.image ? [{ url: postDetail?.image }] : []), ...previousImages],
    },
    twitter: {
      title: postDetail.author.name,
      description: postDetail.content,
      images: [...(postDetail.image ? [{ url: postDetail?.image }] : []), ...previousImages],
    },
  }
}

const Page: NextPage<Props> = async ({ params }) => {
  try {
    const postDetail = await api.post.getById.query(params.id)
    if (!postDetail) throw new Error('Post not found')

    return (
      <main className="container max-w-screen-md flex-grow">
        <Link href={`/u/${postDetail.authorId}`} className="flex items-center gap-2">
          <UserAvatar user={postDetail.author} />
          <div>
            <p>{postDetail.author.name}</p>
            <span className="text-muted-foreground">{postDetail.createdAt.toDateString()}</span>
          </div>
        </Link>

        <Separator className="my-4" />

        <p>{postDetail.content}</p>

        {postDetail.image && (
          <Image src={postDetail.image} alt={postDetail.id} width={1920} height={1080} className="mt-4 rounded" />
        )}

        <Separator className="my-4" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Comments</h2>

          <CommentPost postId={postDetail.id} />

          <ul className="space-y-4">
            {postDetail.comments.map((comment) => (
              <li key={comment.id}>
                <CommentMenu comment={comment} />
                <CommentCard comment={comment} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    )
  } catch (e) {
    return notFound()
  }
}

export default Page
