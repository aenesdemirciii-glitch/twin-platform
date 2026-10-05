import Image from "next/image"
import { notFound } from "next/navigation"
// import { getProductBySlug } from "@/services/productService"
import { ShoppingCart, Heart, ShieldCheck, Truck } from "lucide-react"

// Mock Data for UI since DB isn't seeded yet
const MOCK_PRODUCT = {
  name: "Ekstra İri Kavrulmuş Antep Fıstığı",
  price: "450.00",
  discountPrice: "380.00",
  shortDesc: "Gaziantep'in en verimli bahçelerinden özenle seçilmiş, çifte kavrulmuş duble boy Antep Fıstığı.",
  longDesc: "Tadına doyulmaz lezzetiyle çay saatlerinin vazgeçilmezi. Tamamen doğal yollarla kurutulmuş ve özel taş fırınlarda tam kıvamında kavrulmuştur.",
  stock: 120,
  sku: "KRY-ANT-001",
  attributes: [
    { key: "Tuz Oranı", value: "Hafif Tuzlu" },
    { key: "Boyut", value: "İri (Duble)" },
    { key: "Kavrulma Durumu", value: "Çifte Kavrulmuş" },
  ]
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  // const product = await getProductBySlug(params.slug)
  // if (!product) notFound()
  const product = MOCK_PRODUCT

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <span>Ana Sayfa</span>
        <span>/</span>
        <span>Kuru Yemiş</span>
        <span>/</span>
        <span className="text-brand-slate font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images (Left) */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
            <span className="text-slate-400 font-medium text-lg">Ürün Görseli (Büyük)</span>
          </div>
          {/* Thumbnails removed per request */}
        </div>

        {/* Product Info (Right) */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-brand-slate mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-slate-600 leading-relaxed mb-6">
              {product.shortDesc}
            </p>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-extrabold text-brand-slate">{product.discountPrice || product.price} TL</span>
              {product.discountPrice && (
                <span className="text-xl text-slate-400 line-through font-medium">{product.price} TL</span>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-brand-slate">Gramaj Seçenekleri</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 border-2 border-brand-gold bg-brand-gold/10 text-brand-slate font-bold rounded-xl transition-colors">250g</button>
                <button className="px-5 py-2.5 border-2 border-slate-200 text-slate-600 hover:border-slate-300 font-medium rounded-xl transition-colors">500g</button>
                <button className="px-5 py-2.5 border-2 border-slate-200 text-slate-600 hover:border-slate-300 font-medium rounded-xl transition-colors">1kg</button>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-200 pt-8 mt-auto">
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden h-14 bg-white">
                <button className="px-4 py-2 hover:bg-slate-50 text-slate-600 transition-colors">-</button>
                <span className="px-4 font-bold text-brand-slate">1</span>
                <button className="px-4 py-2 hover:bg-slate-50 text-slate-600 transition-colors">+</button>
              </div>
              <button className="flex-1 bg-brand-slate text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                <ShoppingCart className="h-5 w-5" />
                Sepete Ekle
              </button>
              <button className="h-14 w-14 border border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors">
                <Heart className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <Truck className="h-6 w-6 text-brand-gold shrink-0" />
              <div>
                <p className="font-semibold text-sm text-brand-slate">Aynı Gün Kargo</p>
                <p className="text-xs text-slate-500 mt-1">15:00'a kadar verilen siparişlerde</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0" />
              <div>
                <p className="font-semibold text-sm text-brand-slate">Taze ve Güvenilir</p>
                <p className="text-xs text-slate-500 mt-1">Özenle paketlenmiş doğal ürünler</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details block removed per request */}
    </div>
  )
}
