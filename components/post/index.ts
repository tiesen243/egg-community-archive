import type { User } from '@prisma/client'

export { PostCard, PublicPostCard } from './card'
export { PostMenu } from './menu'

export interface PostCardProps {
  post: {
    id: string
    content: string
    image: string | null
    createdAt: Date
    isLiked?: boolean
    likes: number
    replies: number
    author: User
  }
  refetch?: () => void
}
