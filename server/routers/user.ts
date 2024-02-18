import bcrypt from 'bcryptjs'

import { createRouter, protectedProcedure, publicProcedure } from '@/server/trpc'
import { registerSchema, updateSchema } from '@/server/schemas/user'

export const userRouter = createRouter({
  // [POST]
  register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const isExistingUser = await ctx.db.user.findUnique({
      where: {
        email: input.email,
      },
    })
    if (isExistingUser) throw new Error('User already exists')

    const salt = await bcrypt.genSalt(12)
    const user = await ctx.db.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: bcrypt.hashSync(input.password, salt),
      },
    })

    if (!user) throw new Error('Failed to create user')

    return {
      message: 'User created successfully',
    }
  }),

  // [PATCH]
  update: protectedProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    })
    if (!user) throw new Error('You are not authorized to perform this action')

    const updatedUser = await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        name: input.name ? input.name : user.name,
        image: input.image ? input.image : user.image,
        bio: input.bio ? input.bio : user.bio,
      },
    })

    if (!updatedUser) throw new Error('Failed to update user')

    return {
      message: 'User updated successfully',
    }
  }),
})
