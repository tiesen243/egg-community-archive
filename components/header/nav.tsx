'use client'

import { HomeIcon, PencilIcon, RssIcon, SearchIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

const Nav: React.FC<{ userId: string }> = ({ userId }) => {
  const pathName = usePathname()
  const links = [
    {
      href: '/',
      icon: HomeIcon,
    },
    {
      href: '/followers',
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
    <nav className="flex w-full select-none items-center justify-between">
      {links.map(({ href, icon: Icon }) => (
        <Link key={href} href={href} passHref legacyBehavior>
          <Button variant="ghost" size="lg" className="backdrop-blur-xl backdrop-saturate-150 hover:bg-secondary/70">
            <Icon className={`cursor-pointer ${pathName === href ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </Link>
      ))}
    </nav>
  )
}

export default Nav
