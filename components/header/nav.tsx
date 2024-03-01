'use client'

import { ChevronLeftIcon, HomeIcon, PencilIcon, RssIcon, SearchIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../ui/button'

const Nav: React.FC<{ userId: string }> = ({ userId }) => {
  const pathName = usePathname()
  const links = [
    {
      href: '/',
      icon: HomeIcon,
    },
    {
      href: '/followings',
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

  const { back } = useRouter()

  return (
    <nav className="col-span-2 flex w-full select-none items-center justify-between place-self-center md:col-span-1">
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
