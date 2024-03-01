import type { Post, User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

import UserAvatar from '@/components/user-avatar'
import { Card } from '../ui/card'
import LikeBtn from './like-btn'

export interface PostCardProps {
  post: Post & {
    author: User
    _count: { comments: number; likes: number }
    isLiked?: boolean
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => (
  <Card className="group border-none">
    <Link href={`/u/${post.author.id}`} className="flex flex-row items-center gap-2 space-y-0">
      <UserAvatar user={post.author} className="ring-2 ring-muted transition-colors group-hover:ring-ring" />
      <div>
        <p>{post.author.name}</p>
        <span className="text-muted-foreground">{post.createdAt.toDateString()}</span>
      </div>
    </Link>

    <div className="flex w-full flex-col">
      <div className="absolute left-4 h-full w-[1px] bg-muted transition-colors group-hover:bg-ring" />
      <Link href={`/p/${post.id}`} className="p-4 pl-12">
        <p className="mb-4">{post.content}</p>

        {post.image && (
          <Image src={post.image} alt={post.id} width={500} height={200} className="h-auto w-full rounded" />
        )}
      </Link>

      <div className="ml-12 flex text-muted-foreground">
        <LikeBtn post={post} />

        <span className="mx-2">•</span>

        <span>{post._count.comments} replies</span>
      </div>
    </div>
  </Card>
)

export const PublicPostCard: React.FC<PostCardProps> = ({ post }) => (
  <Card className="border-none">
    <section className="flex flex-row items-center gap-2 space-y-0">
      <UserAvatar user={post.author} />
      <div>
        <p>{post.author.name}</p>
        <span className="text-muted-foreground">{post.createdAt.toDateString()}</span>
      </div>
    </section>

    <div className="flex w-full flex-col">
      <div className="absolute left-4 h-full w-[1px] bg-muted" />
      <div className="p-4 pl-12">
        <p className="mb-4">{post.content}</p>

        {post.image && (
          <Image src={post.image} alt={post.id} width={500} height={200} className="h-auto w-full rounded" />
        )}
      </div>

      <div className="ml-12 flex text-muted-foreground">
        <span>{post._count.likes} likes</span>

        <span className="mx-2">•</span>

        <span>{post._count.comments} replies</span>
      </div>
    </div>
  </Card>
)
