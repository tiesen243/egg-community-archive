import { siteConfig } from '@/lib/site'
import db from '@/prisma'
import { MetadataRoute } from 'next'

interface Route {
  url: string
  lastModified: string
}

const baseUrl = process.env.NODE_ENV === 'production' ? siteConfig.alternates.canonical : 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  const usersPromise = await db.user.findMany().then((res) =>
    res.map((user) => ({
      url: `${baseUrl}u/${user.id}`,
      lastModified: new Date().toISOString(),
    })),
  )

  const blogsPromise = await db.post.findMany().then((res) =>
    res.map((post) => ({
      url: `${baseUrl}p/${post.id}`,
      lastModified: new Date().toISOString(),
    })),
  )

  let fetchedRoutes: Route[] = []
  try {
    fetchedRoutes = (await Promise.all([usersPromise, blogsPromise])).flat()
  } catch (error) {
    throw JSON.stringify(error, null, 2)
  }
  return [...routesMap, ...fetchedRoutes]
}
