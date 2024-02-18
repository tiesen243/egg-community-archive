import { z } from 'zod'

export const createSchema = z.object({
  content: z.string().min(4).max(2000),
})

export type CreateInput = z.infer<typeof createSchema>

export const getByIdSchema = z.object({
  id: z.string(),
})

export type GetByIdInput = z.infer<typeof getByIdSchema>

export const commentSchema = z.object({
  id: z.string(),
  comment: z.string().min(4).max(500),
})

export type CommentInput = z.infer<typeof commentSchema>
