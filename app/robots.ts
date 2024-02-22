const baseUrl = process.env.NODE_ENV === 'production' ? process.env.VERCEL_URL : 'http://localhost:3000'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
