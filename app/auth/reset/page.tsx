'use client'

import Link from 'next/link'
import type { NextPage } from 'next'

import { FormFooter, FormHeader } from '../_shared'
import { CardContent } from '@/components/ui/card'
import { FormField } from '@/components/form-field'
import { api } from '@/lib/trpc/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const Page: NextPage = () => {
  const { push } = useRouter()
  const { mutate, error, isLoading } = api.user.resetPass.useMutation({
    onError: (err) => !err.data?.zodError && toast.error(err.message),
    onSuccess: (data) => {
      toast.success(data.message, {
        description: data.description,
      })
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
          const email = String(formData.get('email'))
          mutate({ email })
        }}
      >
        <CardContent className="space-y-4">
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="abc@gmail.com"
            message={String(error?.data?.zodError?.fieldErrors.email ?? '')}
          />

          <p>
            Remembered your password?{' '}
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
