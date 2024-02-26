'use server'

import { deleteFile, saveFile } from '@/lib/cloudinary'
import { api } from '@/lib/trpc/server'
import { createSchema, updateSchema as updatePostSchema } from './schemas/post'
import { updateSchema as updateUserSchema } from './schemas/user'

export const updateProfile = async (formData: FormData) => {
  let url: string = ''

  try {
    const file = formData.get('image') as File
    url = file.size > 0 ? await saveFile(file, 'avatar') : ''
    const valid = await updateUserSchema.safeParseAsync({ ...Object.fromEntries(formData), image: url })
    if (!valid.success)
      throw new Error('Invalid form data. Please check the fields and try again.', {
        cause: valid.error.flatten().fieldErrors,
      })

    await api.user.update.mutate(valid.data)

    return {
      message: 'Profile updated',
    }
  } catch (e: any) {
    url && (await deleteFile(url))

    return {
      error: e.message,
      cause: e.cause,
    }
  }
}

export const createPost = async (formData: FormData) => {
  let url: string = ''

  try {
    const file = formData.get('image') as File
    url = file.size > 0 ? await saveFile(file, 'post') : ''
    const valid = await createSchema.safeParseAsync({ ...Object.fromEntries(formData), image: url })
    if (!valid.success)
      throw new Error('Invalid form data. Please check the fields and try again.', {
        cause: valid.error.flatten().fieldErrors,
      })

    await api.post.create.mutate(valid.data)

    return {
      message: 'Post created',
    }
  } catch (e: any) {
    url && (await deleteFile(url))

    return {
      error: e.message,
      cause: e.cause,
    }
  }
}

export const updatePost = async (formData: FormData) => {
  let url: string = ''

  try {
    const file = formData.get('image') as File
    url = file.size > 0 ? await saveFile(file, 'post') : ''
    const valid = await updatePostSchema.safeParseAsync({ ...Object.fromEntries(formData), image: url })
    if (!valid.success)
      throw new Error('Invalid form data. Please check the fields and try again.', {
        cause: valid.error.flatten().fieldErrors,
      })

    await api.post.update.mutate(valid.data)

    return {
      message: 'Post updated',
    }
  } catch (e: any) {
    url && (await deleteFile(url))
    return {
      error: e.message,
      cause: e.cause,
    }
  }
}
