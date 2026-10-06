import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default async function GenericPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const rawSlug = params.slug.join('/')

  // Create a readable title from the slug
  const title = rawSlug
    .split(/[-/]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .replace('Kvkk', 'KVKK')
    .replace('Sss', 'Sıkça Sorulan Sorular')

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 min-h-[60vh] max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-brand-slate/60 hover:text-brand-gold transition-colors font-bold text-sm mb-8 uppercase tracking-wider">
        <ArrowLeft className="h-4 w-4" /> Ana Sayfaya Dön
      </Link>
      
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-brand-slate leading-tight">
            {title}
          </h1>
        </div>

        <div className="prose prose-lg prose-slate max-w-none text-brand-slate/80 font-medium">
          <p className="mb-6 leading-relaxed">
            Bu sayfa içeriği hukuk ve içerik ekibimiz tarafından hazırlanmaktadır. İkizler Kuruyemiş olarak sizlere en doğru ve şeffaf bilgiyi sunmak için çalışmalarımızı sürdürüyoruz.
          </p>
          <p className="mb-6 leading-relaxed">
            Daha fazla bilgi almak veya sorularınız için <strong>info@ikizlerbaharatcilik.com</strong> adresinden bizimle iletişime geçebilirsiniz.
          </p>
          <p className="text-sm text-slate-500 italic mt-12">
            Son Güncelleme: 12 Ekim 2026
          </p>
        </div>
      </div>
    </div>
  )
}
