'use client'

import { api } from '@/lib/trpc/client'
import { SendHorizonalIcon } from 'lucide-react'
import type { User } from 'next-auth'
import { toast } from 'sonner'

import { FormField } from './form-field'
import { Button } from './ui/button'
import { Card } from './ui/card'
import UserAvatar from './user-avatar'
import React from 'react'

const CreatePost: React.FC<{ user: User }> = ({ user }) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const { mutate, error } = api.post.create.useMutation({
    onError: (error) => {
      if (!error.data?.zodError) toast.error(error.message)
    },
    onSuccess: () => {
      formRef.current?.reset()
      toast.success('Post created')
    },
  })
  return (
    <Card className="bg-secondary/50">
      <form
        ref={formRef}
        className="space-y-4 p-4"
        action={(formData: FormData) => {
          const content = String(formData.get('content'))
          const image = String(formData.get('image'))
          mutate({ content, image })
        }}
      >
        <div className="flex gap-4">
          <UserAvatar user={user} />
          <FormField
            name="content"
            placeholder="What's on your mind?"
            className="flex-grow"
            inputClassName="bg-secondary"
            message={String(error?.data?.zodError?.fieldErrors.content ?? '')}
            multiline
          />
        </div>

        <div className="flex gap-2">
          <FormField
            type="url"
            name="image"
            placeholder="Image URL"
            className="flex-grow"
            inputClassName="rounded-full bg-secondary"
            message={String(error?.data?.zodError?.fieldErrors.image ?? '')}
          />

          <Button type="submit" className="rounded-full" size="icon">
            <SendHorizonalIcon />
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default CreatePost
