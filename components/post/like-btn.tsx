'use client'

import { HeartIcon } from 'lucide-react'
import { PostCardProps } from './card'
import { api } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const LikeBtn: React.FC<PostCardProps> = ({ post }) => {
  const { refresh } = useRouter()
  const { mutate } = api.post.likes.useMutation({
    onSuccess: () => {
      refresh()
    },
  })
  return (
    <button className="flex gap-2" onClick={() => mutate(post.id)}>
      <HeartIcon className={post.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'} />
      {post.likes} {post.likes === 1 ? 'like' : 'likes'}
    </button>
  )
}

export const FakeLikeBtn: React.FC<PostCardProps> = ({ post }) => (
  <Link href="/auth/signin">
    <button className="flex gap-2">
      <HeartIcon className="text-muted-foreground hover:text-red-500" />
      {post.likes} {post.likes === 1 ? 'like' : 'likes'}
    </button>
  </Link>
)
