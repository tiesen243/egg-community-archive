import { createRouter } from '@/server/trpc'
import { postRouter } from './post'
import { userRouter } from './user'

export const appRouter = createRouter({
  user: userRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
