import { Post, User } from '@prisma/client'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import UserAvatar from './user-avatar'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import Image from 'next/image'

interface PostCardProps {
  post: Post & {
    author: User
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => (
  <Link href={`/p/${post.id}`} passHref legacyBehavior>
    <Card className="cursor-pointer bg-secondary/10 shadow-lg transition-all ease-linear hover:bg-secondary">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <UserAvatar user={post.author} />
        <div>
          <p>{post.author.name}</p>
          <span className="text-muted-foreground">{post.createdAt.toDateString()}</span>
        </div>
      </CardHeader>

      <CardContent className="mb-4 line-clamp-3 pb-0" dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.image && (
        <CardFooter>
          <Image src={post.image} alt={post.id} width={500} height={200} className="h-auto w-full rounded" />
        </CardFooter>
      )}
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
