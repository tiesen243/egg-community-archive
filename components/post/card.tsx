import type { Post, User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

import UserAvatar from '@/components/user-avatar'
import { Card } from '../ui/card'
import LikeBtn from './like-btn'
import { Skeleton } from '../ui/skeleton'

export interface PostCardProps {
  post: Post & {
    author: User
    _count: { comments: number; likes: number }
    isLiked?: boolean
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => (
  <Card className="group border-none">
    <Link href={`/u/${post.author.id}`} className="z-10 flex flex-row items-center gap-2">
      <UserAvatar user={post.author} className="ring-2 ring-muted transition-colors group-hover:ring-ring" />
      <div>
        <p>{post.author.name}</p>
        <span className="text-muted-foreground">{post.createdAt.toDateString()}</span>
      </div>
    </Link>

    <div className="absolute left-5 h-full w-[1px] bg-muted transition-colors group-hover:bg-ring" />

    <div className="flex w-full flex-col">
      <Link href={`/p/${post.id}`} className="p-4 pl-12">
        <p>{post.content}</p>

        {post.image && (
          <Image src={post.image} alt={post.id} width={500} height={200} className="mt-4 h-auto w-full rounded" />
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
  <Card className="group cursor-pointer border-none">
    <section className="z-10 flex flex-row items-center gap-2">
      <UserAvatar user={post.author} className="ring-2 ring-muted transition-colors group-hover:ring-ring" />
      <div>
        <p>{post.author.name}</p>
        <span className="text-muted-foreground">{post.createdAt.toDateString()}</span>
      </div>
    </section>

    <div className="absolute left-5 h-full w-[1px] bg-muted transition-colors group-hover:bg-ring" />

    <div className="flex w-full flex-col">
      <div className="p-4 pl-12">
        <p>{post.content}</p>

        {post.image && (
          <Image src={post.image} alt={post.id} width={500} height={200} className="mt-4 h-auto w-full rounded" />
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

export const PostCardSkeleton: React.FC = () => (
  <Card className="border-none">
    <section className="z-10 flex flex-row items-center gap-2">
      <Skeleton className="size-10 rounded-full ring-2 ring-muted" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
    </section>

    <div className="absolute left-5 h-full w-[1px] bg-muted" />

    <div className="flex w-full flex-col">
      <div className="p-4 pl-12">
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="ml-12">
        <Skeleton className="h-6 w-36" />
      </div>
    </div>
  </Card>
)
