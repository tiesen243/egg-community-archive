'use client'

import DeleteAccount from '@/components/delete-account'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as card from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { api } from '@/lib/trpc/client'
import { ChangePasswordSchema } from '@/server/schemas/user'
import { Loader2Icon } from 'lucide-react'
import type { NextPage } from 'next'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

const Page: NextPage = () => {
  const { mutate, error, isLoading } = api.user.changePass.useMutation({
    onError: (err) => !err.data?.zodError && toast.error(err.message),
    onSuccess: (data) => {
      toast.success(data.message)
      signOut()
    },
  })
  return (
    <TabsContent value="security">
      <card.Card>
        <card.CardHeader>
          <card.CardTitle>Change Passowrd</card.CardTitle>
          <card.CardDescription>
            For your security, we highly recommend you to change your password regularly.
          </card.CardDescription>
        </card.CardHeader>

        <form action={(formData: FormData) => mutate(Object.fromEntries(formData) as ChangePasswordSchema)}>
          <card.CardContent className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                {...field}
                type="password"
                message={String(error?.data?.zodError?.fieldErrors?.[field.name] ?? '')}
              />
            ))}
          </card.CardContent>

          <card.CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Loader2Icon className={`mr-2 animate-spin ${isLoading ? 'block' : 'hidden'}`} />
              Change Password
            </Button>
          </card.CardFooter>
        </form>

        <card.CardHeader>
          <card.CardTitle>Delete Account</card.CardTitle>
          <card.CardDescription>
            Once you delete your account, there is no going back. Please be certain.
          </card.CardDescription>
        </card.CardHeader>

        <card.CardFooter>
          <DeleteAccount />
        </card.CardFooter>
      </card.Card>
    </TabsContent>
  )
}

export default Page

const fields = [
  {
    label: 'Old Password',
    name: 'oldPassword',
  },
  {
    label: 'New Password',
    name: 'newPassword',
  },
  {
    label: 'Confirm New Password',
    name: 'confirmNewPassword',
  },
]
