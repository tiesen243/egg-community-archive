'use client'

import { Post } from '@prisma/client'
import * as dialog from '@/components/ui/dialog'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/trpc/client'
import { toast } from 'sonner'
import { UpdateInput } from '@/server/schemas/post'

const UpdatePost: React.FC<{ post: Post }> = ({ post }) => {
  const {
    mutate: updatePost,
    error,
    isLoading,
  } = api.post.update.useMutation({
    onError: (err) => {
      if (!err.data?.zodError) toast.error(err.message)
    },
    onSuccess: () => toast.success('Post updated'),
  })
  return (
    <dialog.DialogContent>
      <dialog.DialogHeader>
        <dialog.DialogTitle>Edit post</dialog.DialogTitle>
        <dialog.DialogDescription>Update your post</dialog.DialogDescription>
      </dialog.DialogHeader>

      <form
        className="space-y-4"
        action={(formData: FormData) => {
          const data = Object.fromEntries(formData) as UpdateInput
          updatePost({ ...data, id: post.id })
        }}
      >
        <FormField
          name="content"
          label="Content"
          defaultValue={post.content}
          message={String(error?.data?.zodError?.fieldErrors.content ?? '')}
          multiline
        />
        <FormField
          name="image"
          label="Image"
          type="url"
          defaultValue={post.image ?? ''}
          message={String(error?.data?.zodError?.fieldErrors.image ?? '')}
        />

        <dialog.DialogFooter>
          <Button type="submit" disabled={isLoading}>
            Save
          </Button>
        </dialog.DialogFooter>
      </form>
    </dialog.DialogContent>
  )
}

export default UpdatePost
