'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import Image from 'next/image'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import { deleteImage, updatePost } from '@/server/actions'

interface Props {
  id: string
  content?: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdatePost: React.FC<Props> = ({ id, content, setOpen }) => {
  const [error, setError] = useState<{ content?: string }>()
  const [preview, setPreview] = useState<string | null>()
  const action = async (formData: FormData) => {
    formData.append('id', id)
    const res = await updatePost(formData)
    if (res.error) {
      res.cause ? setError(res.cause) : setError({})
      return toast.error(res.error)
    }
    toast.success(res.message)
    setOpen(false)
  }

  return (
    <dialog.DialogContent>
      <dialog.DialogHeader>
        <dialog.DialogTitle>Edit post</dialog.DialogTitle>
        <dialog.DialogDescription>Update your post</dialog.DialogDescription>
      </dialog.DialogHeader>

      <form className="space-y-4" action={action}>
        <FormField name="content" label="Content" defaultValue={content} multiline message={error?.content} />
        <FormField
          name="image"
          label="Image"
          type="file"
          accept="image/*"
          onChange={(e: any) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => setPreview(reader.result as string)
              reader.readAsDataURL(file)
            }
          }}
        />

        {preview && <Image src={preview} alt="Preview" width={720} height={360} className="h-auto w-full rounded-md" />}
        <UpdateButton id={id} setOpen={setOpen} />
      </form>
    </dialog.DialogContent>
  )
}

export default UpdatePost

const UpdateButton: React.FC<Props> = ({ id, setOpen }) => {
  const { pending } = useFormStatus()

  const handleDelete = async () => {
    await deleteImage(id)
    setOpen(false)
  }

  return (
    <dialog.DialogFooter>
      <Button type="button" variant="ghost" onClick={handleDelete}>
        Delete image
      </Button>
      <Button type="submit" isLoading={pending}>
        Save changes
      </Button>
    </dialog.DialogFooter>
  )
}
