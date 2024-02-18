'use client'

import type { NextPage } from 'next'
import Image from 'next/image'

import { FormField } from '@/components/form-field'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { FormFooter, FormHeader } from '../_shared'
import { login } from './login'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'

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
    <main className="container grid flex-grow place-items-center">
      <Card className="grid w-full grid-cols-3">
        <div className="col-span-2">
          <FormHeader
            title="Register"
            description="Register a new account to access the full features of the application."
          />

          <form action={submit}>
            <CardContent className="space-y-4">
              {fields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}

              <span>
                Don&#39;t have an account?{' '}
                <Link href="/auth/register" className="underline-offset-4 hover:underline">
                  Register here.
                </Link>
              </span>
            </CardContent>

            <Footer />
          </form>
        </div>
        <div className="col-span-1 aspect-square">
          <Image src="/auth.gif" alt="Auth" fill />
        </div>
      </Card>
    </main>
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
