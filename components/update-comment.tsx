'use client'

import * as dialog from '@/components/ui/dialog'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  id: string
  content: string
}

const UpdateComment: React.FC<Props> = ({ id, content }) => {
  const { refresh } = useRouter()
  const { mutate, error, isLoading } = api.post.updateComment.useMutation({
    onError: (err) => {
      if (!err.data?.zodError) toast.error(err.message)
    },
    onSuccess: () => {
      refresh()
    },
  })

  return (
    <dialog.DialogContent>
      <dialog.DialogHeader>
        <dialog.DialogTitle>Edit comment</dialog.DialogTitle>
      </dialog.DialogHeader>

      <form
        action={(formData: FormData) => {
          const comment = String(formData.get('comment'))
          mutate({ id, comment })
        }}
        className="space-y-4"
      >
        <FormField
          name="comment"
          type="text"
          defaultValue={content}
          message={String(error?.data?.zodError?.fieldErrors?.comment ?? '')}
        />

        <dialog.DialogFooter>
          <Button type="submit" disabled={isLoading}>
            Update
          </Button>
        </dialog.DialogFooter>
      </form>
    </dialog.DialogContent>
  )
}

export default UpdateComment
