import prisma from "@/lib/prisma"
import { FastPriceClient } from "./FastPriceClient"

export const dynamic = "force-dynamic"

export default async function FastPricePage() {
  const rawProducts = await prisma.product.findMany({
    orderBy: { category: { name: 'asc' } },
    include: { category: true, variants: true }
  })

  // Format data for the client
  const initialProducts: any[] = []
  
  rawProducts.forEach(p => {
    // 1. Ürünün Kendisi
    initialProducts.push({
      id: p.id,
      isVariant: false,
      name: p.name,
      sku: p.sku,
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      stock: p.stock,
      categoryName: p.category?.name || "Kategorisiz"
    })

    // 2. Ürünün Varyasyonları (Varsa)
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        initialProducts.push({
          id: v.id,
          isVariant: true,
          name: `↳ ${p.name} - ${v.name}`,
          sku: v.sku,
          price: v.price ? Number(v.price) : Number(p.price),
          discountPrice: v.discountPrice ? Number(v.discountPrice) : null,
          stock: v.stock,
          categoryName: "Varyasyon"
        })
      })
    }
  })

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          Hızlı Fiyat & Stok Güncelleme
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Excel'e gerek kalmadan tüm ürünlerinizin fiyat ve stok bilgilerini tek bir ekrandan hızlıca düzenleyin.
        </p>
      </div>

      <FastPriceClient initialProducts={initialProducts} />
    </div>
  )
}
