'use client'

import { api } from '@/lib/trpc/client'
import { HeartIcon } from 'lucide-react'
import Link from 'next/link'

import { PostCardProps } from '@/components/post'
import { useRouter } from 'next/navigation'

export const LikeBtn: React.FC<PostCardProps> = ({ post, refetch }) => {
  const { refresh } = useRouter()
  const { mutate, isLoading } = api.post.likes.useMutation({
    onSuccess: () => {
      refetch?.()
      refresh()
    },
  })

  return (
    <button className="flex gap-2 disabled:cursor-not-allowed" onClick={() => mutate(post.id)} disabled={isLoading}>
      {isLoading ? (
        <HeartIcon className={`animate-pulse ${post.isLiked ? 'fill-red-500 text-red-500' : 'fill-muted'}`} />
      ) : (
        <HeartIcon
          className={post.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}
        />
      )}
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
