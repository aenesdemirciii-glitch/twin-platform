import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-hoppo-twin/', '/api/'],
    },
    sitemap: 'https://ikizlerbaharatcilik.com/sitemap.xml',
  }
}
