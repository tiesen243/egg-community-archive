import { Post, User } from '@prisma/client'
import { Card, CardContent, CardHeader } from './ui/card'
import UserAvatar from './user-avatar'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'

interface PostCardProps {
  post: Post & {
    author: User
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => (
  <Link href={`/post/${post.id}`} passHref legacyBehavior>
    <Card className="cursor-pointer transition-colors ease-linear hover:bg-secondary">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <UserAvatar user={post.author} />
        <div>
          <p>{post.author.name}</p>
          <span className="text-muted-foreground">{post.createdAt.toDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="truncate-to-4-lines">{post.content}</CardContent>
    </Card>
  </Link>
)

export const PostCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="flex-row items-center gap-2 space-y-0">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </CardContent>
  </Card>
)
