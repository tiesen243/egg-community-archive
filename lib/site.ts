export type SiteConfig = typeof siteConfig

export const baseUrl =
  process.env.NODE_ENV === 'production' ? 'https://egg-community.vercel.app' : 'http://localhost:3000'

export const siteConfig = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Egg Community',
    template: '%s | Egg Community',
  },
  description: 'A simple socials platform for egg antifan built with Next.js, Prisma, and tRPC.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  authors: { name: 'Tiesen', url: 'https://tiesen.id.vn' },
  keywords: ['egg', 'community', 'antifan', 'socials', 'platform', 'next.js', 'prisma', 'trpc'],
  applicationName: 'Egg Community',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: baseUrl,
    title: {
      default: 'Egg Community',
      template: '%s | Egg Community',
    },
    description: 'A simple socials platform for egg antifan built with Next.js, Prisma, and tRPC.',
    siteName: 'Egg Community',
  },
  twitter: {
    title: {
      default: 'Egg Community',
      template: '%s | Egg Community',
    },
    description: 'A simple socials platform for egg antifan built with Next.js, Prisma, and tRPC.',
    card: 'summary_large_image',
    site: '@egg_community',
    creator: 'Tiesen',
    creatorId: '@tiesen243',
  },
  alternates: {
    canonical: baseUrl,
  },
}
