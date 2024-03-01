import type { Comment, User } from '@prisma/client'

import * as card from '@/components/ui/card'
import UserAvatar from '@/components/user-avatar'

interface Props {
  comment: Comment & {
    author: User
  }
}

export const CommentCard: React.FC<Props> = ({ comment }) => (
  <card.Card key={comment.id} className="border-none">
    <card.CardContent className="flex items-center gap-2 p-4">
      <UserAvatar user={comment.author} />
      <div>
        <p className="font-bold">{comment.author.name}</p>
        <p>{comment.content}</p>
      </div>
    </card.CardContent>
  </card.Card>
)
