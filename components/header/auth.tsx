import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { auth, signOut } from '@/server/auth'
import { CircleUserRoundIcon, LogOutIcon } from 'lucide-react'

export const Auth: React.FC = async () => {
  const session = await auth()

  if (!session || !session.user)
    return (
      <Button variant="outline">
        <Link href="/auth/signin">Sign in</Link>
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
          <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <CircleUserRoundIcon className="mr-2" /> {session.user.name}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}
          >
            <button type="submit" className="flex">
              <LogOutIcon className="mr-2" /> Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
