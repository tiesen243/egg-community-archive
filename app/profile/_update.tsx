'use client'

import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/lib/trpc/client'
import { type UpdateSchema } from '@/server/schemas/user'

const UpdateDialog: React.FC<{ user: User }> = ({ user }) => {
  const { mutate, error, isLoading } = api.user.update.useMutation({
    onError: (err) => {
      if (!err.data?.zodError) return toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('Profile updated!', {
        description: 'You will be logged out to see the changes.',
      })
      signOut()
    },
  })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription> Update your profile information. </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          action={(formData: FormData) => {
            const data = Object.fromEntries(formData) as UpdateSchema
            mutate(data)
          }}
        >
          {fields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              defaultValue={String(user[field.name as keyof User] ?? '')}
              message={String(error?.data?.zodError?.fieldErrors[field.name] ?? '')}
            />
          ))}

          <DialogFooter>
            <Button disabled={isLoading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateDialog

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
    type: 'url',
  },
]
