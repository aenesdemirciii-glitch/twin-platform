import Link from "next/link"
import { ArrowRight } from "lucide-react"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function BlogListPage() {
  const blogPosts = await prisma.blogPost.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-black text-brand-slate mb-4">Kuruyemiş Rehberi</h1>
        <p className="text-brand-slate/70 font-semibold max-w-2xl mx-auto text-lg">
          Sağlıklı yaşam tüyoları, doğru beslenme alışkanlıkları ve taptaze ürünlerimiz hakkında her şey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-white rounded-2xl overflow-hidden border-2 border-brand-slate/10 hover:border-brand-gold transition-colors flex flex-col group">
            <div className="aspect-video bg-brand-slate/5 flex items-center justify-center relative overflow-hidden">
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-brand-slate/30 font-bold text-lg z-10">Görsel</span>
              )}
              <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/10 transition-colors z-0"></div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">{post.category || "Genel"}</span>
                <span className="text-xs font-medium text-brand-slate/60">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              <h2 className="text-xl font-bold text-brand-slate leading-snug mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-brand-slate/70 text-sm mb-6 flex-1 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm font-bold text-brand-slate group-hover:text-brand-gold transition-colors">
                Devamını Oku <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </div>
          </Link>
        ))}
        {blogPosts.length === 0 && (
          <div className="col-span-full text-center text-brand-slate/50 py-12">
            Henüz blog yazısı bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  )
}
