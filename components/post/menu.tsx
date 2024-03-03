'use client'

import { MoreHorizontalIcon } from 'lucide-react'

import UpdatePost from '@/components/post/update'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import * as dropdownMenu from '@/components/ui/dropdown-menu'
import { deletePost } from '@/server/actions'
import { PostCardProps } from './card'
import React from 'react'

export const PostMenu: React.FC<PostCardProps> = ({ post }) => {
  const [open, setOpen] = React.useState<boolean>(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <dropdownMenu.DropdownMenu>
        <dropdownMenu.DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="absolute right-4 top-4 z-20 hover:text-primary/50" />
        </dropdownMenu.DropdownMenuTrigger>

        <dropdownMenu.DropdownMenuContent>
          <DialogTrigger asChild>
            <dropdownMenu.DropdownMenuItem>Edit post</dropdownMenu.DropdownMenuItem>
          </DialogTrigger>
          <dropdownMenu.DropdownMenuItem asChild>
            <form action={() => deletePost(post.id, post.image)}>
              <button>Delete post</button>
            </form>
          </dropdownMenu.DropdownMenuItem>
        </dropdownMenu.DropdownMenuContent>
      </dropdownMenu.DropdownMenu>

      <UpdatePost id={post.id} content={post.content} setOpen={setOpen} />
    </Dialog>
  )
}
