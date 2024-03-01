import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/lib/site'
import { auth } from '@/server/auth'
import { Button } from '../ui/button'
import Menu from './menu'
import Nav from './nav'

const Header: NextPage = async () => {
  const session = await auth()
  return (
    <header className="sticky inset-0 z-40 bg-background/70 py-4 backdrop-blur-xl backdrop-saturate-150">
      <div className="container grid grid-cols-2 place-items-end gap-4 md:grid-cols-3">
        <Link href="/" className="flex items-center gap-2 place-self-start whitespace-nowrap text-xl font-bold">
          <Image src="/logo.svg" alt={siteConfig.applicationName} className="dark:invert" width={32} height={32} />
          <span>{siteConfig.applicationName}</span>
        </Link>

        <div className="block md:hidden">
          {!session?.user ? (
            <Link href="/auth/signin" passHref legacyBehavior>
              <Button variant="ghost">Login</Button>
            </Link>
          ) : (
            <Menu />
          )}
        </div>

        {session?.user && <Nav userId={session.user.id} />}

        <div className="hidden md:block">
          {!session?.user ? (
            <Link href="/auth/signin" passHref legacyBehavior>
              <Button variant="ghost">Login</Button>
            </Link>
          ) : (
            <Menu />
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
