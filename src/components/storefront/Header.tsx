import Link from "next/link"
import { Search, User } from "lucide-react"
import { CartIcon } from "@/components/storefront/CartIcon"
import { getCategories } from "@/services/productService"

export async function Header() {
  const categories = await getCategories()

  return (
    <>
      <div className="w-full bg-brand-slate py-2 text-white text-xs lg:text-sm font-bold overflow-hidden whitespace-nowrap relative">
        <div className="flex animate-marquee gap-12 items-center px-4">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> 3.000 TL Üzeri Kargo Ücretsiz</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> İstanbul İçi Aynı Gün Kurye Fırsatı</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> Hızlı Kargo</span>
          
          <span className="flex items-center gap-2 ml-12"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> 3.000 TL Üzeri Kargo Ücretsiz</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> İstanbul İçi Aynı Gün Kurye Fırsatı</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> Hızlı Kargo</span>
        </div>
      </div>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-slate/20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-black tracking-tight text-brand-slate">
              İKİZLER<span className="text-brand-gold"> KURUYEMİŞ</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form action="/arama" method="GET" className="relative w-full">
              <input 
                type="text" 
                name="q"
                placeholder="Ne aramıştınız? Örn: Antep fıstığı..." 
                className="w-full bg-white border-2 border-brand-slate/20 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-brand-gold text-brand-slate placeholder:text-brand-slate/50 transition-colors"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-brand-slate text-white rounded-full hover:bg-brand-gold hover:text-brand-slate transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <CartIcon />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center h-12 border-t border-brand-slate/10 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/" className="text-sm font-bold text-brand-slate hover:text-brand-gold transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="text-sm font-bold text-brand-slate hover:text-brand-gold transition-colors">
                Hakkımızda
              </Link>
            </li>
            {categories.slice(0, 6).map((cat: any) => (
              <li key={cat.id}>
                <Link href={`/kategori/${cat.slug}`} className="text-sm font-bold text-brand-slate hover:text-brand-gold transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/kategoriler" className="text-sm font-bold text-brand-slate hover:text-brand-gold transition-colors">
                Tüm Kategoriler
              </Link>
            </li>
            <li>
              <Link href="#iletisim" className="text-sm font-bold text-brand-slate hover:text-brand-gold transition-colors">
                İletişim
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    </>
  )
}
