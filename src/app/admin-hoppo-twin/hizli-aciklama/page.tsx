import prisma from "@/lib/prisma"
import { FastDescriptionClient } from "./FastDescriptionClient"

export const dynamic = "force-dynamic"

export default async function FastDescriptionPage() {
  const products = await prisma.product.findMany({
    orderBy: [
      { category: { name: 'asc' } },
      { name: 'asc' }
    ],
    include: {
      category: true,
      images: {
        orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }],
        take: 1
      }
    }
  })

  const initialProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    categoryName: p.category?.name || "Kategorisiz",
    imageUrl: p.images?.[0]?.url || null,
    shortDescription: p.shortDescription || null,
    longDescription: p.longDescription || null,
  }))

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          Ürün Açıklamaları Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sitedeki tüm ürünlerin kısa ve detaylı açıklamalarını, faydalarını ve kullanım talimatlarını tek bir sayfadan hızlıca yazın ve güncelleyin.
        </p>
      </div>

      <FastDescriptionClient initialProducts={initialProducts} />
    </div>
  )
}
