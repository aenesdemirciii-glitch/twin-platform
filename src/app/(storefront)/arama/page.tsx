import Link from "next/link"
import { ArrowRight } from "lucide-react"
import prisma from "@/lib/prisma"

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";

  // Perform a simple case-insensitive search across name and descriptions
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q } },
        { shortDescription: { contains: q } }
      ]
    },
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 min-h-[60vh]">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-black text-brand-slate mb-3">
          Arama Sonuçları
        </h1>
        {q ? (
          <p className="text-brand-slate/70 font-semibold text-lg">
            "<span className="text-brand-gold font-bold">{q}</span>" için {products.length} sonuç bulundu.
          </p>
        ) : (
          <p className="text-brand-slate/70 font-semibold text-lg">
            Arama yapmak için yukarıdaki arama kutusuna bir kelime yazın.
          </p>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((prod) => (
            <Link href={`/urun/${prod.slug}`} key={prod.id} className="bg-white rounded-2xl overflow-hidden border-2 border-brand-slate/10 flex flex-col group hover:border-brand-gold transition-colors block">
              <div className="relative w-full pb-[100%] bg-brand-slate/5 overflow-hidden">
                {prod.images && prod.images[0] ? (
                  <img src={prod.images[0].url} alt={prod.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { if (e.currentTarget.src.includes('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.jpg', '.webp') }} />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-brand-slate/40 font-bold text-xs lg:text-base">Ürün Görseli</span>
                )}
              </div>
              <div className="p-3 lg:p-5 flex flex-col flex-1 border-t border-brand-slate/5">
                <h3 className="font-bold text-sm lg:text-base mb-2 line-clamp-2 text-brand-slate group-hover:text-brand-gold transition-colors">{prod.name}</h3>
                <div className="mt-auto pt-2">
                  <p className="text-base lg:text-xl font-black text-brand-slate mb-3">{Number(prod.price).toLocaleString('tr-TR')} TL</p>
                  <button className="w-full bg-brand-slate text-white font-bold py-2 lg:py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-slate transition-colors text-xs lg:text-sm">
                    İncele
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-slate/5 rounded-2xl border-2 border-dashed border-brand-slate/20">
          <p className="text-brand-slate/70 font-semibold text-lg mb-4">Aradığınız kelimeye uygun bir ürün bulamadık.</p>
          <Link href="/kategoriler" className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-slate font-black px-6 py-3 rounded-lg hover:bg-white hover:text-brand-slate hover:border-brand-gold border-2 border-brand-gold transition-all shadow-md">
            Tüm Kategorileri İncele <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
