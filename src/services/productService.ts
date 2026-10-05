import prisma from "@/lib/prisma"

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        attributes: true,
        category: true,
        brand: true,
      }
    })
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
      whereClause.category = { slug: params.categorySlug }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { where: { isMain: true }, take: 1 }
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
