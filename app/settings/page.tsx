'use client'

import { Loader2Icon } from 'lucide-react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as card from '@/components/ui/card'
import { updateProfile } from '@/server/actions'

interface Error {
  name?: string
  bio?: string
}

const Page: NextPage = () => {
  const { data, status } = useSession()
  const [error, setError] = useState<Error>({})
  const [preview, setPreview] = useState<string | null>()
  const { refresh } = useRouter()
  if (status === 'unauthenticated') return null

  const action = async (formData: FormData) => {
    const res = await updateProfile(formData)
    if (res.error) {
      res.cause ? setError(res.cause) : setError({})
      return toast.error(res.error)
    }

    refresh()
    setError({})
    toast.success(res.message)
  }
  return (
    <card.Card>
      <card.CardHeader>
        <card.CardTitle>Information</card.CardTitle>
        <card.CardDescription>Update your personal information</card.CardDescription>
      </card.CardHeader>

      <form action={action}>
        <card.CardContent className="space-y-4">
          <FormField name="name" label="Name" defaultValue={data?.user.name} message={error.name} />
          <FormField name="bio" label="Bio" defaultValue={data?.user.bio ?? ''} message={error.bio} multiline />
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

        <SubmitButton />
      </form>
    </card.Card>
  )
}

export default Page

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus()
  return (
    <card.CardFooter>
      <Button type="submit" className="w-full" disabled={pending}>
        <Loader2Icon className={`mr-2 animate-spin ${pending ? 'block' : 'hidden'}`} />
        Save changes
      </Button>
    </card.CardFooter>
  )
}
