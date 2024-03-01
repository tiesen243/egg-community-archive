import Image from 'next/image'

import { api } from '@/lib/trpc/server'
import type { Post, User } from '@prisma/client'
import { HeartIcon } from 'lucide-react'
import UserAvatar from './user-avatar'
import Link from 'next/link'

interface PostCardProps {
  post: Post & {
    author: User
    _count: { comments: number; likes: number }
    isLiked: boolean
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const likePost = async () => {
    'use server'
    await api.post.likes.mutate(post.id)
  }
  return (
    <div>
      <Link href={`/u/${post.author.id}`} className="flex flex-row items-center gap-2 space-y-0">
        <UserAvatar user={post.author} />
        <div>
          <p>{post.author.name}</p>
          <span className="text-muted-foreground">{post.createdAt.toDateString()}</span>
        </div>
      </Link>

      <div className="flex w-full flex-col">
        <div className="absolute left-4 h-full w-[1px] bg-muted" />
        <Link href={`/p/${post.id}`} className="p-4 pl-12">
          <p className="mb-4">{post.content}</p>

          {post.image && (
            <Image src={post.image} alt={post.id} width={500} height={200} className="h-auto w-full rounded" />
          )}
        </Link>

        <div className="ml-12 flex text-muted-foreground">
          <form action={likePost}>
            <button type="submit" className="flex gap-2">
              <HeartIcon className={post.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} />
              {post._count.likes}
            </button>
          </form>

          <span className="mx-2">•</span>

          <span>{post._count.comments} replies</span>
        </div>
      </div>
    </div>
  )
}
