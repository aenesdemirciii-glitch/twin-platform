import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { ArrowRight, Truck, ShieldCheck, Undo2, Clock, Trophy, Play, Percent, MessageCircle, Eye } from "lucide-react"

import prisma from "@/lib/prisma"
import { getCategories } from "@/services/productService"
import { AddToCartButton } from "@/components/storefront/AddToCartButton"

export default async function HomePage() {
  // Çok Satanlar
  let products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { images: true }
  })
  
  if (products.length < 8) {
    const fallback = await prisma.product.findMany({
      where: { 
        isActive: true,
        id: { notIn: products.map(p => p.id) }
      },
      take: 8 - products.length,
      orderBy: { createdAt: 'desc' },
      include: { images: true }
    })
    products = [...products, ...fallback]
  }

  // Popüler Ürünler
  let popularProducts = await prisma.product.findMany({
    where: { isNew: true, isActive: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { images: true }
  })

  if (popularProducts.length < 8) {
    const excludeIds = [...products.map(p => p.id), ...popularProducts.map(p => p.id)]
    const fallbackPop = await prisma.product.findMany({
      where: { 
        isActive: true,
        id: { notIn: excludeIds }
      },
      take: 8 - popularProducts.length,
      orderBy: { createdAt: 'desc' },
      include: { images: true }
    })
    popularProducts = [...popularProducts, ...fallbackPop]
  }
  
  const categories = await getCategories()
  const displayCategories = categories.slice(0, 8)

  return (
    <div className="w-full bg-white text-brand-slate">
      {/* Hero Banner Section */}
      <section className="relative w-full overflow-hidden bg-brand-slate/5 border-b border-brand-slate/10">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl z-10">
              <div className="inline-block px-4 py-1 bg-brand-gold text-brand-slate font-black text-sm rounded-full mb-6">
                KIŞA HAZIR
              </div>
              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-6">
                Dolu Kış Paketi ile Enerjinizi Katlayın
              </h1>
              <p className="text-lg text-brand-slate/80 mb-8 font-medium leading-relaxed">
                Sevdiklerinizle paylaşacağınız en taze ve seçkin lezzetler tek bir pakette. Sadece sınırlı bir süre için özel fiyatla.
              </p>
              <Link 
                href="/urun/kis-paketi" 
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-slate font-black px-8 py-4 rounded-lg hover:bg-white hover:text-brand-slate hover:border-brand-gold border-2 border-brand-gold transition-all shadow-lg"
              >
                Paketi İncele <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[500px] bg-white rounded-2xl border-2 border-dashed border-brand-slate/20 flex items-center justify-center">
              <span className="text-brand-slate/40 font-bold">Ana Görsel Alanı (Hero Banner)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b border-brand-slate/10 bg-white py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-center gap-3">
              <Truck className="h-6 w-6 text-brand-gold" />
              <span className="font-bold text-sm">Hızlı & Ücretsiz Kargo</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-gold" />
              <span className="font-bold text-sm">%100 Güvenli Alışveriş</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Undo2 className="h-6 w-6 text-brand-gold" />
              <span className="font-bold text-sm">Kolay İade Garantisi</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-6 w-6 text-brand-gold" />
              <span className="font-bold text-sm">7/24 Müşteri Destek</span>
            </div>
          </div>
        </div>
      </section>



      {/* Popüler Ürünler (Popular Products) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 bg-brand-gold text-brand-slate rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black">Popüler Ürünler</h2>
              <p className="text-brand-slate/70 font-semibold mt-1">Bu haftanın en çok incelenen favori lezzetleri</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:flex lg:overflow-x-auto lg:pb-8 lg:-mx-4 lg:px-4 lg:gap-6 lg:snap-x lg:snap-mandatory hide-scrollbar">
            {popularProducts.map((prod, i) => (
              <Link href={`/urun/${prod.slug}`} key={prod.id || i} className="lg:min-w-[320px] bg-white rounded-2xl overflow-hidden border-2 border-brand-slate/10 lg:snap-start flex flex-col group hover:border-brand-gold transition-colors block">
                <div className="relative w-full pb-[100%] bg-brand-slate/5 overflow-hidden">
                  {prod.images && prod.images[0] ? (
                    <img src={prod.images[0].url} alt={prod.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-brand-slate/40 font-bold text-xs lg:text-base">Ürün Görseli</span>
                  )}
                  {prod.isFeatured && (
                    <div className="absolute top-2 right-2 lg:top-3 lg:right-3 bg-brand-slate text-brand-gold text-[10px] font-black px-2 py-1 rounded shadow-sm z-10 uppercase">
                      POPÜLER
                    </div>
                  )}
                </div>
                <div className="p-3 lg:p-5 flex flex-col flex-1 border-t border-brand-slate/5">
                  <h3 className="font-bold text-sm lg:text-lg mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">{prod.name}</h3>
                  <div className="mt-auto pt-2">
                    <p className="text-base lg:text-xl font-black mb-3 lg:mb-4">{Number(prod.price).toLocaleString('tr-TR')} TL</p>
                    <AddToCartButton product={prod} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-brand-slate/5 border-y border-brand-slate/10 container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black mb-2">Kategorileri Keşfet</h2>
            <p className="text-brand-slate/70 font-semibold">Aradığın lezzete tek tıkla ulaş — Yüzlerce taze çeşit</p>
          </div>
          <Link href="/kategoriler" className="font-black border-2 border-brand-slate bg-transparent px-4 py-2 rounded-lg hover:bg-brand-slate hover:text-white transition-colors text-sm items-center gap-2 hidden md:flex">
            Tüm Kategoriler <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {displayCategories.map((cat: any, i: number) => {
            return (
            <Link key={cat.id || i} href={`/kategori/${cat.slug}`} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-slate/10 flex items-center justify-center border-2 border-transparent hover:border-brand-gold transition-all">
              <div className="absolute inset-0 flex items-center justify-center text-brand-slate/30 font-bold z-0 text-sm">Görsel Alanı</div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-slate via-brand-slate/50 to-transparent z-10 transition-opacity duration-300 opacity-80 group-hover:opacity-90"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                <span className="text-white font-bold text-sm lg:text-base leading-tight w-2/3">{cat.name}</span>
                <div className="h-8 w-8 bg-brand-gold text-brand-slate rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
            )
          })}
        </div>
      </section>

      {/* Çok Satanlar (Best Sellers) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 bg-brand-gold text-brand-slate rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black">Çok Satanlar</h2>
              <p className="text-brand-slate/70 font-semibold mt-1">Müşterilerimizin en çok tercih ettiği lezzetler</p>
            </div>
            <Link href="/cok-satanlar" className="ml-auto font-black text-sm hover:text-brand-gold flex items-center gap-1 hidden md:flex transition-colors">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:flex lg:overflow-x-auto lg:pb-8 lg:-mx-4 lg:px-4 lg:gap-6 lg:snap-x lg:snap-mandatory hide-scrollbar">
            {products.map((prod, i) => (
              <Link href={`/urun/${prod.slug}`} key={prod.id || i} className="lg:min-w-[320px] bg-white rounded-2xl overflow-hidden border-2 border-brand-slate/10 lg:snap-start flex flex-col group hover:border-brand-gold transition-colors block">
                <div className="relative w-full pb-[100%] bg-brand-slate/5 overflow-hidden">
                  {prod.images && prod.images[0] ? (
                    <img src={prod.images[0].url} alt={prod.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-brand-slate/40 font-bold text-xs lg:text-base">Ürün Görseli</span>
                  )}
                  {prod.isFeatured && (
                    <div className="absolute top-2 right-2 lg:top-3 lg:right-3 bg-brand-slate text-brand-gold text-[10px] font-black px-2 py-1 rounded shadow-sm z-10 uppercase">
                      ÇOK SATAN
                    </div>
                  )}
                </div>
                <div className="p-3 lg:p-5 flex flex-col flex-1 border-t border-brand-slate/5">
                  <h3 className="font-bold text-sm lg:text-lg mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">{prod.name}</h3>
                  <div className="mt-auto pt-2">
                    <p className="text-base lg:text-xl font-black mb-3 lg:mb-4">{Number(prod.price).toLocaleString('tr-TR')} TL</p>
                    <AddToCartButton product={prod} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate WhatsApp Order Banner */}
      <section className="py-16 bg-white border-t border-brand-slate/10 container mx-auto px-4 lg:px-8">
        <div className="relative w-full bg-brand-slate rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center border-4 border-brand-gold/30">
          <div className="relative z-10 p-8 lg:p-12 lg:w-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold text-brand-slate font-black text-xs rounded-full mb-6 uppercase">
              <Truck className="h-4 w-4" /> İstanbul İçi Aynı Gün Kurye
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white mb-4">Toplu Alımlar ve Özel Siparişler</h3>
            <p className="text-white/80 font-medium text-lg mb-8 max-w-xl">
              İşletmeler, kurumsal hediyeler veya özel organizasyonlarınız için indirimli toptan fiyatlarımızla taptaze ürünler kapınıza gelsin.
            </p>
            <a 
              href="https://wa.me/905422731712" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-black px-8 py-4 rounded-xl hover:bg-[#1EBE57] transition-all transform hover:-translate-y-0.5 shadow-lg text-lg"
            >
              <MessageCircle className="h-6 w-6" /> WhatsApp'tan Sipariş Ver
            </a>
          </div>

          <div className="relative z-10 lg:w-1/3 p-8 lg:p-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border-4 border-brand-gold/50">
              <MessageCircle className="h-24 w-24 text-brand-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram / Social Media Reels Section */}
      <section className="py-16 bg-brand-slate/5 border-y border-brand-slate/10 container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <span className="text-brand-gold text-xl">#</span> SOSYAL MEDYA
          </h2>
          <p className="text-sm font-bold text-brand-slate/60 mt-2">Bizi sosyal ağlardan takip edin ve yenilikleri kaçırmayın</p>
        </div>

        <div className="w-full">
          <Script src="https://cdn.commoninja.com/sdk/latest/commonninja.js" strategy="lazyOnload" />
          <div className="commonninja_component pid-88a44d98-0d98-4cca-869d-e70bb3041549"></div>
        </div>
      </section>

      {/* Blog / Notes Section */}
      <section className="py-16 bg-white container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black mb-2">Blog & Duyurular</h2>
            <p className="text-brand-slate/70 font-semibold">Sektörel haberler, sağlıklı yaşam önerileri ve firmamızdan güncel bilgiler.</p>
          </div>
          <Link href="/blog" className="font-black text-sm hover:text-brand-gold items-center gap-2 hidden md:flex transition-colors">
            Tüm Yazılar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Kış Aylarında Bağışıklığınızı Güçlendirecek Doğal Karışımlar", 
              desc: "Zencefil, zerdeçal ve balla hazırlayabileceğiniz doğal kürler ile kış aylarına enerjik bir başlangıç yapın. Tamamen doğal malzemelerle sağlığınızı destekleyin.",
              image: "/images/blog/immunity.jpg",
              date: "12 Ekim 2026"
            },
            { 
              title: "Kahve Çekirdeklerinin Yolculuğu: Doğru Kahve Seçimi", 
              desc: "Dünyanın en iyi yörelerinden gelen taze kavrulmuş kahve çekirdekleri arasındaki farkları öğrenin. Damak tadınıza en uygun aromayı nasıl bulabilirsiniz?",
              image: "/images/blog/coffee.jpg",
              date: "5 Ekim 2026"
            },
            { 
              title: "Kuruyemiş Tüketiminde Porsiyon Kontrolü ve Faydaları", 
              desc: "Ceviz, badem ve Antep fıstığı gibi besin deposu kuruyemişleri tüketirken porsiyon kontrolünün önemi ve vücudunuza sağladığı eşsiz katkılar.",
              image: "/images/blog/nuts.jpg",
              date: "28 Eylül 2026"
            },
            { 
              title: "Geleneksel Türk Mutfağı Baharatlarının Gizli Gücü", 
              desc: "Sumak, nane ve pul biber gibi sofralarımızın vazgeçilmezi olan geleneksel baharatların yemeklere kattığı lezzetin ötesindeki mucizevi etkileri.",
              image: "/images/blog/spices.jpg",
              date: "15 Eylül 2026"
            },
          ].map((blog, i) => (
            <div key={i} className="flex flex-col bg-white border-2 border-brand-slate/10 rounded-2xl overflow-hidden hover:border-brand-gold transition-colors group">
              <div className="relative aspect-[4/3] bg-brand-slate/5 flex items-center justify-center border-b border-brand-slate/10 overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-bold text-brand-slate/50 mb-2">{blog.date}</span>
                <h3 className="font-black text-base mb-3 leading-snug group-hover:text-brand-gold transition-colors">{blog.title}</h3>
                <p className="text-sm text-brand-slate/70 font-medium line-clamp-4 mb-4">{blog.desc}</p>
                <Link href={`/blog/post-${i}`} className="mt-auto font-black text-xs hover:text-brand-gold transition-colors flex items-center gap-1 uppercase">
                  Devamını Oku <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Banner */}
      <section className="bg-white container mx-auto px-4 lg:px-8 pb-16">
        <div className="bg-brand-slate rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden border-4 border-brand-gold/20">
          <div className="relative z-10 max-w-lg">
            <p className="text-brand-gold font-black text-xs uppercase mb-2">Fırsatları İlk Sen Öğren</p>
            <h2 className="text-3xl font-black text-white mb-2">Bültene Katıl</h2>
            <p className="text-white/80 font-medium">Haftalık kampanyalardan haberdar ol, avantajlı fiyatları kaçırma.</p>
          </div>
          <div className="relative z-10 w-full lg:w-auto flex-1 max-w-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-transparent text-brand-slate font-bold focus:outline-none focus:border-brand-gold"
              />
              <button className="bg-brand-gold text-brand-slate font-black px-8 py-3 rounded-lg hover:bg-white transition-colors whitespace-nowrap">
                Abone Ol
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
