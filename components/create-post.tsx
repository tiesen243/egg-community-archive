'use client'

import { api } from '@/lib/trpc/client'
import { SendHorizonalIcon } from 'lucide-react'
import type { User } from 'next-auth'
import { toast } from 'sonner'

import { FormField } from './form-field'
import { Button } from './ui/button'
import { Card } from './ui/card'
import UserAvatar from './user-avatar'

const CreatePost: React.FC<{ user: User }> = ({ user }) => {
  const { mutate, error } = api.post.create.useMutation({
    onError: (error) => {
      if (!error.data?.zodError) toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Post created')
    },
  })
  return (
    <Card className="bg-secondary/50">
      <form
        className="flex items-center gap-4 p-4"
        action={(formData: FormData) => {
          const content = String(formData.get('content'))
          mutate({ content })
        }}
      >
        <UserAvatar user={user} />

        <FormField
          name="content"
          placeholder="What's on your mind?"
          className="flex-grow"
          inputClassName="rounded-full bg-secondary"
          message={String(error?.data?.zodError?.fieldErrors.content ?? '')}
        />

        <Button type="submit" className="rounded-full" size="icon">
          <SendHorizonalIcon />
        </Button>
      </form>
    </Card>
  )
}

export default CreatePost
