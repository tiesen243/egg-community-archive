import type { Comment, User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

import { CommentCard, CommentMenu, CommentPost } from '@/components/comment'
import MD from '@/components/md'
import { FakeLikeBtn, LikeBtn } from '@/components/post/like-btn'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/user-avatar'

interface IComment extends Comment {
  author: User
}
interface Props {
  postDetail: {
    id: string
    content: string
    image: string | null
    author: User
    likes: number
    isLiked?: boolean
    replies: number
    createdAt: Date
    comments: IComment[]
  }
  isAuth: boolean
}

const PostDetail: React.FC<Props> = ({ postDetail, isAuth }) => (
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
        {isAuth ? <LikeBtn post={postDetail} /> : <FakeLikeBtn post={postDetail} />}
        <span className="mx-2">•</span>
        <span>{postDetail.comments.length} replies</span>
      </div>

      <Separator className="my-4" />

      <section className="space-y-4">
        {isAuth ? (
          <CommentPost postId={postDetail.id} authorName={postDetail.author.name} className="hidden md:flex" />
        ) : (
          <p className="text-center text-muted-foreground">
            <Link href="/auth/signin" className="underline-offset-4 hover:underline">
              Sign in
            </Link>
            &nbsp;to comment on this post
          </p>
        )}

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

    {isAuth && (
      <footer className="sticky bottom-0 left-0 z-50 block border-t bg-background/70 py-4 backdrop-blur-xl backdrop-saturate-150 md:hidden">
        <CommentPost postId={postDetail.id} authorName={postDetail.author.name} className="container" />
      </footer>
    )}
  </>
)

export default PostDetail
