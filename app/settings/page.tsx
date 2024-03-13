'use client'

import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as card from '@/components/ui/card'
import { fileToBase64 } from '@/lib/cloudinary'
import { api } from '@/lib/trpc/client'

const Page: NextPage = () => {
  const { data, status } = useSession()

  const [preview, setPreview] = useState<string | null>()
  const { mutate, error, isLoading } = api.user.update.useMutation()
  const { refresh } = useRouter()
  if (status === 'unauthenticated') return null

  const action = async (formData: FormData) => {
    mutate({
      name: String(formData.get('name')),
      bio: String(formData.get('bio')),
      image: (formData.get('image') as File).size > 0 ? await fileToBase64(formData) : undefined,
    })
    refresh()
  }
  return (
    <card.Card>
      <card.CardHeader>
        <card.CardTitle>Information</card.CardTitle>
        <card.CardDescription>Update your personal information</card.CardDescription>
      </card.CardHeader>

      <form action={action}>
        <card.CardContent className="space-y-4">
          <FormField
            name="name"
            label="Name"
            defaultValue={data?.user.name}
            message={String(error?.data?.zodError?.fieldErrors.name ?? '')}
          />
          <FormField
            name="bio"
            label="Bio"
            defaultValue={data?.user.bio ?? ''}
            message={String(error?.data?.zodError?.fieldErrors.bio ?? '')}
            multiline
          />
          <FormField
            name="image"
            label="Profile picture"
            type="file"
            onChange={(e: any) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onloadend = () => setPreview(reader.result as string)
                reader.readAsDataURL(file)
              }
            }}
          />

          <Image
            src={preview || data?.user.image || ''}
            alt="Profile picture"
            width={150}
            height={150}
            className="mx-auto aspect-square rounded-full object-cover"
          />
        </card.CardContent>

        <card.CardFooter>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Save changes
          </Button>
        </card.CardFooter>
      </form>
    </card.Card>
  )
}

export default Page
