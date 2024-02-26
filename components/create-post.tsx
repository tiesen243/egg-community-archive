'use client'

import { Loader2Icon, SendHorizonalIcon } from 'lucide-react'
import type { User } from 'next-auth'
import { toast } from 'sonner'

import { createPost } from '@/server/actions'
import React, { useState } from 'react'
import { FormField } from './form-field'
import { Button } from './ui/button'
import { Card } from './ui/card'
import UserAvatar from './user-avatar'
import { useFormStatus } from 'react-dom'

interface Error {
  content?: string
  image?: string
}

const CreatePost: React.FC<{ user: User }> = ({ user }) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [error, setError] = useState<Error>()
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
    <Card className="bg-secondary/50">
      <form ref={formRef} className="space-y-4 p-4" action={action}>
        <div className="flex gap-4">
          <UserAvatar user={user} />
          <FormField
            name="content"
            placeholder="What's on your mind?"
            className="flex-grow"
            inputClassName="bg-secondary"
            multiline
            message={error?.content}
          />
        </div>

        <div className="flex gap-2">
          <FormField
            type="file"
            name="image"
            className="flex-grow"
            inputClassName="rounded-full bg-secondary"
            accept="image/*"
            message={error?.image}
          />

          <CreateBtn />
        </div>
      </form>
    </Card>
  )
}

export default CreatePost

const CreateBtn: React.FC = () => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="rounded-full" size="icon" disabled={pending}>
      {pending ? <Loader2Icon className="animate-spin" /> : <SendHorizonalIcon />}
    </Button>
  )
}
