'use client'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { createPost } from '@/server/actions'
import type { NextPage } from 'next'
import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

interface Error {
  content?: string
  image?: string
}

const Page: NextPage = () => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [error, setError] = React.useState<Error>()
  const action = async (formData: FormData) => {
    const res = await createPost(formData)
    if (res.error) {
      res.cause ? setError(res.cause) : setError({})
      return toast.error(res.error)
    }
    formRef.current?.reset()
    setError({})
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

        <FormField type="file" name="image" className="flex-grow" accept="image/*" message={error?.image} />

        <PostButton />
      </form>
    </main>
  )
}

export default Page

const PostButton: React.FC = () => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      Post
    </Button>
  )
}
