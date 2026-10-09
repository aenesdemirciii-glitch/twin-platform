import prisma from "@/lib/prisma"
import { FastUploaderClient } from "./FastUploaderClient"

export default async function HizliGorselPage() {
  // Görseli olmayan tüm ürünleri getir (sadece id ve name yeterli)
  const productsWithoutImages = await prisma.product.findMany({
    where: {
      images: { none: {} }
    },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hızlı Görsel Yükleyici</h2>
          <p className="text-sm text-slate-500 mt-1">Görseli olmayan ürünlere sırayla ve hızlıca fotoğraf ekleyin.</p>
        </div>
      </div>

      <FastUploaderClient products={productsWithoutImages} />
    </div>
  )
}
