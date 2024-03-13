import type { NextPage } from 'next'
import { unstable_noStore as noStore } from 'next/cache'

import { auth } from '@/server/auth'
import { AuthPosts, PublicPosts } from './_home'

const Page: NextPage = async () => {
  noStore()
  const session = await auth()

  return (
    <main className="container max-w-screen-md flex-grow space-y-4">
      {!session || !session.user ? <PublicPosts /> : <AuthPosts />}
    </main>
  )
}

export default Page
