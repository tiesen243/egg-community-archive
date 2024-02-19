import CommentPost from '@/components/comment-post'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  try {
    const postDetail = await api.post.getById.query({ id: params.id })
    if (!postDetail) throw new Error('Post not found')

    return (
      <main className="container max-w-screen-md flex-grow">
        <div className="flex items-center gap-2">
          <UserAvatar user={postDetail.author} />
          <div>
            <p>{postDetail.author.name}</p>
            <span className="text-muted-foreground">{postDetail.createdAt.toDateString()}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <article>{postDetail.content}</article>
        {postDetail.image && (
          <Image src={postDetail.image} alt={postDetail.id} width={1920} height={1080} className="mt-4 rounded" />
        )}

        <Separator className="my-4" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Comments</h2>

          <CommentPost postId={postDetail.id} />

          {postDetail.comments.map((comment) => (
            <Card key={comment.id}>
              <section className="flex gap-2 p-4">
                <UserAvatar user={comment.author} />
                <div>
                  <p>{comment.author.name}</p>
                  <CardDescription>{comment.createdAt.toDateString()}</CardDescription>
                </div>
              </section>

              <CardContent>{comment.content}</CardContent>
            </Card>
          ))}
        </section>
      </main>
    )
  } catch (e) {
    return notFound()
  }
}

export default Page
