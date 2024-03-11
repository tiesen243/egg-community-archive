'use client'

import { Edit3Icon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import * as React from 'react'
import { useRouter } from 'next/navigation'

import UpdatePost from '@/components/post/update'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import * as dropdownMenu from '@/components/ui/dropdown-menu'
import { api } from '@/lib/trpc/client'
import { PostCardProps } from '@/components/post'

export const PostMenu: React.FC<PostCardProps> = ({ post }) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const { refresh } = useRouter()
  const { mutate } = api.post.delete.useMutation({
    onSuccess: () => refresh(),
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <dropdownMenu.DropdownMenu>
        <dropdownMenu.DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="absolute right-4 top-4 z-20 hover:text-primary/50" />
        </dropdownMenu.DropdownMenuTrigger>

        <dropdownMenu.DropdownMenuContent>
          <dropdownMenu.DropdownMenuLabel>Post options</dropdownMenu.DropdownMenuLabel>
          <DialogTrigger asChild>
            <dropdownMenu.DropdownMenuItem>
              <Edit3Icon className="mr-2 size-4" /> Edit post
            </dropdownMenu.DropdownMenuItem>
          </DialogTrigger>

          <form action={() => mutate(post.id)}>
            <dropdownMenu.DropdownMenuItem asChild>
              <button className="inline-flex">
                <Trash2Icon className="mr-2 size-4" /> Delete post
              </button>
            </dropdownMenu.DropdownMenuItem>
          </form>
        </dropdownMenu.DropdownMenuContent>
      </dropdownMenu.DropdownMenu>

      <UpdatePost id={post.id} content={post.content} setOpen={setOpen} />
    </Dialog>
  )
}
