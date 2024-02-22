import { baseUrl } from '@/lib/site'
import db from '@/prisma'
import type { MetadataRoute } from 'next'

interface Route {
  url: string
  lastModified: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = ['', 'search', 'auth/register', 'auth/signin'].map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date().toISOString(),
  }))

  const usersPromise = await db.user.findMany().then((res) =>
    res.map((user) => ({
      url: `${baseUrl}/u/${user.id}`,
      lastModified: new Date().toISOString(),
    })),
  )

  const blogsPromise = await db.post.findMany().then((res) =>
    res.map((post) => ({
      url: `${baseUrl}/p/${post.id}`,
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
