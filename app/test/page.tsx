import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { saveFile } from '@/lib/cloudinary'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  const action = async (formData: FormData) => {
    'use server'
    const file = formData.get('file') as File
    const url = await saveFile(file, 'post')
    console.log(url)
  }
  return (
    <form action={action}>
      <FormField name="file" type="file" accept="image/*" />
      <Button type="submit">Create</Button>
    </form>
  )
}

export default Page
