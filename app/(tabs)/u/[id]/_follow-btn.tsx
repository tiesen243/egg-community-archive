'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/trpc/client'
import type { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const FollowBtn: React.FC<{ user: User & { isFollowing: boolean } }> = ({ user }) => {
  const { refresh } = useRouter()
  const { mutate, isLoading } = api.user.follow.useMutation({
    onSuccess: (data) => {
      toast.success(`You are now ${data.addFollow ? 'following' : 'unfollowing'} ${user.name}`)
      refresh()
    },
  })
  return (
    <form className="w-full" action={() => mutate(user.id)}>
      <Button className="w-full" isLoading={isLoading}>
        {user.isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </form>
  )
}

export default FollowBtn
