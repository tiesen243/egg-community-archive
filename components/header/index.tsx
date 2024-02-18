import { siteConfig } from '@/lib/site'
import type { NextPage } from 'next'
import Link from 'next/link'
import { ThemeBtn } from './btn'
import { Auth } from './auth'

const Header: NextPage = () => (
  <header className="sticky inset-0 z-50 border-b bg-background/70 py-4 backdrop-blur-xl backdrop-saturate-150">
    <div className="container flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-xl font-bold">
        {siteConfig.applicationName}
      </Link>
      <nav></nav>

      <section className="flex items-center gap-4">
        <Auth />
        <ThemeBtn />
      </section>
    </div>
  </header>
)

export default Header
