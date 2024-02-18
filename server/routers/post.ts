import { createRouter, publicProcedure } from '../trpc'

export const postRouter = createRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany()
  }),
})
