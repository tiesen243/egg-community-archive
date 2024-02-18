import { TRPCError, initTRPC } from '@trpc/server'
import { ZodError } from 'zod'

import db from '@/prisma'
import { auth } from './auth'
import { transformer } from './config'

export const createTRPCContext = async (otps: { headers: Headers }) => {
  const session = await auth()
  return {
    db,
    session,
    ...otps,
  }
}

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

//
export const createRouter = t.router

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({
    ctx: { session: { ...ctx.session, user: ctx.session.user } },
  })
})
