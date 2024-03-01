'use client'

import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import { updatePost } from '@/server/actions'
import type { Post } from '@prisma/client'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

interface Error {
  content?: string
  image?: string
}
const UpdatePost: React.FC<{ post: Post }> = ({ post }) => {
  const [error, setError] = useState<Error>()
  const action = async (formData: FormData) => {
    formData.append('id', post.id)
    const res = await updatePost(formData)
    if (res.error) {
      res.cause ? setError(res.cause) : setError({})
      return toast.error(res.error)
    }
    toast.success(res.message)
  }

  return (
    <dialog.DialogContent>
      <dialog.DialogHeader>
        <dialog.DialogTitle>Edit post</dialog.DialogTitle>
        <dialog.DialogDescription>Update your post</dialog.DialogDescription>
      </dialog.DialogHeader>

      <form className="space-y-4" action={action}>
        <FormField name="content" label="Content" defaultValue={post.content} multiline message={error?.content} />
        <FormField name="image" label="Image" type="file" accept="image/*" message={error?.image} />
        <UpdateButton />
      </form>
    </dialog.DialogContent>
  )
}

export default UpdatePost

const UpdateButton: React.FC = () => {
  const { pending } = useFormStatus()
  return (
    <dialog.DialogFooter>
      <Button type="submit" isLoading={pending}>
        Save changes
      </Button>
    </dialog.DialogFooter>
  )
}
