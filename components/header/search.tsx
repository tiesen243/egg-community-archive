import { SearchIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const Search: React.FC = () => {
  const search = async (formData: FormData) => {
    'use server'
    redirect(`/search?q=${formData.get('search')}`)
  }
  return (
    <form action={search} className="flex w-1/3 gap-2">
      <Input type="search" name="search" placeholder="Search..." />
      <Button type="submit" variant="outline" size="icon" className="hidden md:flex">
        <SearchIcon />
      </Button>
    </form>
  )
}

export default Search
