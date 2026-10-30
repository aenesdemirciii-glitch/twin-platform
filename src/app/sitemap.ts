import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ikizlerbaharatcilik.com'

  let products: { slug: string; updatedAt: Date }[] = []
  let categories: { slug: string; updatedAt: Date }[] = []
  let blogs: { slug: string; updatedAt: Date }[] = []

  try {
    // Fetch dynamic routes
    products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    categories = await prisma.category.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    })

    blogs = await prisma.blogPost.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
  } catch (error) {
    console.warn("Could not fetch dynamic routes for sitemap during build:", error)
  }

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kategoriler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Add dynamic product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/urun/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Add dynamic category routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/kategori/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Add dynamic blog routes
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...productRoutes, ...categoryRoutes, ...blogRoutes]
}
