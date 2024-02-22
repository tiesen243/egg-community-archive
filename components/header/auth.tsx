import Link from 'next/link'
import { CircleUserRoundIcon, LogOutIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { auth, signOut } from '@/server/auth'
import UserAvatar from '@/components/user-avatar'

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
        <UserAvatar user={session.user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/u/${session.user.id}`}>
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
