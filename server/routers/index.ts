import { z } from 'zod'

import { createRouter, publicProcedure } from '@/server/trpc'
import { postRouter } from './post'

export const appRouter = createRouter({
  hello: publicProcedure.input(z.string()).query(async ({ input }) => {
    return `Hello, ${input}!`
  }),
  post: postRouter,
})

export type AppRouter = typeof appRouter
