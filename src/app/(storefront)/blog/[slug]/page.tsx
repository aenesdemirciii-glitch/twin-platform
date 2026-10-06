import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { blogPosts } from "@/lib/blogData"

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 min-h-[60vh] max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-2 text-brand-slate/60 hover:text-brand-gold transition-colors font-bold text-sm mb-8 uppercase tracking-wider">
        <ArrowLeft className="h-4 w-4" /> Tüm Yazılara Dön
      </Link>
      
      <div className="bg-brand-slate/5 aspect-video w-full rounded-3xl mb-10 flex items-center justify-center border-2 border-brand-slate/10 overflow-hidden relative">
        <span className="text-brand-slate/40 font-bold text-xl">{post.imagePlaceholder}</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
        <span className="text-sm font-medium text-brand-slate/60">{post.date}</span>
      </div>

      <h1 className="text-3xl lg:text-5xl font-black text-brand-slate mb-8 leading-tight">
        {post.title}
      </h1>

      <div className="prose prose-lg prose-slate max-w-none text-brand-slate/80 font-medium">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/### (.*?)<br\/>/g, '<h3>$1</h3>') }} />
      </div>
    </div>
  )
}
