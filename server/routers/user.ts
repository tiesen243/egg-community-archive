import bcrypt from 'bcryptjs'

import * as user from '@/server/schemas/user'
import * as trpc from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import { deleteFile } from '@/lib/cloudinary'

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
})
