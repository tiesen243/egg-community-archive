import { createRouter, publicProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { postRouter } from './post'
import { userRouter } from './user'

export const appRouter = createRouter({
  user: userRouter,
  post: postRouter,
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userRes = await ctx.db.user.findMany({
      where: {
        name: {
          contains: input,
          mode: 'insensitive',
        },
      },
    })

    const postRes = await ctx.db.post.findMany({
      where: {
        content: {
          contains: input,
          mode: 'insensitive',
        },
      },
      include: { author: true },
    })

    if (userRes.length === 0 && postRes.length === 0)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No results found' })

    return {
      users: userRes,
      posts: postRes,
    }
  }),
})

export type AppRouter = typeof appRouter
