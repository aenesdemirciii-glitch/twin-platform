import Link from "next/link"
import { SlidersHorizontal, ChevronDown } from "lucide-react"

export default function DiscountsPage() {
  const categoryName = "İndirimdeki Ürünler"

  const products = [
    { name: "Badem Kavrulmuş Tuzsuz", price: "819.00 TL", oldPrice: "950.00 TL", badge: "%15 İNDİRİM" },
    { name: "Antep Fıstığı Ekstra", price: "1.399.00 TL", oldPrice: "1.500.00 TL", badge: "%10 İNDİRİM" },
    { name: "Ceviz İçi Kelebek (Extra)", price: "749.00 TL", oldPrice: "850.00 TL", badge: "%12 İNDİRİM" },
    { name: "Armut İncir (Dağ İnciri)", price: "699.00 TL", oldPrice: "750.00 TL", badge: "%15 İNDİRİM" },
  ]

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="flex items-center gap-2 text-sm text-brand-slate/60 mb-6 font-bold uppercase tracking-wider text-xs">
        <Link href="/" className="hover:text-brand-gold transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-brand-slate">{categoryName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-end justify-between mb-10 pb-6 border-b-2 border-brand-slate/10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-brand-slate mb-3">
            {categoryName}
          </h1>
          <p className="text-brand-slate/70 font-semibold max-w-2xl">
            Kaçırılmayacak fırsatlarla taptaze lezzetler. Stoklar tükenmeden yetişin!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
          {/* Fiyat Aralığı */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input type="number" placeholder="En Az" className="w-full sm:w-24 px-3 py-2.5 bg-white border-2 border-brand-slate/20 rounded-lg text-sm font-bold text-brand-slate focus:border-brand-gold outline-none" />
            <span className="text-brand-slate/50 font-bold">-</span>
            <input type="number" placeholder="En Çok" className="w-full sm:w-24 px-3 py-2.5 bg-white border-2 border-brand-slate/20 rounded-lg text-sm font-bold text-brand-slate focus:border-brand-gold outline-none" />
            <button className="bg-brand-slate text-white font-black px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-slate transition-colors text-xs uppercase tracking-wider h-[44px] flex items-center">Bul</button>
          </div>

          {/* Sıralama */}
          <div className="relative w-full sm:w-56">
            <select className="w-full appearance-none bg-white border-2 border-brand-slate/20 text-brand-slate font-bold px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-gold cursor-pointer h-[44px]">
              <option>Akıllı Sıralama</option>
              <option>Fiyata Göre Artan</option>
              <option>Fiyata Göre Azalan</option>
              <option>En Çok Satanlar</option>
              <option>En Yeniler</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-slate pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {products.map((prod, i) => (
              <Link href={`/urun/ornek-urun-${i}`} key={i} className="bg-white rounded-2xl overflow-hidden border-2 border-brand-slate/10 flex flex-col group hover:border-brand-gold transition-colors">
                <div className="relative aspect-square bg-brand-slate/5 flex items-center justify-center">
                  <span className="text-brand-slate/40 font-bold text-xs lg:text-base">Ürün Görseli</span>
                  {prod.badge && (
                    <div className="absolute top-2 right-2 lg:top-3 lg:right-3 bg-brand-slate text-brand-gold text-[10px] lg:text-xs font-black px-2 py-1 rounded shadow-sm z-10 uppercase">
                      {prod.badge}
                    </div>
                  )}
                </div>
                <div className="p-3 lg:p-5 flex flex-col flex-1 border-t border-brand-slate/5">
                  <h3 className="font-bold text-sm lg:text-base mb-2 line-clamp-2 text-brand-slate group-hover:text-brand-gold transition-colors">{prod.name}</h3>
                  <div className="mt-auto pt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-base lg:text-xl font-black text-brand-slate">{prod.price}</p>
                      {prod.oldPrice && (
                        <p className="text-xs lg:text-sm font-semibold text-brand-slate/40 line-through">{prod.oldPrice}</p>
                      )}
                    </div>
                    <button className="w-full bg-brand-slate text-white font-bold py-2 lg:py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-slate transition-colors text-xs lg:text-sm">
                      İncele
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
