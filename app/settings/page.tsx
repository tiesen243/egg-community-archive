'use client'

import type { User } from '@prisma/client'
import { Loader2Icon } from 'lucide-react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import * as card from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { updateProfile } from '@/server/actions'

interface Error {
  name?: string
  bio?: string
}

const Page: NextPage = () => {
  const { data, status } = useSession()
  const [error, setError] = useState<Error>({})
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
    <TabsContent value="info">
      <card.Card>
        <card.CardHeader>
          <card.CardTitle>Information</card.CardTitle>
          <card.CardDescription>Update your personal information</card.CardDescription>
        </card.CardHeader>

        <form action={action}>
          <card.CardContent>
            {fields.map((field) => (
              <FormField
                key={field.name}
                {...field}
                {...(field.type !== 'file'
                  ? { defaultValue: String(data?.user[field.name as keyof User]) }
                  : { accept: 'image/*' })}
                message={error?.[field.name as keyof Error]}
              />
            ))}
          </card.CardContent>

          <SubmitButton />
        </form>
      </card.Card>
    </TabsContent>
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

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'text',
    multiline: true,
  },
  {
    name: 'image',
    label: 'Profile picture',
    type: 'file',
  },
]
