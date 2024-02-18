import { z } from 'zod'

import { createRouter, publicProcedure } from '@/server/trpc'
import { postRouter } from './post'
import { userRouter } from './user'

export const appRouter = createRouter({
  hello: publicProcedure.input(z.string()).query(async ({ input }) => {
    return `Hello, ${input}!`
  }),
  user: userRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
