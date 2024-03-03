'use client'

import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import Image from 'next/image'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { createPost } from '@/server/actions'

const Page: NextPage = () => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [error, setError] = React.useState<{ content?: string }>()
  const [preview, setPreview] = React.useState<string | null>()
  const action = async (formData: FormData) => {
    const res = await createPost(formData)
    if (res.error) {
      res.cause ? setError(res.cause) : setError({})
      return toast.error(res.error)
    }
    formRef.current?.reset()
    setError({})
    setPreview(null)
    return toast.success(res.message)
  }
  return (
    <main className="container max-w-screen-md flex-grow">
      <form ref={formRef} action={action} className="space-y-4">
        <FormField
          name="content"
          placeholder="What's on your mind?"
          className="flex-grow"
          multiline
          message={error?.content}
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

        <PostButton />
      </form>
    </main>
  )
}

export default Page

const PostButton: React.FC = () => {
  const { pending } = useFormStatus()
  const { back } = useRouter()

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button type="submit" className="w-full" isLoading={pending}>
        Post
      </Button>
      <Button type="button" variant="secondary" className="w-full md:hidden" disabled={pending} onClick={back}>
        Cancel
      </Button>
    </div>
  )
}
