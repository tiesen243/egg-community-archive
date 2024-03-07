'use client'

import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { saveFile } from '@/lib/cloudinary'
import { api } from '@/lib/trpc/client'

const Page: NextPage = () => {
  const [preview, setPreview] = React.useState<string | null>()
  const { back, push } = useRouter()
  const { mutate, error, isLoading } = api.post.create.useMutation({
    onError: (err) => !err.data?.zodError && toast.error(err.message),
    onSuccess: () => {
      setPreview(null)
      push('/')
    },
  })
  const action = async (formData: FormData) => {
    let image: string | undefined
    if (formData.get('image')) {
      const { url, error } = await saveFile(formData, 'post')
      if (error) return toast.error(error)
      image = url
    }
    mutate({
      content: String(formData.get('content')),
      image,
    })
  }
  return (
    <main className="container max-w-screen-md flex-grow">
      <form action={action} className="space-y-4">
        <FormField
          name="content"
          placeholder="What's on your mind?"
          className="flex-grow"
          multiline
          message={String(error?.data?.zodError?.fieldErrors.content ?? '')}
        />

        <FormField
          type="file"
          name="image"
          className="flex-grow"
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

        <div className="grid grid-cols-1 gap-4">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Post
          </Button>
          <Button type="button" variant="secondary" className="w-full md:hidden" disabled={isLoading} onClick={back}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  )
}

export default Page
