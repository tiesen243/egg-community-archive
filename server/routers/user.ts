import bcrypt from 'bcryptjs'

import { createRouter, protectedProcedure, publicProcedure } from '@/server/trpc'
import { registerSchema, updateSchema } from '@/server/schemas/user'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const userRouter = createRouter({
  // [GET]
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany()
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input },
    })

    if (!user) throw new TRPCError({ message: 'User not found', code: 'NOT_FOUND' })

    return user
  }),

  // [POST]
  register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const isExistingUser = await ctx.db.user.findUnique({
      where: {
        email: input.email,
      },
    })
    if (isExistingUser) throw new TRPCError({ message: 'User already exists', code: 'CONFLICT' })

    const salt = await bcrypt.genSalt(12)
    const user = await ctx.db.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: bcrypt.hashSync(input.password, salt),
      },
    })

    if (!user) throw new TRPCError({ message: 'Failed to create user', code: 'INTERNAL_SERVER_ERROR' })

    await fetch(String(process.env.EMAIL_SERVER ?? ''), {
      method: 'POST',
      body: JSON.stringify({
        from: 'Egg Community',
        to: input.email,
        reply_to: 'ttien56906@gmail.com',
        subject: 'Welcome to Egg Community',
        message: `Hi ${input.name}, your account has been created successfully! Thanks for joining Egg Community! We're fucking excited to have you on board. If you have any more fucking questions, feel free to fuck my ask`,
      }),
    })

    return {
      message: 'User created successfully',
    }
  }),

  // [PATCH]
  update: protectedProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
    const { user } = ctx.session
    const updatedUser = await ctx.db.user.update({
      where: { id: user.id },
      data: {
        name: input.name ? input.name : user.name,
        image: input.image ? input.image : user.image,
        bio: input.bio ? input.bio : user.bio,
      },
    })

    if (!updatedUser) throw new TRPCError({ message: 'Failed to update user', code: 'INTERNAL_SERVER_ERROR' })

    return {
      message: 'User updated successfully',
    }
  }),
})
