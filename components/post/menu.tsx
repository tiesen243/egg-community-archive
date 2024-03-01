import type { Post, User } from '@prisma/client'
import { MoreHorizontalIcon } from 'lucide-react'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import * as dropdownMenu from '@/components/ui/dropdown-menu'
import UpdatePost from '@/components/post/update'
import { api } from '@/lib/trpc/server'
import { deleteFile } from '@/lib/cloudinary'

interface Props {
  post: Post & {
    author: User
  }
}
export const PostMenu: React.FC<Props> = ({ post }) => (
  <Dialog>
    <dropdownMenu.DropdownMenu>
      <dropdownMenu.DropdownMenuTrigger asChild>
        <MoreHorizontalIcon className="absolute right-4 top-4 z-20 hover:text-primary/50" />
      </dropdownMenu.DropdownMenuTrigger>

      <dropdownMenu.DropdownMenuContent>
        <DialogTrigger asChild>
          <dropdownMenu.DropdownMenuItem>Edit post</dropdownMenu.DropdownMenuItem>
        </DialogTrigger>
        <dropdownMenu.DropdownMenuItem asChild>
          <form
            action={async () => {
              'use server'
              await api.post.delete.mutate(post.id)
              post.image && deleteFile(post.image)
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
