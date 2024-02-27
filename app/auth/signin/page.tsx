'use client'

import type { NextPage } from 'next'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'

import { FormField } from '@/components/form-field'
import { CardContent } from '@/components/ui/card'
import { FormFooter, FormHeader } from '../_shared'
import { login } from './login'

const Page: NextPage = () => {
  const { push, refresh } = useRouter()
  const submit = async (formData: FormData) => {
    const res = await login(formData)
    if (res.error) return toast.error(res.error)

    push('/')
    refresh()
    toast.success(res.message)
  }
  return (
    <>
      <FormHeader title="Login" description="Welcome back! Please login to your account." />

      <form action={submit}>
        <CardContent className="space-y-4">
          {fields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}

          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <p>
              Don&#39;t have an account?{' '}
              <Link href="/auth/register" className="underline-offset-4 hover:underline">
                Register here.
              </Link>
            </p>

            <p>
              Forgot your password?{' '}
              <Link href="/auth/reset" className="underline-offset-4 hover:underline">
                Reset it here.
              </Link>
            </p>
          </div>
        </CardContent>

        <Footer />
      </form>
    </>
  )
}

export default Page

const Footer: React.FC = () => {
  const { pending } = useFormStatus()
  return <FormFooter btnText="Login" isSubmitting={pending} />
}

const fields = [
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Password', name: 'password', type: 'password' },
]
