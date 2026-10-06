import prisma from "@/lib/prisma"
import { ProductForm } from "../yeni/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!product) {
    notFound()
  }

  // Serialize price to string or number to pass to Client Component safely
  const serializedProduct = {
    ...product,
    price: product.price.toString(),
  }

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Ürün Düzenle: {product.name}</h2>
        <p className="text-sm text-slate-500 mt-1">Ürün detaylarını, fiyatlandırmayı ve görselleri güncelleyin.</p>
      </div>

      <ProductForm categories={categories} initialData={serializedProduct} />
    </div>
  )
}
