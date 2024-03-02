import type { Comment, User } from '@prisma/client'

import * as card from '@/components/ui/card'
import UserAvatar from '@/components/user-avatar'
import Link from 'next/link'

interface Props {
  comment: Comment & {
    author: User
  }
}

export const CommentCard: React.FC<Props> = ({ comment }) => (
  <card.Card className="group border-none pb-4">
    <Link href={`/u/${comment.author.id}`} className="z-10 flex gap-2">
      <UserAvatar user={comment.author} className="ring-2 ring-muted transition-colors group-hover:ring-ring" />
      <div className="space-y-1.5">
        <p className="font-bold">{comment.author.name}</p>
        <p>{comment.content}</p>
      </div>
    </Link>
    <div className="absolute bottom-0 left-5 h-full w-[1px] bg-muted transition-colors group-hover:bg-ring" />
  </card.Card>
)
