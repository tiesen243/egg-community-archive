import { TRPCError } from '@trpc/server'
import { revalidatePath } from 'next/cache'
import { commentSchema, createSchema, getByIdSchema, updateSchema } from '@/server/schemas/post'
import { createRouter, protectedProcedure, publicProcedure } from '@/server/trpc'

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
      include: {
        author: true,
        comments: {
          orderBy: { createdAt: 'desc' },
          include: { author: true },
        },
      },
    })
  }),

  // [POST]
  create: protectedProcedure.input(createSchema).mutation(async ({ ctx, input }) => {
    const newPost = await ctx.db.post.create({
      data: {
        content: input.content,
        image: input.image,
        author: { connect: { id: ctx.session.user.id } },
      },
    })
    if (!newPost) throw new TRPCError({ message: 'Failed to create post', code: 'INTERNAL_SERVER_ERROR' })

    revalidatePath('/profile')
    revalidatePath('/')
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

    if (!newComment) throw new TRPCError({ message: 'Failed to create comment', code: 'INTERNAL_SERVER_ERROR' })

    revalidatePath(`/post/${input.id}`)
    return newComment
  }),

  // [PATCH]
  update: protectedProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({ where: { id: input.id } })
    if (!post) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    if (post.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this post", code: 'FORBIDDEN' })

    const newData = {
      content: input.content ? input.content : post.content,
      image: input.image ? input.image : post.image,
    }

    const updatedPost = await ctx.db.post.update({
      where: { id: input.id },
      data: newData,
    })

    if (!updatedPost) throw new TRPCError({ message: 'Failed to update post', code: 'INTERNAL_SERVER_ERROR' })

    revalidatePath(`/post/${input.id}`)
    revalidatePath('/profile')
    return updatedPost
  }),

  // [DELETE]
  delete: protectedProcedure.input(getByIdSchema).mutation(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({ where: { id: input.id } })
    if (!post) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    if (post.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this post", code: 'FORBIDDEN' })
    await ctx.db.comment.deleteMany({ where: { postId: input.id } })
    await ctx.db.post.delete({ where: { id: input.id } })

    revalidatePath('/profile')
    revalidatePath('/')
    return true
  }),
})
