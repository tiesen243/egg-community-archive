import { toast } from 'sonner'
import { signOut } from 'next-auth/react'

import { api } from '@/lib/trpc/client'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'

const DeleteAccount = () => {
  const { mutate, isLoading } = api.user.deleteAccount.useMutation({
    onError: (err) => !err.data?.zodError && toast.error(err.message),
    onSuccess: () => {
      toast.success('Account deleted successfully')
      signOut()
    },
  })
  return (
    <dialog.Dialog>
      <dialog.DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </dialog.DialogTrigger>

      <dialog.DialogContent>
        <dialog.DialogHeader>
          <dialog.DialogTitle>Delete Account</dialog.DialogTitle>
          <dialog.DialogDescription>
            Are you sure you want to delete your account? This action is irreversible. Enter your password to confirm.
          </dialog.DialogDescription>
        </dialog.DialogHeader>

        <form
          className="space-y-4"
          action={(formData: FormData) => {
            const password = String(formData.get('password') ?? '')
            mutate({ password })
          }}
        >
          <FormField label="Password" name="password" type="password" />

          <dialog.DialogFooter>
            <dialog.DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </dialog.DialogClose>
            <Button type="submit" variant="destructive" isLoading={isLoading}>
              Delete Account
            </Button>
          </dialog.DialogFooter>
        </form>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}

export default DeleteAccount
