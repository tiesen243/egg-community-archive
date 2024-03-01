'use client'

import { SendHorizonalIcon } from 'lucide-react'

import { api } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'

export const CommentPost: React.FC<{ postId: string }> = ({ postId }) => {
  const { refresh } = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { mutate, error, isLoading } = api.post.comment.useMutation({
    onError: (err) => {
      if (!err.data?.zodError) toast.error(err.message)
    },
    onSuccess: () => {
      refresh()
      formRef.current?.reset()
      toast.success('Comment added')
    },
  })
  return (
    <form
      ref={formRef}
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
        message={String(error?.data?.zodError?.fieldErrors?.comment ?? '')}
      />
      <Button type="submit" size="icon" isLoading={isLoading}>
        <SendHorizonalIcon style={{ display: isLoading ? 'none' : 'block' }} />
      </Button>
    </form>
  )
}
