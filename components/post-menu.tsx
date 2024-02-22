import type { Post, User } from '@prisma/client'
import { MoreHorizontalIcon } from 'lucide-react'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import * as dropdownMenu from '@/components/ui/dropdown-menu'
import UpdatePost from '@/components/update-post'
import { api } from '@/lib/trpc/server'

interface Props {
  post: Post & {
    author: User
  }
}
const PostMenu: React.FC<Props> = ({ post }) => {
  return (
    <Dialog>
      <dropdownMenu.DropdownMenu>
        <dropdownMenu.DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="absolute right-4 top-4 z-20 hover:text-primary/50" />
        </dropdownMenu.DropdownMenuTrigger>

        <dropdownMenu.DropdownMenuContent>
          <DialogTrigger asChild>
            <dropdownMenu.DropdownMenuItem> Edit post </dropdownMenu.DropdownMenuItem>
          </DialogTrigger>
          <dropdownMenu.DropdownMenuItem asChild>
            <form
              action={async () => {
                'use server'
                await api.post.delete.mutate(post.id)
              }}
            >
              <button>Delete post</button>
            </form>
          </dropdownMenu.DropdownMenuItem>
        </dropdownMenu.DropdownMenuContent>
      </dropdownMenu.DropdownMenu>

      <UpdatePost post={post} />
    </Dialog>
  )
}

export default PostMenu
