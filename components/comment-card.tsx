import * as card from '@/components/ui/card'
import type { Comment, User } from '@prisma/client'
import UserAvatar from './user-avatar'

interface Props {
  comment: Comment & {
    author: User
  }
}

const CommentCard: React.FC<Props> = ({ comment }) => (
  <card.Card key={comment.id}>
    <section className="flex gap-2 p-4">
      <UserAvatar user={comment.author} />
      <div>
        <p>{comment.author.name}</p>
        <card.CardDescription>{comment.createdAt.toDateString()}</card.CardDescription>
      </div>
    </section>

    <card.CardContent>{comment.content}</card.CardContent>
  </card.Card>
)

export default CommentCard
