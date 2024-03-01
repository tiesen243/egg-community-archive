import UserCard from '@/components/user-card'
import { api } from '@/lib/trpc/server'
import type { NextPage } from 'next'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params: { id } }) => {
  const user = await api.user.getFollowing.query(id)
  return (
    <main className="container max-w-screen-md flex-grow space-y-4">
      <h2 className="text-3xl font-bold">{user.name}&apos;s Followings</h2>
      {user.following.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </main>
  )
}

export default Page
