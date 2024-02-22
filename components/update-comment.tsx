import * as dialog from '@/components/ui/dialog'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/trpc/server'

interface Props {
  id: string
  content: string
}

const UpdateComment: React.FC<Props> = ({ id, content }) => {
  return (
    <dialog.DialogContent>
      <dialog.DialogHeader>
        <dialog.DialogTitle>Edit comment</dialog.DialogTitle>
      </dialog.DialogHeader>

      <form
        action={async (formData: FormData) => {
          'use server'
          const content = String(formData.get('content'))
          await api.post.updateComment.mutate({ id, content })
        }}
        className="space-y-4"
      >
        <FormField name="content" type="text" defaultValue={content} />

        <dialog.DialogFooter>
          <Button type="submit">Update</Button>
        </dialog.DialogFooter>
      </form>
    </dialog.DialogContent>
  )
}

export default UpdateComment
