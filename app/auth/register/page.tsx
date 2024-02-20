'use client'
import type { NextPage } from 'next'
import Image from 'next/image'

import { FormField } from '@/components/form-field'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/trpc/client'
import { RegisterSchema } from '@/server/schemas/user'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
    <main className="container grid flex-grow place-items-center">
      <Card className="grid w-full grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 hidden aspect-square md:block">
          <Image src="/auth.gif" alt="Auth" fill />
        </div>
        <div className="col-span-2">
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

              <span>
                Already have an account?{' '}
                <Link href="/auth/signin" className="underline-offset-4 hover:underline">
                  Login here.
                </Link>
              </span>
            </CardContent>

            <FormFooter btnText="Register" isSubmitting={isLoading} />
          </form>
        </div>
      </Card>
    </main>
  )
}

export default Page

const fields = [
  { label: 'Name', name: 'name' },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Password', name: 'password', type: 'password' },
  { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
]
