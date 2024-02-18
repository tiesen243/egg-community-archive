'use client'

import { api } from '@/lib/trpc/client'
import { SendHorizonalIcon } from 'lucide-react'
import { FormField } from './form-field'
import { Button } from './ui/button'
import { toast } from 'sonner'

const CommentPost: React.FC<{ postId: string }> = ({ postId }) => {
  const { mutate, error, isLoading } = api.post.comment.useMutation({
    onError: (err) => {
      if (!err.data?.zodError) toast.error(err.message)
    },
    onSuccess: () => toast.success('Comment added'),
  })

  console.log({ error, isLoading })

  return (
    <form
      className="flex gap-2"
      action={(formData: FormData) => {
        const comment = String(formData.get('comment'))
        mutate({ id: postId, comment: comment })
      }}
    >
      <FormField
        name="comment"
        placeholder="Write a comment..."
        className="flex-grow"
        message={String(error?.data?.zodError?.fieldErrors.comment ?? '')}
      />
      <Button type="submit" size="icon" disabled={isLoading}>
        <SendHorizonalIcon />
      </Button>
    </form>
  )
}

export default CommentPost
