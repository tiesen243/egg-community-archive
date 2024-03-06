import * as post from '@/server/schemas/post'
import * as trpc from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import { revalidatePath } from 'next/cache'

export const postRouter = trpc.createRouter({
  // [GET]
  getPublicContent: trpc.publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      include: { author: true, _count: { select: { comments: true, likes: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    })
    return posts.map((p) => ({
      id: p.id,
      content: p.content,
      image: p.image,
      createdAt: p.createdAt,
      author: p.author,
      isLiked: false,
      likes: p._count.likes,
      replies: p._count.comments,
    }))
  }),

  getAll: trpc.protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.post.findMany({
      include: {
        author: true,
        _count: { select: { comments: true, likes: true } },
        likes: ctx.session.user ? { where: { userId: ctx.session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    })

    return data.map((p) => ({
      id: p.id,
      content: p.content,
      image: p.image,
      createdAt: p.createdAt,
      author: p.author,
      isLiked: p.likes.length > 0,
      likes: p._count.likes,
      replies: p._count.comments,
    }))
  }),

  getByUser: trpc.protectedProcedure.input(post.string).query(async ({ ctx, input }) => {
    const data = await ctx.db.post.findMany({
      where: { authorId: input },
      include: {
        author: true,
        _count: { select: { comments: true, likes: true } },
        likes: ctx.session.user ? { where: { userId: ctx.session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    })
    return data.map((p) => ({
      id: p.id,
      content: p.content,
      image: p.image,
      createdAt: p.createdAt,
      author: p.author,
      isLiked: p.likes.length > 0,
      likes: p._count.likes,
      replies: p._count.comments,
    }))
  }),

  getByFollowing: trpc.protectedProcedure.query(async ({ ctx }) => {
    const following = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id }, select: { following: true } })
    const data = await ctx.db.post.findMany({
      where: {
        authorId: { in: following?.following.map((f) => f.id) },
      },
      include: {
        author: true,
        _count: { select: { comments: true, likes: true } },
        likes: ctx.session.user ? { where: { userId: ctx.session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    })

    return data.map((p) => ({
      id: p.id,
      content: p.content,
      image: p.image,
      createdAt: p.createdAt,
      author: p.author,
      isLiked: p.likes.length > 0,
      likes: p._count.likes,
      replies: p._count.comments,
    }))
  }),

  search: trpc.protectedProcedure.input(post.string).query(async ({ ctx, input }) => {
    if (!input) return []
    const data = await ctx.db.post.findMany({
      where: {
        content: {
          contains: input,
          mode: 'insensitive',
        },
      },
      include: {
        author: true,
        _count: { select: { comments: true, likes: true } },
        likes: ctx.session.user ? { where: { userId: ctx.session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    })

    return data.map((p) => ({
      id: p.id,
      content: p.content,
      image: p.image,
      createdAt: p.createdAt,
      author: p.author,
      isLiked: p.likes.length > 0,
      likes: p._count.likes,
      replies: p._count.comments,
    }))
  }),

  getByIdPublic: trpc.publicProcedure.input(post.string).query(async ({ ctx, input }) => {
    const data = await ctx.db.post.findUnique({
      where: { id: input },
      include: {
        author: true,
        comments: { orderBy: { createdAt: 'desc' }, include: { author: true } },
        _count: { select: { comments: true, likes: true } },
      },
    })
    if (!data) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    return {
      id: data.id,
      content: data.content,
      image: data.image,
      createdAt: data.createdAt,
      author: data.author,
      likes: data._count.likes,
      replies: data._count.comments,
      comments: data.comments,
    }
  }),

  getById: trpc.protectedProcedure.input(post.string).query(async ({ ctx, input }) => {
    const data = await ctx.db.post.findUnique({
      where: { id: input },
      include: {
        author: true,
        comments: {
          orderBy: { createdAt: 'desc' },
          include: { author: true },
        },
        _count: { select: { comments: true, likes: true } },
        likes: ctx.session.user ? { where: { userId: ctx.session.user.id } } : false,
      },
    })
    if (!data) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    return {
      id: data.id,
      content: data.content,
      image: data.image,
      createdAt: data.createdAt,
      author: data.author,
      isLiked: data.likes.length > 0,
      likes: data._count.likes,
      replies: data._count.comments,
      comments: data.comments,
    }
  }),

  // [POST]
  create: trpc.protectedProcedure.input(post.createSchema).mutation(async ({ ctx, input }) => {
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

  comment: trpc.protectedProcedure.input(post.commentSchema).mutation(async ({ ctx, input }) => {
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

  likes: trpc.protectedProcedure.input(post.string).mutation(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({ where: { id: input } })
    if (!post) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    const liked = await ctx.db.like.findFirst({
      where: { postId: input, userId: ctx.session.user.id },
    })

    if (liked) {
      await ctx.db.like.delete({ where: { id: liked.id } })
    } else {
      await ctx.db.like.create({
        data: {
          post: { connect: { id: input } },
          user: { connect: { id: ctx.session.user.id } },
        },
      })
    }
  }),

  // [PATCH]
  update: trpc.protectedProcedure.input(post.updateSchema).mutation(async ({ ctx, input }) => {
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

    revalidatePath(`/u/${ctx.session.user.id}`)
    revalidatePath(`/p/${input.id}`)
    revalidatePath('/')
    return updatedPost
  }),

  updateComment: trpc.protectedProcedure.input(post.updateCommentSchema).mutation(async ({ ctx, input }) => {
    const comment = await ctx.db.comment.findUnique({ where: { id: input.id } })
    if (!comment) throw new TRPCError({ message: 'Comment not found', code: 'NOT_FOUND' })

    if (comment.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this comment", code: 'FORBIDDEN' })

    const updatedComment = await ctx.db.comment.update({
      where: { id: input.id },
      data: { content: input.comment },
    })

    if (!updatedComment) throw new TRPCError({ message: 'Failed to update comment', code: 'INTERNAL_SERVER_ERROR' })

    revalidatePath(`/p/${comment.postId}`)
    return updatedComment
  }),

  // [DELETE]
  delete: trpc.protectedProcedure.input(post.string).mutation(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({ where: { id: input } })
    if (!post) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    if (post.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this post", code: 'FORBIDDEN' })
    await ctx.db.comment.deleteMany({ where: { postId: input } })
    await ctx.db.post.delete({ where: { id: input } })

    revalidatePath(`/u/${ctx.session.user.id}`)
    revalidatePath('/')
    return true
  }),

  deleteComment: trpc.protectedProcedure.input(post.string).mutation(async ({ ctx, input }) => {
    const comment = await ctx.db.comment.findUnique({ where: { id: input } })
    if (!comment) throw new TRPCError({ message: 'Comment not found', code: 'NOT_FOUND' })

    if (comment.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this comment", code: 'FORBIDDEN' })
    await ctx.db.comment.delete({ where: { id: input } })

    revalidatePath(`/p/${comment.postId}`)
    return true
  }),

  deleteImage: trpc.protectedProcedure.input(post.string).mutation(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({ where: { id: input } })
    if (!post) throw new TRPCError({ message: 'Post not found', code: 'NOT_FOUND' })

    if (post.authorId !== ctx.session.user.id)
      throw new TRPCError({ message: "You aren't the author of this post", code: 'FORBIDDEN' })

    const updatedPost = await ctx.db.post.update({
      where: { id: input },
      data: { image: '' },
    })

    if (!updatedPost) throw new TRPCError({ message: 'Failed to delete image', code: 'INTERNAL_SERVER_ERROR' })

    revalidatePath(`/u/${ctx.session.user.id}`)
    revalidatePath(`/p/${input}`)
    revalidatePath('/')

    return post.image
  }),
})
