'use server'

import { signIn } from '@/server/auth'
import { LoginSchema } from '@/server/schemas/user'

export const login = async (formData: FormData) => {
  const data = Object.fromEntries(formData) as LoginSchema
  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    return { message: 'Logged in successfully' }
  } catch (e: any) {
    if (e.cause) return { error: e.cause.err.message }
    return { error: e.message }
  }
}
