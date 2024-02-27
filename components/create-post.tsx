'use client'

import { SendHorizonalIcon } from 'lucide-react'
import type { User } from 'next-auth'
import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import UserAvatar from '@/components/user-avatar'
import { createPost } from '@/server/actions'

interface Error {
  content?: string
  image?: string
}

const CreatePost: React.FC<{ user: User }> = ({ user }) => {
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
    <Button type="submit" className="rounded-full" size="icon" isLoading={pending}>
      <SendHorizonalIcon style={{ display: pending ? 'none' : 'block' }} />
    </Button>
  )
}
