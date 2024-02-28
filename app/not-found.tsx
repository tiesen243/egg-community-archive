import { buttonVariants } from '@/components/ui/button'
import type { NextPage } from 'next'
import Link from 'next/link'

const NotFound: NextPage = () => (
  <main className="flex min-h-[90dvh] flex-grow flex-col items-center justify-center gap-16">
    <article className="space-y-8">
      <h1 className="text-7xl font-black">Egg!!</h1>
      <p className="text-lg font-medium">404 | Page Not Found</p>
    </article>

    <Link href="/" className={buttonVariants({ variant: 'default' })}>
      Go back home
    </Link>
  </main>
)

export default NotFound
