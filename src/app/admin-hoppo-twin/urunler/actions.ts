"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createProduct(data: any) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  const { name, sku, categoryId, price, stock, isActive, images } = data

  if (!name || !sku || !price) {
    throw new Error("İsim, SKU ve Fiyat zorunludur.")
  }

  // Create base slug
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
  
  if (!slug) slug = "urun-" + Date.now()

  // Generate unique slug
  let uniqueSlug = slug
  let counter = 1
  while (true) {
    const existingSlug = await prisma.product.findUnique({ where: { slug: uniqueSlug } })
    if (!existingSlug) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  // Handle unique sku
  const existingSku = await prisma.product.findUnique({ where: { sku } })
  if (existingSku) {
    throw new Error("Bu SKU kodu zaten kullanılıyor.")
  }

  // Prepare images data
  const productImages = images?.map((img: any, index: number) => ({
    url: img.url,
    altText: name,
    isMain: index === 0,
    sortOrder: index,
    sourceUrl: img.sourceUrl || null,
    creator: img.creator || null
  })) || []

  // Create Product
  const product = await prisma.product.create({
    data: {
      name,
      slug: uniqueSlug,
      sku,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      categoryId: categoryId || null,
      isActive: isActive === true,
      images: {
        create: productImages
      }
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "CREATE",
      resource: "Product",
      details: `Yeni ürün eklendi: ${name} (${sku})`
    }
  })

  revalidatePath("/admin-hoppo-twin/urunler")
  return { success: true, id: product.id }
}
