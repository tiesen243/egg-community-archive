import type { NextPage } from 'next'

const Page: NextPage = () => {
  return <div>{process.env.VERCEL_ENV!}</div>
}

export default Page
