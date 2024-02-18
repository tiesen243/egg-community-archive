'use client'

import { Loader2Icon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export const ThemeBtn: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => setMounted(true), [])
  if (!mounted)
    return (
      <Button variant="outline" size="icon">
        <Loader2Icon className="animate-spin" />
      </Button>
    )
  return (
    <Button onClick={toggleTheme} variant="outline" size="icon">
      <SunIcon className={theme === 'dark' ? 'hidden' : 'block'} />
      <MoonIcon className={theme === 'dark' ? 'block' : 'hidden'} />
    </Button>
  )
}
