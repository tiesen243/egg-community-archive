import { Skeleton } from '@/components/ui/skeleton'
import type { NextPage } from 'next'

const Loading: NextPage = () => {
  return <Skeleton className="aspect-square w-full" />
}

export default Loading
