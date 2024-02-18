import { auth } from '@/server/auth'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const Auth: React.FC = async () => {
  const session = await auth()

  if (!session || !session.user)
    return (
      <Button variant="outline">
        <Link href="/auth/signin">Sign in</Link>
      </Button>
    )

  return (
    <Link href="/profile" passHref legacyBehavior>
      <Avatar className="cursor-pointer">
        <AvatarImage src={session?.user.image ?? ''} alt={session?.user.name ?? ''} />
        <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </Link>
  )
}
