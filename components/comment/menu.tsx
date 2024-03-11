import { Edit3Icon, MoreHorizontalIcon, TrashIcon } from 'lucide-react'
import type { Comment, User } from '@prisma/client'

import * as dropdownMenu from '@/components/ui/dropdown-menu'
import { auth } from '@/server/auth'
import { api } from '@/lib/trpc/server'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import UpdateComment from './update'

interface Props {
  comment: Comment & {
    author: User
  }
}

export const CommentMenu: React.FC<Props> = async ({ comment }) => {
  const session = await auth()
  if (comment.author.id !== session?.user.id) return null

  return (
    <Dialog>
      <dropdownMenu.DropdownMenu>
        <dropdownMenu.DropdownMenuTrigger className="absolute right-4 top-4 z-20 cursor-pointer select-none hover:text-primary/50">
          <MoreHorizontalIcon />
        </dropdownMenu.DropdownMenuTrigger>

        <dropdownMenu.DropdownMenuContent>
          <dropdownMenu.DropdownMenuLabel>Comment options</dropdownMenu.DropdownMenuLabel>

          <DialogTrigger asChild>
            <dropdownMenu.DropdownMenuItem>
              <Edit3Icon className="mr-2 size-4" /> Edit Comment
            </dropdownMenu.DropdownMenuItem>
          </DialogTrigger>

          <form
            action={async () => {
              'use server'
              await api.post.deleteComment.mutate(comment.id)
            }}
          >
            <dropdownMenu.DropdownMenuItem asChild>
              <button type="submit">
                <TrashIcon className="mr-2 size-4" /> Delete Comment
              </button>
            </dropdownMenu.DropdownMenuItem>
          </form>
        </dropdownMenu.DropdownMenuContent>
      </dropdownMenu.DropdownMenu>

      <UpdateComment id={comment.id} content={comment.content} />
    </Dialog>
  )
}
