import { LogOutIcon, MenuIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'

import * as dropdownMenu from '@/components/ui/dropdown-menu'
import { signOut } from '@/server/auth'
import ThemeBtn from './theme-btn'

const Menu: React.FC = () => {
  const logout = async () => {
    'use server'
    await signOut()
  }
  return (
    <dropdownMenu.DropdownMenu>
      <dropdownMenu.DropdownMenuTrigger>
        <MenuIcon size={24} />
      </dropdownMenu.DropdownMenuTrigger>

      <dropdownMenu.DropdownMenuContent align="end">
        <ThemeBtn />

        <Link href="/settings" passHref legacyBehavior>
          <dropdownMenu.DropdownMenuItem>
            <SettingsIcon className="mr-2" /> Settings
          </dropdownMenu.DropdownMenuItem>
        </Link>

        <dropdownMenu.DropdownMenuSeparator />

        <form action={logout} className="w-full">
          <dropdownMenu.DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOutIcon className="mr-2" />
              Logout
            </button>
          </dropdownMenu.DropdownMenuItem>
        </form>
      </dropdownMenu.DropdownMenuContent>
    </dropdownMenu.DropdownMenu>
  )
}

export default Menu
