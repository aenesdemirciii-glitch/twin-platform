import prisma from "@/lib/prisma"
import { FastUploaderClient } from "./FastUploaderClient"

export const dynamic = "force-dynamic"

export default async function HizliGorselPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        images: {
          select: {
            id: true,
            url: true,
            isMain: true,
          },
          orderBy: {
            isMain: 'desc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc'
      }
    })
  ])

  // Client bileşenine güvenli veri aktarımı (Prisma Decimal -> Number)
  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: Number(p.price),
    categoryId: p.categoryId,
    categoryName: p.category?.name || "Kategorisiz",
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      isMain: img.isMain,
    })),
    hasImage: p.images.length > 0,
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hızlı Görsel Yükleyici</h1>
          <p className="text-sm text-slate-500 mt-1">
            Görseli eksik olan ürünleri inceleyin, sihirbaz moduyla sırayla veya toplu listeden anında fotoğraflarını yükleyin.
          </p>
        </div>
      </div>

      <FastUploaderClient 
        initialProducts={serializedProducts} 
        categories={categories} 
      />
    </div>
  )
}
