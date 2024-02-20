import bcrypt from 'bcryptjs'

import { createRouter, protectedProcedure, publicProcedure } from '@/server/trpc'
import { registerSchema, updateSchema } from '@/server/schemas/user'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const userRouter = createRouter({
  // [GET]
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
