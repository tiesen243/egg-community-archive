'use client'

import { type User } from 'next-auth'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import { updateProfile } from '@/server/actions'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Error {
  name: string
  bio: string
}

const UpdateDialog: React.FC<{ user: User }> = ({ user }) => {
  const [open, setOpen] = useState<boolean>(false)

  const [error, setError] = useState<Error>()
  const { refresh } = useRouter()
  const action = async (formData: FormData) => {
    const res = await updateProfile(formData)
    if (res.error) {
      res.cause ? setError(res.cause) : setError({ name: '', bio: '' })
      return toast.error(res.error)
    }

    refresh()
    setOpen(false)
    toast.success(res.message)
  }
  return (
    <dialog.Dialog open={open} onOpenChange={setOpen}>
      <dialog.DialogTrigger asChild>
        <Button>Edit profile</Button>
      </dialog.DialogTrigger>

      <dialog.DialogContent>
        <dialog.DialogHeader>
          <dialog.DialogTitle>Edit profile</dialog.DialogTitle>
          <dialog.DialogDescription> Update your profile information. </dialog.DialogDescription>
        </dialog.DialogHeader>

        <form className="space-y-4" action={action}>
          {fields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              {...(field.type !== 'file'
                ? { defaultValue: String(user[field.name as keyof User]) }
                : { accept: 'image/*' })}
              message={error?.[field.name as keyof Error]}
            />
          ))}

          <SubmitButton />
        </form>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}

export default UpdateDialog

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus()
  return (
    <dialog.DialogFooter>
      <Button type="submit" disabled={pending}>
        Save changes
      </Button>
    </dialog.DialogFooter>
  )
}

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'text',
    multiline: true,
  },
  {
    name: 'image',
    label: 'Profile picture',
    type: 'file',
  },
]
