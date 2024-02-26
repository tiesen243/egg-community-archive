'use client'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { CardContent } from '@/components/ui/card'
import { api } from '@/lib/trpc/client'
import { type RegisterSchema } from '@/server/schemas/user'
import { FormFooter, FormHeader } from '../_shared'

const Page: NextPage = () => {
  const { push } = useRouter()
  const { mutate, error, isLoading } = api.user.register.useMutation({
    onError(error) {
      if (!error.data?.zodError) toast.error(error.message)
    },
    onSuccess(data) {
      toast.success(data.message)
      push('/auth/signin')
    },
  })

  return (
    <>
      <FormHeader
        title="Register"
        description="Register a new account to access the full features of the application."
      />

      <form
        action={(formData: FormData) => {
          const data = Object.fromEntries(formData) as RegisterSchema
          mutate(data)
        }}
      >
        <CardContent className="space-y-4">
          {fields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              message={String(error?.data?.zodError?.fieldErrors?.[field.name] ?? '')}
            />
          ))}

          <p>
            Already have an account?{' '}
            <Link href="/auth/signin" className="underline-offset-4 hover:underline">
              Login here.
            </Link>
          </p>
        </CardContent>

        <FormFooter btnText="Register" isSubmitting={isLoading} />
      </form>
    </>
  )
}

export default Page

const fields = [
  { label: 'Name', name: 'name' },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Password', name: 'password', type: 'password' },
  { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
]
