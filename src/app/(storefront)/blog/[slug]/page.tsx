import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 min-h-[60vh] max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-brand-slate/60 hover:text-brand-gold transition-colors font-bold text-sm mb-8 uppercase tracking-wider">
        <ArrowLeft className="h-4 w-4" /> Ana Sayfaya Dön
      </Link>
      
      <div className="bg-brand-slate/5 aspect-video w-full rounded-3xl mb-10 flex items-center justify-center border-2 border-dashed border-brand-slate/20">
        <span className="text-brand-slate/40 font-bold text-xl">Blog Görseli (Yakında)</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">Sağlıklı Yaşam</span>
        <span className="text-sm font-medium text-brand-slate/60">Ekim 2026</span>
      </div>

      <h1 className="text-3xl lg:text-5xl font-black text-brand-slate mb-8 leading-tight">
        Detaylı Blog İçeriği Yakında Eklenecek
      </h1>

      <div className="prose prose-lg prose-slate max-w-none text-brand-slate/80 font-medium">
        <p className="mb-6 leading-relaxed">
          Bu blog yazısının detaylı içeriği içerik ekibimiz tarafından şu anda hazırlanmaktadır. Çok yakında burada, sağlıklı yaşam, doğru beslenme ve doğal ürünlerimizin faydaları hakkında birbirinden değerli bilgileri okuyabileceksiniz.
        </p>
        <p className="leading-relaxed">
          O zamana kadar ana sayfamızdaki yeni ürünleri keşfetmeye devam edebilir, taptaze lezzetlerimizle tanışabilirsiniz!
        </p>
      </div>
    </div>
  )
}
