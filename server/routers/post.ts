import { revalidatePath } from 'next/cache'
import { commentSchema, createSchema, getByIdSchema } from '../schemas/post'
import { createRouter, protectedProcedure, publicProcedure } from '../trpc'

export const postRouter = createRouter({
  // [GET]
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({ include: { author: true }, orderBy: { createdAt: 'desc' } })
  }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      where: { authorId: ctx.session.user.id },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    })
  }),

  getById: publicProcedure.input(getByIdSchema).query(async ({ ctx, input }) => {
    return ctx.db.post.findUnique({
      where: { id: input.id },
      include: { author: true, comments: { include: { author: true } } },
    })
  }),

  // [POST]
  create: protectedProcedure.input(createSchema).mutation(async ({ ctx, input }) => {
    const newPost = await ctx.db.post.create({
      data: {
        content: input.content,
        author: { connect: { id: ctx.session.user.id } },
      },
    })
    if (!newPost) throw new Error('Failed to create post')

    revalidatePath('/profile')
    return newPost
  }),

  comment: protectedProcedure.input(commentSchema).mutation(async ({ ctx, input }) => {
    const newComment = await ctx.db.comment.create({
      data: {
        content: input.comment,
        post: { connect: { id: input.id } },
        author: { connect: { id: ctx.session.user.id } },
      },
    })

    if (!newComment) throw new Error('Failed to create comment')

    revalidatePath(`/post/${input.id}`)
    return newComment
  }),
})
