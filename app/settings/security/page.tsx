'use client'

import type { ChangePasswordSchema } from '@/server/schemas/user'
import type { NextPage } from 'next'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as card from '@/components/ui/card'
import { api } from '@/lib/trpc/client'
import DeleteAccount from './_delete-account'

const Page: NextPage = () => {
  const { mutate, error, isLoading } = api.user.changePass.useMutation({
    onError: (err) => !err.data?.zodError && toast.error(err.message),
    onSuccess: (data) => {
      toast.success(data.message)
      signOut()
    },
  })
  return (
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
          <Button type="submit" className="w-full" isLoading={isLoading}>
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
