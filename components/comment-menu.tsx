import { MoreHorizontalIcon } from 'lucide-react'
import type { Comment, User } from '@prisma/client'

import * as dropdownMenu from '@/components/ui/dropdown-menu'
import { auth } from '@/server/auth'
import { api } from '@/lib/trpc/server'
import { Dialog, DialogTrigger } from './ui/dialog'
import UpdateComment from './update-comment'

interface Props {
  comment: Comment & {
    author: User
  }
}

const CommentMenu: React.FC<Props> = async ({ comment }) => {
  const session = await auth()
  if (comment.author.id !== session?.user.id) return null

  return (
    <Dialog>
      <dropdownMenu.DropdownMenu>
        <dropdownMenu.DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="absolute right-4 top-4 z-20 hover:text-primary/50" />
        </dropdownMenu.DropdownMenuTrigger>

        <dropdownMenu.DropdownMenuContent>
          <DialogTrigger asChild>
            <dropdownMenu.DropdownMenuItem>Edit Comment</dropdownMenu.DropdownMenuItem>
          </DialogTrigger>

          <dropdownMenu.DropdownMenuItem asChild>
            <form
              action={async () => {
                'use server'
                await api.post.deleteComment.mutate(comment.id)
              }}
            >
              <button type="submit">Delete Comment</button>
            </form>
          </dropdownMenu.DropdownMenuItem>
        </dropdownMenu.DropdownMenuContent>
      </dropdownMenu.DropdownMenu>

      <UpdateComment id={comment.id} content={comment.content} />
    </Dialog>
  )
}

export default CommentMenu
