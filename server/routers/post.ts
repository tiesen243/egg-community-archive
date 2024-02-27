import * as post from '@/server/schemas/post'
import { createRouter, protectedProcedure, publicProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import { revalidatePath } from 'next/cache'

export const postRouter = createRouter({
  // [GET]
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({ include: { author: true }, orderBy: { createdAt: 'desc' } })
  }),

  getByUser: publicProcedure.input(post.id).query(async ({ ctx, input }) => {
    return ctx.db.post.findMany({
      where: { authorId: input },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    })
  }),

  search: publicProcedure.input(post.id).query(async ({ ctx, input }) => {
    return await ctx.db.post.findMany({
      where: {
        content: {
          contains: input,
          mode: 'insensitive',
        },
      },
      include: { author: true },
    })
  }),

  getById: publicProcedure.input(post.id).query(async ({ ctx, input }) => {
    return ctx.db.post.findUnique({
      where: { id: input },
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
  create: protectedProcedure.input(post.createSchema).mutation(async ({ ctx, input }) => {
    const newPost = await ctx.db.post.create({
      data: {
        content: input.content,
        image: input.image ?? '',
        author: { connect: { id: ctx.session.user.id } },
      },
    })
    if (!newPost) throw new TRPCError({ message: 'Failed to create post', code: 'INTERNAL_SERVER_ERROR' })

    revalidatePath(`/u/${ctx.session.user.id}`)
    revalidatePath('/')
    return newPost
  }),

  comment: protectedProcedure.input(post.commentSchema).mutation(async ({ ctx, input }) => {
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
  update: protectedProcedure.input(post.updateSchema).mutation(async ({ ctx, input }) => {
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

    revalidatePath(`/users/${ctx.session.user.id}`)
    revalidatePath(`/post/${input.id}`)
    revalidatePath('/')
    return updatedPost
  }),

  updateComment: protectedProcedure.input(post.updateCommentSchema).mutation(async ({ ctx, input }) => {
    const comment = await ctx.db.comment.findUnique({ where: { id: input.id } })
    if (!comment) throw new TRPCError({ message: 'Comment not found', code: 'NOT_FOUND' })

    if (comment.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this comment", code: 'FORBIDDEN' })

    const updatedComment = await ctx.db.comment.update({
      where: { id: input.id },
      data: { content: input.comment },
    })

    if (!updatedComment) throw new TRPCError({ message: 'Failed to update comment', code: 'INTERNAL_SERVER_ERROR' })

    revalidatePath(`/post/${comment.postId}`)
    return updatedComment
  }),

  // [DELETE]
  delete: protectedProcedure.input(post.id).mutation(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({ where: { id: input } })
    if (!post) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    if (post.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this post", code: 'FORBIDDEN' })
    await ctx.db.comment.deleteMany({ where: { postId: input } })
    await ctx.db.post.delete({ where: { id: input } })

    revalidatePath(`/users/${ctx.session.user.id}`)
    revalidatePath('/')
    return true
  }),

  deleteComment: protectedProcedure.input(post.id).mutation(async ({ ctx, input }) => {
    const comment = await ctx.db.comment.findUnique({ where: { id: input } })
    if (!comment) throw new TRPCError({ message: 'Comment not found', code: 'NOT_FOUND' })

    if (comment.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this comment", code: 'FORBIDDEN' })
    await ctx.db.comment.delete({ where: { id: input } })

    revalidatePath(`/post/${comment.postId}`)
    return true
  }),
})
