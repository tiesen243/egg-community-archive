import { z } from 'zod'

export const createSchema = z.object({
  content: z.string().min(4).max(2000),
  image: z.optional(z.string()).or(z.string().url()),
})

export type CreateInput = z.infer<typeof createSchema>

export const commentSchema = z.object({
  id: z.string(),
  comment: z.string().min(4).max(500),
})

export type CommentInput = z.infer<typeof commentSchema>

export const updateSchema = z.object({
  id: z.string(),
  content: z.string().min(4).max(2000),
  image: z.optional(z.string()).or(z.string().url()),
})

export type UpdateInput = z.infer<typeof updateSchema>

export const updateCommentSchema = z.object({
  id: z.string(),
  content: z.string().min(4).max(500),
})

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>

export const id = z.string()
