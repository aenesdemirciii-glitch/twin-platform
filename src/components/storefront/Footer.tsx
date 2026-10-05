import Link from "next/link"
import { Truck, Package, Award } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white pt-12 border-t-4 border-brand-gold">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Top Feature Icons */}
        <div className="flex flex-col items-center justify-center mb-12 text-brand-slate">
          <div className="text-3xl font-black tracking-tight mb-10">
            MARKA<span className="text-brand-gold">LOGO</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border-2 border-brand-slate/20 rounded-xl text-brand-slate">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Ücretsiz Kargo</h4>
                <p className="text-sm text-brand-slate/70">1.500 TL ve üzeri siparişlerde Türkiye geneli ücretsiz kargo</p>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="text-sm text-brand-slate/80 font-medium space-y-4">
                <p>Lorem ipsum dolor sit amet, 1234. Sokak No:12/3, 34000 Ipsum/Lorem</p>
                <p className="font-black text-brand-slate text-base">0850 123 45 67</p>
                <p>info@markalogo.net</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-8 rounded-full border border-brand-slate/30 flex items-center justify-center cursor-pointer hover:bg-brand-gold hover:text-brand-slate hover:border-brand-gold transition-colors font-bold text-brand-slate/70 text-xs">FB</div>
                <div className="w-8 h-8 rounded-full border border-brand-slate/30 flex items-center justify-center cursor-pointer hover:bg-brand-gold hover:text-brand-slate hover:border-brand-gold transition-colors font-bold text-brand-slate/70 text-xs">IN</div>
                <div className="w-8 h-8 rounded-full border border-brand-slate/30 flex items-center justify-center cursor-pointer hover:bg-brand-gold hover:text-brand-slate hover:border-brand-gold transition-colors font-bold text-brand-slate/70 text-xs">IG</div>
              </div>
            </div>

            {/* Column 2: Kategoriler */}
            <div>
              <h4 className="font-black mb-6 text-lg">Kategoriler</h4>
              <ul className="space-y-3 text-sm font-semibold text-brand-slate/80">
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kategori 1</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kategori 2</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kategori 3</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kategori 4</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kategori 5</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kategori 6</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kategori 7</Link></li>
              </ul>
            </div>

            {/* Column 3: Kurumsal */}
            <div>
              <h4 className="font-black mb-6 text-lg">Kurumsal</h4>
              <ul className="space-y-3 text-sm font-semibold text-brand-slate/80">
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Mağazalarımız</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Belgelerimiz</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Franchise</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Kariyer</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">İletişim</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Column 4: Bilgilendirme */}
            <div>
              <h4 className="font-black mb-6 text-lg">Bilgilendirme</h4>
              <ul className="space-y-3 text-sm font-semibold text-brand-slate/80">
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">KVKK Aydınlatma Metni</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Sıkça Sorulan Sorular</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Sipariş / Kargo Takibi</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Gizlilik Sözleşmesi</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Üyelik Sözleşmesi</Link></li>
                <li><Link href="#" className="hover:text-brand-gold transition-colors">Çerez Politikası</Link></li>
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
          </div>
        </div>
      </div>
    </footer>
  )
}
