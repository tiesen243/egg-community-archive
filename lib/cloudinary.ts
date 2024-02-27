import { v2 as cloudinary } from 'cloudinary'
import mime from 'mime'

cloudinary.config({
  cloud_name: process.env.CLD_NAME!,
  api_key: process.env.CLD_API_KEY!,
  api_secret: process.env.CLD_API_SECRET!,
})

export const saveFile = async (file: File, folder: 'avatar' | 'post') => {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const base64File = Buffer.from(buffer).toString('base64')
  const fileMimeType = mime.getType(file.name)
  const result = await new Promise<{ url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: `egg-community/${folder}` }, function (error, result) {
        if (error || result === undefined) {
          reject(error || new Error('Upload result is undefined.'))
          return
        }
        resolve(result)
      })
      .end(`data:${fileMimeType};base64,${base64File}`)
  })

  return result.url
}

export const deleteFile = async (url: string) => {
  const publicId = url.split('/').slice(-3).join('/').split('.')[0]
  await cloudinary.uploader.destroy(publicId)
}
