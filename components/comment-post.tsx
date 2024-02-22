import { api } from '@/lib/trpc/server'
import { SendHorizonalIcon } from 'lucide-react'
import { FormField } from './form-field'
import { Button } from './ui/button'
import { auth } from '@/server/auth'

const CommentPost: React.FC<{ postId: string }> = async ({ postId }) => {
  const session = await auth()
  if (!session || !session.user) return null

  return (
    <form
      className="flex gap-2"
      action={async (formData: FormData) => {
        'use server'
        const comment = String(formData.get('comment'))
        await api.post.comment.mutate({ id: postId, comment: comment })
      }}
    >
      <FormField name="comment" placeholder="Write a comment..." className="flex-grow" />
      <Button type="submit" size="icon">
        <SendHorizonalIcon />
      </Button>
    </form>
  )
}

export default CommentPost
