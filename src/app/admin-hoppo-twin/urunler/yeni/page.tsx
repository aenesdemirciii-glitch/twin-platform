import prisma from "@/lib/prisma"
import { ProductForm } from "./ProductForm"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Yeni Ürün Ekle</h2>
        <p className="text-sm text-slate-500 mt-1">Ürün detaylarını, fiyatlandırmayı ve görselleri girin.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
