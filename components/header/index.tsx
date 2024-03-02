import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/lib/site'
import { auth } from '@/server/auth'
import { Button } from '../ui/button'
import Menu from './menu'
import Nav from '../nav'
import { cn } from '@/lib/utils'

const Header: NextPage = async () => {
  const session = await auth()
  return (
    <header className="sticky inset-0 z-50 border-b bg-background/70 py-4 backdrop-blur-xl backdrop-saturate-150">
      <div
        className={cn('container flex items-center justify-between gap-4', {
          'place-items-center md:grid md:grid-cols-3': session?.user,
        })}
      >
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-xl font-bold">
          <Image
            src="/logo.svg"
            alt={siteConfig.applicationName.toLowerCase().replace(/\s/g, '-')}
            className="dark:invert"
            width={32}
            height={32}
          />
          <span>{siteConfig.applicationName}</span>
        </Link>

        {session?.user && <Nav className="hidden md:flex" />}

        <div>
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
