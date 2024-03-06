import type { Metadata, NextPage, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { api } from '@/lib/trpc/server'
import PostDetail from './_template'

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> => {
  try {
    const postDetail = await api.post.getByIdPublic.query(params.id)
    const previousImages = (await parent).openGraph?.images || []

    const title = `${postDetail.author.name} - ${postDetail.content.length > 20 ? postDetail.content.slice(0, 20) + '...' : postDetail.content}`

    return {
      title,
      description: postDetail.content,
      openGraph: {
        title,
        description: postDetail.content,
        images: [...(postDetail.image ? [{ url: postDetail?.image }] : []), ...previousImages],
      },
      twitter: {
        title,
        description: postDetail.content,
        images: [...(postDetail.image ? [{ url: postDetail?.image }] : []), ...previousImages],
      },
    }
  } catch (e: any) {
    notFound()
  }
}

const Page: NextPage<Props> = async ({ params }) => {
  try {
    const postDetail = await api.post.getById.query(params.id)

    return <PostDetail postDetail={postDetail} isAuth />
  } catch (e: any) {
    const postDetail = await api.post.getByIdPublic.query(params.id)

    return <PostDetail postDetail={postDetail} isAuth={false} />
  }
}

export default Page
