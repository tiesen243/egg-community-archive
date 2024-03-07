'use server'

import { v2 as cloudinary } from 'cloudinary'
import mime from 'mime'

cloudinary.config({
  cloud_name: process.env.CLD_NAME!,
  api_key: process.env.CLD_API_KEY!,
  api_secret: process.env.CLD_API_SECRET!,
})

export const saveFile = async (formData: FormData, folder: 'avatar' | 'post') => {
  const file = formData.get('image') as File
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const base64File = Buffer.from(buffer).toString('base64')
    const fileMimeType = mime.getType(file.name)
    const result = await cloudinary.uploader.upload(`data:${fileMimeType};base64,${base64File}`, {
      folder: `egg-community/${folder}`,
    })
    return { url: result.url }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteFile = async (url: string) => {
  const publicId = url.split('/').slice(-3).join('/').split('.')[0]
  await cloudinary.uploader.destroy(publicId)
}
