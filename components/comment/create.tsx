'use client'

import { SendHorizonalIcon } from 'lucide-react'

import { api } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'

interface Props {
  postId: string
  authorName: string
  className?: string
}

export const CommentPost: React.FC<Props> = ({ postId, authorName, className = '' }) => {
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
      className={`flex space-x-2 ${className}`}
      action={(formData: FormData) => {
        const comment = String(formData.get('comment'))
        mutate({ id: postId, comment: comment })
      }}
    >
      <FormField
        name="comment"
        placeholder={`Reply to ${authorName}...`}
        className="flex-grow"
        message={String(error?.data?.zodError?.fieldErrors?.comment ?? '')}
      />
      <Button type="submit" size="icon" isLoading={isLoading}>
        <SendHorizonalIcon style={{ display: isLoading ? 'none' : 'block' }} />
      </Button>
    </form>
  )
}
