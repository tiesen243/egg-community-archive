import Nav from '@/components/nav'

const TabsLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <footer className="sticky bottom-0 left-0 z-50 block border-t bg-background/70 py-2 backdrop-blur-xl backdrop-saturate-150 md:hidden">
      <Nav className="container" />
    </footer>
  </>
)

export default TabsLayout
