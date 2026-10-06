import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { blogPosts } from "@/lib/blogData"

export default function BlogListPage() {
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
              <span className="text-brand-slate/30 font-bold text-lg z-10">{post.imagePlaceholder}</span>
              <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/10 transition-colors z-0"></div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                <span className="text-xs font-medium text-brand-slate/60">{post.date}</span>
              </div>
              <h3 className="text-xl font-black text-brand-slate mb-3 group-hover:text-brand-gold transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-brand-slate/70 font-medium text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-brand-slate font-bold text-sm mt-auto group-hover:text-brand-gold transition-colors">
                Devamını Oku <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
