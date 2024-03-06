import type { Metadata, NextPage, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CommentCard, CommentMenu, CommentPost } from '@/components/comment'
import MD from '@/components/md'
import { LikeBtn } from '@/components/post/like-btn'
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

  const title = `${postDetail.author.name} - ${postDetail.content.length > 20 ? postDetail.content.slice(0, 20) + '...' : postDetail.content}`

  return {
    title,
    description: postDetail.content,
    openGraph: {
      title,
      description: postDetail.content,
      images: [...(postDetail.image ? [{ url: postDetail?.image }] : []), ...previousImages],
    },
    twitter: {
      title,
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
      <>
        <main className="container max-w-screen-md flex-grow">
          <Link href={`/u/${postDetail.author.id}`} className="mb-4 flex items-center gap-2">
            <UserAvatar user={postDetail.author} />
            <div>
              <p>{postDetail.author.name}</p>
              <span className="text-muted-foreground">{postDetail.createdAt.toDateString()}</span>
            </div>
          </Link>

          <MD className="prose prose-zinc dark:prose-invert" text={postDetail.content} />

          {postDetail.image && (
            <Image src={postDetail.image} alt={postDetail.id} width={1920} height={1080} className="mt-4 rounded" />
          )}

          <div className="mt-4 flex text-muted-foreground">
            <LikeBtn post={postDetail} />
            <span className="mx-2">•</span>
            <span>{postDetail.comments.length} replies</span>
          </div>

          <Separator className="my-4" />

          <section className="space-y-4">
            <CommentPost postId={postDetail.id} authorName={postDetail.author.name} className="hidden md:flex" />

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

        <footer className="sticky bottom-0 left-0 z-50 block border-t bg-background/70 py-4 backdrop-blur-xl backdrop-saturate-150 md:hidden">
          <CommentPost postId={postDetail.id} authorName={postDetail.author.name} className="container" />
        </footer>
      </>
    )
  } catch (e) {
    return notFound()
  }
}

export default Page
