import { z } from 'zod'

export const createSchema = z.object({
  content: z.string().min(4).max(2000),
  image: z.string().url().optional(),
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

export const updateSchema = z.object({
  id: z.string(),
  content: z.string().min(4).max(2000),
  image: z.string().url().optional(),
})

export type UpdateInput = z.infer<typeof updateSchema>
