import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { STATIC_PAGES } from "@/data/staticPages"
import { 
  Phone, 
  MessageCircle, 
  Building2, 
  Mail, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Clock,
  Sparkles
} from "lucide-react"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params
  
  if (slug === "sss") {
    return { title: "Sayfa Bulunamadı" }
  }

  const staticData = STATIC_PAGES[slug]
  if (staticData) {
    return {
      title: staticData.seoTitle,
      description: staticData.metaDescription,
      openGraph: {
        title: staticData.seoTitle,
        description: staticData.metaDescription,
        type: "website"
      }
    }
  }

  try {
    const page = await prisma.page.findUnique({ where: { slug } })
    if (page && page.isActive) {
      return {
        title: `${page.title} | İkizler Baharatçılık`,
        description: page.seoDesc || `${page.title} - İkizler Baharatçılık kurumsal sayfası.`
      }
    }
  } catch (e) {
    // DB offline fallback
  }

  return {
    title: "İkizler Baharatçılık",
    description: "1989'dan bugüne güvenilir lezzetler."
  }
}

export default async function CorporatePage(props: PageProps) {
  const { slug } = await props.params

  // "Sıkça Sorulan Sorular kaldır" - remove SSS completely
  if (slug === "sss") {
    notFound()
  }

  // Check static predefined page first or DB
  const staticData = STATIC_PAGES[slug]
  let dbPage: any = null

  try {
    dbPage = await prisma.page.findUnique({
      where: { slug }
    })
  } catch (e) {
    // fallback if DB query fails
  }

  const title = staticData?.title || dbPage?.title
  const content = staticData?.content || dbPage?.content
  const isSpecial = staticData?.isSpecial

  if (!title || (!staticData && (!dbPage || !dbPage.isActive))) {
    notFound()
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-brand-slate/60 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-brand-gold transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Ana Sayfa
          </Link>
          <span>/</span>
          {staticData?.menuLocation && (
            <>
              <span className="text-brand-slate/40">{staticData.menuLocation}</span>
              <span>/</span>
            </>
          )}
          <span className="text-brand-slate font-bold">{title}</span>
        </nav>

        {/* Page Hero Header */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-brand-slate/10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-brand-gold rounded-full text-xs font-bold mb-3 border border-amber-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>İkizler Baharatçılık 1989</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-brand-slate tracking-tight">
                {title}
              </h1>
              {staticData?.metaDescription && (
                <p className="text-slate-500 text-sm mt-2 max-w-2xl">
                  {staticData.metaDescription}
                </p>
              )}
            </div>

            {/* Special Call / WhatsApp Action for Toptan */}
            {isSpecial === "toptan" && (
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="https://wa.me/905347201900?text=Merhaba,%20toptan%20ürün%20fiyat%20teklifi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp ile Teklif Al
                </a>
                <a
                  href="tel:05347201900"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-slate hover:bg-brand-slate/90 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105"
                >
                  <Phone className="h-5 w-5" />
                  Hemen Ara
                </a>
              </div>
            )}
          </div>

          {/* Quick Wholesale Highlights if toptan */}
          {isSpecial === "toptan" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-amber-50/60 p-5 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-brand-slate text-sm">Kurumsal & İşletme</div>
                  <div className="text-xs text-slate-500">Kafe, restoran, otel & aktarlar</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-brand-slate text-sm">Özel Ambalaj & Gramaj</div>
                  <div className="text-xs text-slate-500">Talebinize göre paketleme</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-brand-slate text-sm">Hızlı Sevkiyat</div>
                  <div className="text-xs text-slate-500">Taze ve garantili tedarik</div>
                </div>
              </div>
            </div>
          )}

          {/* Page Body / Content Formatting */}
          <div className="prose prose-slate max-w-none 
            prose-headings:text-brand-slate prose-headings:font-black
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:pb-2 prose-h3:border-b prose-h3:border-slate-100
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-brand-slate prose-strong:font-bold
            prose-ul:my-4 prose-li:text-slate-700 prose-li:my-1">
            
            {content.split('\n\n').map((block: string, idx: number) => {
              const trimmed = block.trim()
              if (!trimmed) return null

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-black text-brand-slate mt-8 mb-4 border-b border-slate-100 pb-2">
                    {trimmed.replace('### ', '')}
                  </h3>
                )
              }

              // Check if bullet list
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const items = trimmed.split('\n').filter(line => line.trim())
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 mb-4 text-slate-700">
                    {items.map((item, itemIdx) => {
                      const cleanItem = item.replace(/^[\*\-]\s+/, '')
                      // Simple bold formatter
                      const parts = cleanItem.split(/(\*\*.*?\*\*)/g)
                      return (
                        <li key={itemIdx}>
                          {parts.map((p, pIdx) => {
                            if (p.startsWith('**') && p.endsWith('**')) {
                              return <strong key={pIdx} className="text-brand-slate font-bold">{p.slice(2, -2)}</strong>
                            }
                            return p
                          })}
                        </li>
                      )
                    })}
                  </ul>
                )
              }

              // Normal paragraph with possible bold styling
              const parts = trimmed.split(/(\*\*.*?\*\*)/g)
              return (
                <p key={idx} className="text-slate-700 leading-relaxed mb-4">
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={pIdx} className="text-brand-slate font-bold">{part.slice(2, -2)}</strong>
                    }
                    return part
                  })}
                </p>
              )
            })}
          </div>

          {/* Special Wholesale Bottom Action Card */}
          {isSpecial === "toptan" && (
            <div className="mt-10 p-6 lg:p-8 bg-gradient-to-br from-brand-slate to-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-amber-400 mb-1">
                  Toptan Fiyat Teklifi Almak Çok Kolay!
                </h4>
                <p className="text-sm text-slate-300 max-w-lg">
                  İhtiyacınız olan ürün grubu ve tahmini miktar bilgisini WhatsApp veya telefon aracılığıyla bize iletin, dakikalar içinde özel teklifinizi iletelim.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <a
                  href="https://wa.me/905347201900?text=Merhaba,%20toptan%20ürün%20fiyat%20teklifi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-sm rounded-xl shadow transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
                <a
                  href="tel:05347201900"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-gold hover:bg-amber-400 text-brand-slate font-bold text-sm rounded-xl shadow transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  0534 720 19 00
                </a>
              </div>
            </div>
          )}

          {/* Contact Badge for About Page */}
          {isSpecial === "hakkimizda" && (
            <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs uppercase text-slate-400 tracking-wider">Adresimiz</div>
                  <div className="text-sm font-semibold text-brand-slate mt-0.5">Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs uppercase text-slate-400 tracking-wider">Telefon</div>
                  <div className="text-sm font-semibold text-brand-slate mt-0.5">0534 720 19 00</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs uppercase text-slate-400 tracking-wider">E-Posta</div>
                  <div className="text-sm font-semibold text-brand-slate mt-0.5">info@ikizlerbaharatcilik.com</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer timestamp */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Son Güncelleme: 12 Ekim 2026
            </span>
            <span className="font-medium text-slate-500">
              İkizler Baharatçılık &bull; Güvenilir Alışveriş
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}
