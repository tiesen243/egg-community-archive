import bcrypt from 'bcryptjs'

import * as user from '@/server/schemas/user'
import * as trpc from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import { deleteFile } from '@/lib/cloudinary'

const reply_to = process.env.EMAIL!

export const userRouter = trpc.createRouter({
  // [GET]
  getById: trpc.publicProcedure.input(user.string).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input },
    })

    if (!user) throw new TRPCError({ message: 'User not found', code: 'NOT_FOUND' })
    return user
  }),

  search: trpc.publicProcedure.input(user.string).query(async ({ ctx, input }) => {
    return await ctx.db.user.findMany({
      where: {
        name: {
          contains: input,
          mode: 'insensitive',
        },
      },
    })
  }),

  // [POST]
  register: trpc.publicProcedure.input(user.registerSchema).mutation(async ({ ctx, input }) => {
    const isExistingUser = await ctx.db.user.findUnique({
      where: {
        email: input.email,
      },
    })
    if (isExistingUser) throw new TRPCError({ message: 'User already exists', code: 'CONFLICT' })

    const user = await ctx.db.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: bcrypt.hashSync(input.password, 10),
      },
    })

    if (!user) throw new TRPCError({ message: 'Failed to create user', code: 'INTERNAL_SERVER_ERROR' })

    await fetch(String(process.env.EMAIL_SERVER ?? ''), {
      method: 'POST',
      body: JSON.stringify({
        from: 'Egg Community',
        to: input.email,
        reply_to,
        subject: 'Welcome to Egg Community',
        message: `Hi ${input.name}, your account has been created successfully!<br> Thanks for joining Egg Community! We're fucking excited to have you on board.<br> If you have any more fucking questions, feel free to fuck my ask`,
      }),
    })

    return {
      message: 'User created successfully',
    }
  }),

  // [PATCH]
  update: trpc.protectedProcedure.input(user.updateSchema).mutation(async ({ ctx, input }) => {
    const { user } = ctx.session

    const updatedUser = await ctx.db.user.update({
      where: { id: user.id },
      data: {
        name: input.name ?? user.name,
        image: input.image !== '' ? input.image : user.image,
        bio: input.bio ?? user.bio,
      },
    })

    if (!updatedUser) throw new TRPCError({ message: 'Failed to update user', code: 'INTERNAL_SERVER_ERROR' })

    input.image && ctx.session.user.image && (await deleteFile(ctx.session.user.image))

    return {
      message: 'User updated successfully',
    }
  }),

  changePass: trpc.protectedProcedure.input(user.changePasswordSchema).mutation(async ({ ctx, input }) => {
    const { user } = ctx.session
    const isCorrectPass = bcrypt.compareSync(input.oldPassword, user.password)
    if (!isCorrectPass) throw new TRPCError({ message: 'Password is incorrect', code: 'UNAUTHORIZED' })

    const updatedUser = await ctx.db.user.update({
      where: { id: user.id },
      data: {
        password: bcrypt.hashSync(input.newPassword, 10),
      },
    })
    if (!updatedUser) throw new TRPCError({ message: 'Failed to update password', code: 'INTERNAL_SERVER_ERROR' })

    await fetch(String(process.env.EMAIL_SERVER ?? ''), {
      method: 'POST',
      body: JSON.stringify({
        from: 'Egg Community',
        to: user.email,
        reply_to,
        subject: 'Password Updated',
        message: `Hi ${user.name}, your password has been updated successfully!<br> If you didn't do this, please contact us immediately`,
      }),
    })

    return {
      message: 'Password updated successfully',
    }
  }),

  resetPass: trpc.publicProcedure.input(user.forgotPasswordSchema).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { email: input.email },
    })
    if (!user) throw new TRPCError({ message: 'User not found', code: 'NOT_FOUND' })

    const newPassword = `Duci#${Math.floor(100000 + Math.random() * 900000)}`
    const updatedUser = await ctx.db.user.update({
      where: { id: user.id },
      data: {
        password: bcrypt.hashSync(newPassword, 10),
      },
    })
    if (!updatedUser) throw new TRPCError({ message: 'Failed to update password', code: 'INTERNAL_SERVER_ERROR' })

    await fetch(String(process.env.EMAIL_SERVER ?? ''), {
      method: 'POST',
      body: JSON.stringify({
        from: 'Egg Community',
        to: input.email,
        reply_to,
        subject: 'Password Reset',
        message: `Hi ${user.name}, your password has been reset successfully!<br> Your new password is: ${newPassword}<br> Please change your password after login`,
      }),
    })

    return {
      message: 'Reset password email sent',
      description: 'Please check your email to reset your password.',
    }
  }),

  // [DELETE]
  deleteAccount: trpc.protectedProcedure.input(user.deleteAccountSchema).mutation(async ({ ctx, input }) => {
    const { user } = ctx.session
    const isCorrectPass = bcrypt.compareSync(input.password, user.password)
    if (!isCorrectPass) throw new TRPCError({ message: 'Password is incorrect', code: 'UNAUTHORIZED' })

    const deletedUser = await ctx.db.user.delete({ where: { id: user.id } })
    if (!deletedUser) throw new TRPCError({ message: 'Failed to delete user', code: 'INTERNAL_SERVER_ERROR' })

    user.image && (await deleteFile(user.image))
    await fetch(String(process.env.EMAIL_SERVER ?? ''), {
      method: 'POST',
      body: JSON.stringify({
        from: 'Egg Community',
        to: user.email,
        reply_to,
        subject: 'Account Deleted',
        message: `Hi ${user.name}, your account has been deleted successfully!<br> If you didn't do this, please contact us immediately`,
      }),
    })

    return {
      message: 'Account deleted successfully',
    }
  }),
})
