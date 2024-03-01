import type { NextPage } from 'next'
import Link from 'next/link'

import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { auth } from '@/server/auth'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Menu from './menu'
import Nav from './nav'

const Header: NextPage = async () => {
  const session = await auth()
  return (
    <header className="sticky inset-0 z-50 bg-background/70 py-4 backdrop-blur-xl backdrop-saturate-150">
      <div
        className={cn(
          'container grid gap-4 md:place-items-center',
          session?.user ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2',
        )}
      >
        <div className="flex justify-between">
          <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-xl font-bold">
            <Image src="/logo.svg" alt={siteConfig.applicationName} className="dark:invert" width={32} height={32} />
            <span>{siteConfig.applicationName}</span>
          </Link>

          <div className="block md:hidden">
            {!session?.user ? (
              <Link href="/auth/signin" passHref legacyBehavior>
                <Button variant="ghost">Login</Button>
              </Link>
            ) : (
              <MenuIcon />
            )}
          </div>
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
