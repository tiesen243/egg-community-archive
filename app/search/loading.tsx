import { FormField } from '@/components/form-field'
import { PostCardSkeleton } from '@/components/post/card'
import { Button } from '@/components/ui/button'
import type { NextPage } from 'next'

const Loading: NextPage = () => (
  <main className="container max-w-screen-md flex-grow space-y-4">
    <div className="flex gap-4">
      <FormField name="q" placeholder="Search" className="w-full" disabled />
      <Button type="submit" className="hidden md:block" disabled>
        Search
      </Button>
    </div>

    {Array.from({ length: 5 }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </main>
)

export default Loading
