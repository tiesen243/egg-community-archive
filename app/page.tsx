'use client'

import { api } from '@/lib/trpc/client'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  const { data, isLoading } = api.post.getAll.useQuery()
  if (isLoading) return <div>Loading...</div>

  return <div>dasasda</div>
}

export default Page
