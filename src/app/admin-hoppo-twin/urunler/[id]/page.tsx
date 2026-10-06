import prisma from "@/lib/prisma"
import { ProductForm } from "../yeni/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!product) {
    notFound()
  }

  // Serialize safely to pass to Client Component
  const serializedProduct = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    price: product.price.toString(),
    stock: product.stock,
    isActive: product.isActive,
    images: product.images.map(img => ({
      url: img.url,
      sourceUrl: img.sourceUrl,
      creator: img.creator,
    })),
  }

  const cleanCategories = categories.map(c => ({
    id: c.id,
    name: c.name
  }))

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Ürün Düzenle: {product.name}</h2>
        <p className="text-sm text-slate-500 mt-1">Ürün detaylarını, fiyatlandırmayı ve görselleri güncelleyin.</p>
      </div>

      <ProductForm categories={cleanCategories} initialData={serializedProduct} />
    </div>
  )
}
