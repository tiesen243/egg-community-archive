'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { useTheme } from 'next-themes'

const ThemeBtn: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <DropdownMenuItem onClick={toggleTheme}>
      {theme === 'dark' ? <SunIcon className="mr-2" /> : <MoonIcon className="mr-2" />}
      {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </DropdownMenuItem>
  )
}

export default ThemeBtn
