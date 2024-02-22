import { z } from 'zod'

export const createSchema = z.object({
  content: z
    .string()
    .min(4, {
      message: 'Post must be at least 4 characters long',
    })
    .max(2000, {
      message: 'Post must be at most 2000 characters long',
    }),
  image: z.optional(z.string()).or(z.string().url({ message: 'Image must be a valid URL' })),
})

export type CreateInput = z.infer<typeof createSchema>

export const commentSchema = z.object({
  id: z.string(),
  comment: z
    .string()
    .min(4, {
      message: 'Comment must be at least 4 characters long',
    })
    .max(500, {
      message: 'Comment must be at most 500 characters long',
    }),
})
export type CommentInput = z.infer<typeof commentSchema>

export const updateSchema = createSchema.extend({ id: z.string() })
export type UpdateInput = z.infer<typeof updateSchema>

export const updateCommentSchema = commentSchema.extend({ id: z.string() })
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>

export const id = z.string()
