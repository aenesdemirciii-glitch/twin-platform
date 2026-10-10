import prisma from "@/lib/prisma"
import { FastPriceClient } from "./FastPriceClient"

export const dynamic = "force-dynamic"

export default async function FastPricePage() {
  const rawProducts = await prisma.product.findMany({
    orderBy: { category: { name: 'asc' } },
    include: { category: true }
  })

  // Format data for the client
  const initialProducts = rawProducts.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
    stock: p.stock,
    categoryName: p.category?.name || "Kategorisiz"
  }))

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
