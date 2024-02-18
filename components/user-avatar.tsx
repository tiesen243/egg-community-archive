import { User } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const UserAvatar: React.FC<{ user: User }> = ({ user }) => (
  <Avatar>
    <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
  </Avatar>
)

export default UserAvatar
