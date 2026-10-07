import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductBySlug, getActiveProducts } from "@/services/productService"
import { ShoppingCart, Heart, ShieldCheck, Truck } from "lucide-react"
import { ProductOptions } from "@/components/storefront/ProductOptions"
import { AddToCartButton } from "@/components/storefront/AddToCartButton"

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  
  const popularProducts = await getActiveProducts({ take: 4 })

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <span>Ana Sayfa</span>
        <span>/</span>
        <span>Ürünler</span>
        <span>/</span>
        <span className="text-brand-slate font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images (Left) */}
        <div className="space-y-4">
          <div className="relative w-full pb-[100%] bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden">
            {product.images && product.images[0] ? (
              <img src={product.images[0].url} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-lg">Ürün Görseli (Yakında Eklenecek)</span>
            )}
          </div>
        </div>

        {/* Product Info (Right) */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-brand-slate mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-slate-600 leading-relaxed mb-6">
              {product.shortDescription || "Bu ürün için henüz bir açıklama eklenmedi. En taze ve doğal ürünlerimizden biridir."}
            </p>
            
            <ProductOptions product={product} />
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

      {/* Bunları da Deneyebilirsiniz / Popüler Ürünler */}
      {popularProducts && popularProducts.length > 0 && (
        <div className="mt-24 border-t border-brand-slate/10 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-brand-slate">Bunları Da Deneyebilirsiniz</h2>
            <p className="text-brand-slate/60 mt-2 font-medium">Müşterilerimizin en çok tercih ettiği diğer lezzetleri keşfedin</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {popularProducts.map((prod: any, i: number) => (
              <Link href={`/urun/${prod.slug}`} key={prod.id || i} className="bg-white rounded-2xl overflow-hidden border-2 border-brand-slate/10 flex flex-col group hover:border-brand-gold transition-colors">
                <div className="relative w-full pb-[100%] bg-brand-slate/5 overflow-hidden">
                  {prod.images && prod.images[0] ? (
                    <img src={prod.images[0].url} alt={prod.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="text-brand-slate/40 font-bold text-xs lg:text-base">Ürün Görseli</span>
                  )}
                  {prod.isFeatured && (
                    <div className="absolute top-2 right-2 lg:top-3 lg:right-3 bg-brand-slate text-brand-gold text-[10px] lg:text-xs font-black px-2 py-1 rounded shadow-sm z-10 uppercase">
                      POPÜLER
                    </div>
                  )}
                </div>
                <div className="p-3 lg:p-5 flex flex-col flex-1 border-t border-brand-slate/5">
                  <h3 className="font-bold text-sm lg:text-base mb-2 line-clamp-2 text-brand-slate group-hover:text-brand-gold transition-colors">{prod.name}</h3>
                  <div className="mt-auto pt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-base lg:text-xl font-black text-brand-slate">{Number(prod.price).toLocaleString('tr-TR')} TL</p>
                    </div>
                    <AddToCartButton product={prod} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
