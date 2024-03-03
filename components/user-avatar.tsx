import { User } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const UserAvatar: React.FC<{ user: User; className?: string }> = ({ user, className = '' }) => (
  <Avatar className={className}>
    <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} className="object-cover" />
    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
  </Avatar>
)

export default UserAvatar
