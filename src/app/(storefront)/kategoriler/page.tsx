import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCategories } from "@/services/productService"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-brand-slate mb-4">Tüm Kategoriler</h1>
        <p className="text-brand-slate/70 font-semibold max-w-2xl mx-auto">
          Aradığınız tüm taptaze lezzetler burada. İhtiyacınıza en uygun kategoriyi seçerek keşfetmeye başlayın.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {categories.length > 0 ? (
          categories.map((cat: any) => (
            <Link key={cat.id} href={`/kategori/${cat.slug}`} className="group relative aspect-square rounded-2xl overflow-hidden bg-brand-slate/10 flex items-center justify-center border-2 border-transparent hover:border-brand-gold transition-all">
              <div className="absolute inset-0 flex items-center justify-center text-brand-slate/30 font-bold z-0 text-sm">Görsel Alanı</div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-slate via-brand-slate/30 to-transparent z-10 transition-opacity duration-300 opacity-80 group-hover:opacity-90"></div>
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col items-start gap-4">
                <span className="text-white font-black text-lg lg:text-xl leading-tight">{cat.name}</span>
                <div className="w-10 h-10 bg-brand-gold text-brand-slate rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:translate-x-2">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-brand-slate/50 font-bold">
            Henüz kategori bulunmuyor.
          </div>
        )}
      </div>
    </div>
  )
}
