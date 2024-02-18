import CommentPost from '@/components/comment-post'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/user-avatar'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  const postDetail = await api.post.getById.query({ id: params.id })
  if (!postDetail) return notFound()

  return (
    <main className="container flex-grow">
      <div className="flex items-center gap-2">
        <UserAvatar user={postDetail.author} />
        <div>
          <p>{postDetail.author.name}</p>
          <span className="text-muted-foreground">{postDetail.createdAt.toDateString()}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <article>{postDetail.content}</article>

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
}

export default Page
