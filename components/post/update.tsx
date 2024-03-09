'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import { saveFile } from '@/lib/cloudinary'
import { api } from '@/lib/trpc/client'

interface Props {
  id: string
  content?: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdatePost: React.FC<Props> = ({ id, content, setOpen }) => {
  const [preview, setPreview] = useState<string | null>()
  const { refresh } = useRouter()
  const { mutate, error, isLoading } = api.post.update.useMutation({
    onError: (err) => !err.data?.zodError && toast.error(err.message),
    onSuccess: () => {
      setPreview(null)
      setOpen(false)
      refresh()
      return toast.success('Post updated')
    },
  })
  const { mutate: deleteImg } = api.post.deleteImage.useMutation({
    onError: (err) => toast.error(err.message),
    onSuccess: async () => setOpen(false),
  })

  const action = async (formData: FormData) => {
    let image: string | undefined
    if (formData.get('image')) {
      const { url, error } = await saveFile(formData, 'post')
      if (error) return toast.error(error)
      image = url
    }
    mutate({
      id,
      content: String(formData.get('content')),
      image,
    })
  }

  return (
    <dialog.DialogContent>
      <dialog.DialogHeader>
        <dialog.DialogTitle>Edit post</dialog.DialogTitle>
        <dialog.DialogDescription>Update your post</dialog.DialogDescription>
      </dialog.DialogHeader>

      <form className="space-y-4" action={action}>
        <FormField
          name="content"
          label="Content"
          defaultValue={content}
          multiline
          message={String(error?.data?.zodError?.fieldErrors.content ?? '')}
        />
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

        <dialog.DialogFooter>
          <Button type="button" variant="ghost" onClick={() => deleteImg(id)}>
            Delete image
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save changes
          </Button>
        </dialog.DialogFooter>
      </form>
    </dialog.DialogContent>
  )
}

export default UpdatePost
