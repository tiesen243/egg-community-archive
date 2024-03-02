'use client'

import { ChevronLeftIcon, HomeIcon, PencilIcon, RssIcon, SearchIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Nav: React.FC<{ userId: string; className?: string }> = ({ userId, className = '' }) => {
  const pathName = usePathname()
  const { back } = useRouter()

  const links = [
    {
      href: '/',
      icon: HomeIcon,
    },
    {
      href: '/following',
      icon: RssIcon,
    },
    {
      href: '/search',
      icon: SearchIcon,
    },
    {
      href: '/create',
      icon: PencilIcon,
    },
    {
      href: `/u/${userId}`,
      icon: UserIcon,
    },
  ]

  return (
    <nav className={cn('flex w-full select-none items-center justify-between', className)}>
      {!links.some(({ href }) => href === pathName) && (
        <Button
          onClick={back}
          variant="ghost"
          className="w-full backdrop-blur-xl backdrop-saturate-150 hover:bg-secondary/70"
        >
          <ChevronLeftIcon />
        </Button>
      )}

      {links.map(({ href, icon: Icon }) => (
        <Link key={href} href={href} passHref legacyBehavior>
          <Button
            variant="ghost"
            size="lg"
            className="w-full backdrop-blur-xl backdrop-saturate-150 hover:bg-secondary/70"
          >
            <Icon className={`cursor-pointer ${pathName === href ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </Link>
      ))}
    </nav>
  )
}

export default Nav
