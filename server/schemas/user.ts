import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(2).max(20),
    email: z.string().email(),
    password: z
      .string()
      .regex(/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/, {
        message:
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const updateSchema = z.object({
  name: z.string().min(2).max(20).optional(),
  image: z.optional(z.string()).or(z.string().url()),
  bio: z.string().max(100).optional(),
})

export type UpdateSchema = z.infer<typeof updateSchema>

export const string = z.string()

export const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .regex(/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/, {
        message:
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const deleteAccountSchema = z.object({
  password: z.string(),
})

export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>
