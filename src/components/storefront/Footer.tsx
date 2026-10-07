import Link from "next/link"
import { Truck, Package, Award } from "lucide-react"
import { getCategories } from "@/services/productService"

export async function Footer() {
  const categories = await getCategories()

  return (
    <footer className="bg-white pt-12 border-t-4 border-brand-gold">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Top Feature Icons */}
        <div className="flex flex-col items-center justify-center mb-12 text-brand-slate">
          <div className="text-3xl font-black tracking-tight mb-10">
            İKİZLER<span className="text-brand-gold"> Baharatçılık</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border-2 border-brand-slate/20 rounded-xl text-brand-slate">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Ücretsiz Kargo</h4>
                <p className="text-sm text-brand-slate/70">3.000 TL ve üzeri siparişlerde Türkiye geneli ücretsiz kargo</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border-2 border-brand-slate/20 rounded-xl text-brand-slate">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Güvenilir Paketleme</h4>
                <p className="text-sm text-brand-slate/70">Hava geçirmez özel ambalajlarla sağlam ve özenli paketleme</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border-2 border-brand-slate/20 rounded-xl text-brand-slate">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Kaliteli Üretim</h4>
                <p className="text-sm text-brand-slate/70">1989'dan bu yana tecrübe ve kalite belgeleri ile yapılan yerli üretim</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-slate/20 py-12 text-brand-slate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Info */}
            <div>
              <p className="text-sm text-brand-slate/80 mb-6 font-medium leading-relaxed">
                1989 yılından günümüze, en taze ve kaliteli kuruyemişleri özenle işleyerek sofralarınıza taşıyoruz. Güvenilir ve sağlıklı lezzetler.
              </p>
              <div className="text-sm text-brand-slate/80 font-medium space-y-4">
                <p>Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul</p>
                <p className="font-black text-brand-slate text-base">0534 720 19 00</p>
                <p>info@ikizlerbaharatcilik.com</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Link href="https://www.facebook.com/ikizlerbaharatcilik/" target="_blank" className="w-8 h-8 rounded-full border border-brand-slate/30 flex items-center justify-center cursor-pointer hover:bg-brand-gold hover:text-brand-slate hover:border-brand-gold transition-colors font-bold text-brand-slate/70 text-xs">FB</Link>
                <Link href="https://www.instagram.com/ikizlerbaharatcilik/" target="_blank" className="w-8 h-8 rounded-full border border-brand-slate/30 flex items-center justify-center cursor-pointer hover:bg-brand-gold hover:text-brand-slate hover:border-brand-gold transition-colors font-bold text-brand-slate/70 text-xs">IG</Link>
              </div>
            </div>

            {/* Column 2: Kategoriler */}
            <div>
              <h4 className="font-black mb-6 text-lg">Kategoriler</h4>
              <ul className="space-y-3 text-sm font-semibold text-brand-slate/80">
                {categories.slice(0, 12).map((cat: any) => (
                  <li key={cat.id}>
                    <Link href={`/kategori/${cat.slug}`} className="hover:text-brand-gold transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Kurumsal */}
            <div>
              <h4 className="font-black mb-6 text-lg">Kurumsal</h4>
              <ul className="space-y-3 text-sm font-semibold text-brand-slate/80">
                <li><Link href="/sayfa/hakkimizda" className="hover:text-brand-gold transition-colors">Hakkımızda</Link></li>
                <li><Link href="/sayfa/kalite-belgelerimiz" className="hover:text-brand-gold transition-colors">Kalite Belgelerimiz</Link></li>
                <li><Link href="/sayfa/iletisim" className="hover:text-brand-gold transition-colors">Mağazalarımız & İletişim</Link></li>
                <li><Link href="/sayfa/toptan" className="hover:text-brand-gold transition-colors">Toptan Satış</Link></li>
                <li><Link href="/blog" className="hover:text-brand-gold transition-colors">Kuruyemiş Rehberi (Blog)</Link></li>
              </ul>
            </div>

            {/* Column 4: Bilgilendirme */}
            <div>
              <h4 className="font-black mb-6 text-lg">Bilgilendirme</h4>
              <ul className="space-y-3 text-sm font-semibold text-brand-slate/80">
                <li><Link href="/sayfa/mesafeli-satis" className="hover:text-brand-gold transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
                <li><Link href="/sayfa/kvkk" className="hover:text-brand-gold transition-colors">KVKK Aydınlatma Metni</Link></li>
                <li><Link href="/sayfa/sss" className="hover:text-brand-gold transition-colors">Sıkça Sorulan Sorular</Link></li>
                <li><Link href="/sayfa/iade" className="hover:text-brand-gold transition-colors">İade ve İptal Koşulları</Link></li>
                <li><Link href="/sayfa/gizlilik" className="hover:text-brand-gold transition-colors">Gizlilik Sözleşmesi</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-brand-slate/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-brand-slate/60">
          <p>Copyright &copy; 2026 Tüm hakları saklıdır. - Hoppo Agency Tarafından Tasarlanmıştır</p>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white border-2 border-brand-slate/20 rounded text-brand-slate">256-bit SSL</div>
            <div className="px-3 py-1 bg-white border-2 border-brand-slate/20 rounded text-brand-slate italic">VISA</div>
            <div className="px-3 py-1 bg-white border-2 border-brand-slate/20 rounded text-brand-slate italic">MasterCard</div>
            <div className="h-8 flex items-center bg-[#0d2a45] px-3 py-1 rounded">
              {/* Note: In a real app we'd use the SVG, but this styled text serves the exact purpose and brand styling */}
              <span className="text-white font-bold tracking-tight" style={{ fontFamily: 'sans-serif' }}>iyzico</span>
              <span className="text-white text-[10px] ml-1 font-medium leading-none">ile<br/>Öde</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
