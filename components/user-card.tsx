import Link from 'next/link'
import { Card } from './ui/card'
import UserAvatar from './user-avatar'
import { User } from '@prisma/client'

interface Props {
  user: User
}

const UserCard: React.FC<Props> = ({ user }) => (
  <Card className="cursor-pointer bg-secondary/10 shadow-lg transition-all ease-linear hover:bg-secondary">
    <Link href={`/u/${user.id}`} className="flex items-center gap-4 p-6">
      <UserAvatar user={user} />
      {user.name}
    </Link>
  </Card>
)

export default UserCard
