'use client'

import { HeartIcon } from 'lucide-react'
import { PostCardProps } from './card'
import { api } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'

const LikeBtn: React.FC<PostCardProps> = ({ post }) => {
  const { refresh } = useRouter()
  const { mutate } = api.post.likes.useMutation({
    onSuccess: () => {
      refresh()
    },
  })
  return (
    <button className="flex gap-2" onClick={() => mutate(post.id)}>
      <HeartIcon className={post.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'} />
      {post._count.likes}
    </button>
  )
}

export default LikeBtn
