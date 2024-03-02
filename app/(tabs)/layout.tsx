import Nav from '@/components/nav'
import { auth } from '@/server/auth'

const TabsLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const session = await auth()
  return (
    <>
      {children}
      {session?.user && (
        <footer className="sticky bottom-0 left-0 z-50 block border-t bg-background/70 py-2 backdrop-blur-xl backdrop-saturate-150 md:hidden">
          <Nav className="container" />
        </footer>
      )}
    </>
  )
}

export default TabsLayout
