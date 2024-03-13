'use client'

import { PostCard, PostCardSkeleton, PublicPostCard } from '@/components/post/card'
import { api } from '@/lib/trpc/client'
import Link from 'next/link'

export const PublicPosts: React.FC = () => {
  const { data, isLoading, isError, error } = api.post.getAll.useQuery()
  if (isLoading) return <PostCardSkeleton />
  if (isError) return <span>{error?.message}</span>

  return (
    <>
      <p className="text-center text-xl font-bold">
        <Link href="/auth/login" className="mr-2 text-blue-500">
          Login here
        </Link>
        to unlock more content and features
      </p>
      {data.map((post) => (
        <PublicPostCard key={post.id} post={post} />
      ))}
    </>
  )
}

export const AuthPosts: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = api.post.getAllWithAuth.useQuery()
  if (isLoading) return <PostCardSkeleton />
  if (isError) return <span>{error?.message}</span>

  return data.map((post) => <PostCard key={post.id} post={post} refetch={refetch} />)
}
