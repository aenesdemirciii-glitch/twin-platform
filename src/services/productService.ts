import prisma from "@/lib/prisma"
import productDescriptions from "@/data/productDescriptions.json"

function normalizeTitle(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '')
}

export async function getProductBySlug(slug: string) {
  try {
    let product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        attributes: true,
        category: true,
        brand: true,
      }
    })

    // If not found, check alternative slug for winter package
    if (!product && (slug === 'k-paketi' || slug === 'kis-paketi')) {
      const altSlug = slug === 'k-paketi' ? 'kis-paketi' : 'k-paketi'
      product = await prisma.product.findUnique({
        where: { slug: altSlug },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          attributes: true,
          category: true,
          brand: true,
        }
      })
    }

    // Secondary fallback for winter package by name if still not found
    if (!product && (slug === 'k-paketi' || slug === 'kis-paketi')) {
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { name: { contains: 'Kış Paketi' } },
            { name: { contains: 'Kis Paketi' } }
          ],
          isActive: true
        },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          attributes: true,
          category: true,
          brand: true,
        }
      })
    }
    
    if (product) {
      // If winter package product has no images, provide the uploaded photo
      if ((product.slug === 'k-paketi' || product.slug === 'kis-paketi' || slug === 'k-paketi' || slug === 'kis-paketi') && (!product.images || product.images.length === 0)) {
        product.images = [
          {
            id: 'kis-paketi-banner-img',
            productId: product.id,
            url: '/images/kis-paketi.jpg',
            sortOrder: 0,
            createdAt: new Date(),
          } as any
        ]
      }

      // If DB description is empty or default, fallback to Excel descriptions
      if (!product.shortDescription || product.shortDescription.trim() === '') {
        const targetNorm = normalizeTitle(product.name)
        const match = productDescriptions.find((item: any) => {
          const itemNorm = normalizeTitle(item.name)
          return itemNorm === targetNorm || itemNorm.includes(targetNorm) || targetNorm.includes(itemNorm)
        })
        if (match) {
          product.shortDescription = match.description
          product.longDescription = match.description
          if (!product.seoDescription) {
            product.seoDescription = match.seoDescription
          }
        }
      }
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getActiveProducts(params?: { categorySlug?: string, take?: number, skip?: number }) {
  try {
    const whereClause: any = { isActive: true }
    
    if (params?.categorySlug) {
      whereClause.category = { slug: params.categorySlug.toLowerCase() }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 }
      },
      take: params?.take || 20,
      skip: params?.skip || 0,
      orderBy: { createdAt: 'desc' }
    })
    
    return products
  } catch (error) {
    console.error("Error fetching active products:", error)
    return []
  }
}

export async function getCategoryData(slug: string, params?: { take?: number, skip?: number, sort?: string }) {
  try {
    const category = await prisma.category.findUnique({ where: { slug: slug.toLowerCase() } })
    
    const whereClause: any = { isActive: true, category: { slug: slug.toLowerCase() } }
    
    let orderBy: any = { createdAt: 'desc' }
    if (params?.sort === 'price_asc') orderBy = { price: 'asc' }
    if (params?.sort === 'price_desc') orderBy = { price: 'desc' }
    if (params?.sort === 'newest') orderBy = { createdAt: 'desc' }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 }
      },
      take: params?.take || 12,
      skip: params?.skip || 0,
      orderBy
    })
    
    const total = await prisma.product.count({ where: whereClause })
    
    return { category, products, total }
  } catch (error) {
    console.error("Error fetching category data:", error)
    return { category: null, products: [], total: 0 }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      }
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Admin function
export async function createProductFromDraft(draftData: any) {
  // Logic to convert draft JSON into a real DB product (status: false/draft)
  try {
    const product = await prisma.product.create({
      data: {
        name: draftData.name,
        slug: draftData.slug,
        sku: `SKU-${Date.now()}`,
        shortDescription: draftData.shortDescription,
        longDescription: draftData.longDescription,
        price: 0, // Admin needs to set price
        seoTitle: draftData.seoTitle,
        seoDescription: draftData.seoDescription,
        isActive: false, // Default false until admin approves
      }
    })
    return product
  } catch (error) {
    console.error("Error creating product from draft:", error)
    throw error
  }
}
