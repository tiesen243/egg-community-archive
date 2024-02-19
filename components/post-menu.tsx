'use client'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import UpdatePost from '@/components/update-post'
import { api } from '@/lib/trpc/client'
import type { Post, User } from '@prisma/client'
import { MoreHorizontalIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  post: Post & {
    author: User
  }
}
const PostMenu: React.FC<Props> = ({ post }) => {
  const { mutate: deletePost } = api.post.delete.useMutation({
    onError: (err) => toast.error(err.message),
    onSuccess: () => toast.success('Post deleted'),
  })

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="absolute right-4 top-4 z-20 hover:text-primary/50" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem> Edit post </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={() => deletePost({ id: post.id })}>Delete post</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdatePost post={post} />
    </Dialog>
  )
}

export default PostMenu
