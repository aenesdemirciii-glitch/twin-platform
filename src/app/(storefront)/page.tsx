import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { ArrowRight, Truck, ShieldCheck, Undo2, Clock, Trophy, Play, Percent, MessageCircle, Eye } from "lucide-react"

import prisma from "@/lib/prisma"
import { getCategories } from "@/services/productService"
import { AddToCartButton } from "@/components/storefront/AddToCartButton"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await prisma.settings.findMany({
    where: {
      key: {
        in: [
          "home_hero_image",
          "home_hero_title",
          "home_hero_subtitle",
          "home_hero_button_text",
          "home_hero_button_link",
          "home_hero_tag",
          "reel_1_cover", "reel_1_link",
          "reel_2_cover", "reel_2_link",
          "reel_3_cover", "reel_3_link",
          "reel_4_cover", "reel_4_link"
        ]
      }
    }
  })

  const getSetting = (key: string, fallback: string) => {
    return settings.find(s => s.key === key)?.value || fallback
  }

  const heroImage = getSetting("home_hero_image", "")
  const heroTitle = getSetting("home_hero_title", "Dolu Kış Paketi ile Enerjinizi Katlayın")
  const heroSubtitle = getSetting("home_hero_subtitle", "Sevdiklerinizle paylaşacağınız en taze ve seçkin lezzetler tek bir pakette. Sadece sınırlı bir süre için özel fiyatla.")
  const heroBtnText = getSetting("home_hero_button_text", "Paketi İncele")
  const heroBtnLink = getSetting("home_hero_button_link", "/urun/kis-paketi")
  const heroTag = getSetting("home_hero_tag", "KIŞA HAZIR")

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

  // Blog Yazıları (Maksimum 4)
  const blogPosts = await prisma.blogPost.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 4
  })
  
  const categories = await getCategories()
  const displayCategories = categories.slice(0, 12)

  return (
    <div className="w-full bg-white text-brand-slate">
      {/* Hero Banner Section */}
      <section className="relative w-full overflow-hidden bg-brand-slate/5 border-b border-brand-slate/10">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl z-10">
              {heroTag && (
                <div className="inline-block px-4 py-1 bg-brand-gold text-brand-slate font-black text-sm rounded-full mb-6 uppercase">
                  {heroTag}
                </div>
              )}
              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-6">
                {heroTitle}
              </h1>
              <p className="text-lg text-brand-slate/80 mb-8 font-medium leading-relaxed">
                {heroSubtitle}
              </p>
              <Link 
                href={heroBtnLink} 
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-slate font-black px-8 py-4 rounded-lg hover:bg-white hover:text-brand-slate hover:border-brand-gold border-2 border-brand-gold transition-all shadow-lg"
              >
                {heroBtnText} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className={`relative h-[400px] lg:h-[500px] bg-white rounded-2xl flex items-center justify-center overflow-hidden ${heroImage ? '' : 'border-2 border-dashed border-brand-slate/20'}`}>
              {heroImage ? (
                <img src={heroImage} alt={heroTitle} className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-brand-slate/40 font-bold relative z-10">Ana Görsel Alanı (Hero Banner)</span>
              )}
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
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-brand-slate/30 font-bold z-0 text-sm">Görsel Alanı</div>
              )}
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
              href="https://wa.me/905347201903" 
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

        {(() => {
          const reels = [
            { cover: getSetting("reel_1_cover", ""), link: getSetting("reel_1_link", "") },
            { cover: getSetting("reel_2_cover", ""), link: getSetting("reel_2_link", "") },
            { cover: getSetting("reel_3_cover", ""), link: getSetting("reel_3_link", "") },
            { cover: getSetting("reel_4_cover", ""), link: getSetting("reel_4_link", "") }
          ].filter(r => r.cover)

          return (
            <div className={`w-full grid gap-6 mx-auto ${reels.length > 0 ? 'grid-cols-1 lg:grid-cols-3 max-w-6xl' : 'max-w-md'}`}>
              
              {/* Instagram Ana Kart */}
              <a href="https://instagram.com/ikizlerbaharatcilik" target="_blank" rel="noopener noreferrer" className={`bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1 rounded-2xl group hover:-translate-y-1 transition-transform duration-300 shadow-lg block ${reels.length > 0 ? 'lg:col-span-1 h-full' : ''}`}>
                <div className="bg-white/95 backdrop-blur-sm h-full w-full rounded-[14px] p-8 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl md:text-2xl mb-1">Instagram'da Bizi Takip Edin</h3>
                    <p className="text-base font-semibold text-slate-500">@ikizlerbaharatcilik</p>
                  </div>
                  <span className="mt-4 px-6 py-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white font-bold rounded-full shadow-md group-hover:scale-105 transition-transform">Profili Gör &rarr;</span>
                </div>
              </a>

              {/* Reels Grid */}
              {reels.length > 0 && (
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reels.map((reel, idx) => (
                    <a key={idx} href={reel.link || "https://instagram.com/ikizlerbaharatcilik"} target="_blank" rel="noopener noreferrer" className="relative aspect-[9/16] rounded-2xl overflow-hidden group shadow-md hover:-translate-y-1 transition-all duration-300 block bg-slate-100">
                      <img src={reel.cover} alt={`Reel ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50">
                          <Play className="w-5 h-5 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        <span className="text-xs font-bold">Reels İncele</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })()}
      </section>

      {/* Blog / Notes Section */}
      {blogPosts.length > 0 && (
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
            {blogPosts.map((blog) => (
              <div key={blog.id} className="flex flex-col bg-white border-2 border-brand-slate/10 rounded-2xl overflow-hidden hover:border-brand-gold transition-colors group">
                <div className="relative aspect-[4/3] bg-brand-slate/5 flex items-center justify-center border-b border-brand-slate/10 overflow-hidden">
                  <img src={blog.imageUrl || "/images/placeholder.jpg"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-bold text-brand-slate/50 mb-2">
                    {new Date(blog.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="font-black text-base mb-3 leading-snug group-hover:text-brand-gold transition-colors">{blog.title}</h3>
                  <p className="text-sm text-brand-slate/70 font-medium line-clamp-4 mb-4">
                    {blog.excerpt || (blog.content.substring(0, 120) + "...")}
                  </p>
                  <Link href={`/blog/${blog.slug}`} className="mt-auto font-black text-xs hover:text-brand-gold transition-colors flex items-center gap-1 uppercase">
                    Devamını Oku <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* İletişim Section */}
      <section id="iletisim" className="py-16 bg-brand-slate/5 border-t border-brand-slate/10 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-brand-slate/10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">Bize Ulaşın</h2>
            <p className="text-brand-slate/70 font-semibold">Sorularınız, siparişleriniz veya toptan alım talepleriniz için iletişim kanallarımızdan bize ulaşabilirsiniz.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-brand-slate/5 rounded-2xl group hover:bg-brand-gold/5 transition-colors">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1">Telefon</h3>
              <a href={`tel:${getSetting("store_phone", "0534 720 19 03")}`} className="text-brand-slate/70 hover:text-brand-gold transition-colors font-medium">
                {getSetting("store_phone", "0534 720 19 03")}
              </a>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-brand-slate/5 rounded-2xl group hover:bg-brand-gold/5 transition-colors">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1">E-Posta</h3>
              <a href={`mailto:${getSetting("store_email", "info@ikizlerbaharatcilik.com")}`} className="text-brand-slate/70 hover:text-brand-gold transition-colors font-medium break-all">
                {getSetting("store_email", "info@ikizlerbaharatcilik.com")}
              </a>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-brand-slate/5 rounded-2xl group hover:bg-brand-gold/5 transition-colors">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1">Adres</h3>
              <p className="text-brand-slate/70 font-medium leading-tight">
                {getSetting("store_address", "Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul")}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
