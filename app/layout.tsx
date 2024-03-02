import { siteConfig } from '@/lib/site'
import type { Metadata, NextPage, Viewport } from 'next'
// SEO
export const metadata: Metadata = {
  metadataBase: siteConfig.metadataBase,
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  icons: siteConfig.icons,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  alternates: siteConfig.alternates,
  manifest: `${siteConfig.metadataBase}/manifest.webmanifest`,
}
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

// Font
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

// Layout Components
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'

import Provider from '@/components/provider'
import './globals.css'
import Nav from '@/components/nav'
const RootLayout: NextPage<React.PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.variable}>
      <Provider>
        <Header />
        {children}
        <Toaster />

        <footer className="sticky bottom-0 left-0 block border-t bg-background/70 py-2 backdrop-blur-xl backdrop-saturate-150 md:hidden">
          <Nav className="container" />
        </footer>
      </Provider>
    </body>
  </html>
)

export default RootLayout
