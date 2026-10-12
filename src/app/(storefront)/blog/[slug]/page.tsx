import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import prisma from "@/lib/prisma"
import { MarkdownRenderer } from "@/components/storefront/MarkdownRenderer"
import { blogPosts as fallbackBlogPosts } from "@/lib/blogData"

export const dynamic = "force-dynamic"

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  
  let post: any = null
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    })
  } catch (e) {
    // db fallback
  }

  if (!post) {
    post = fallbackBlogPosts.find((p) => p.slug === params.slug) || null
  }

  if (!post || post.isActive === false) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 min-h-[60vh] max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-2 text-brand-slate/60 hover:text-brand-gold transition-colors font-bold text-sm mb-8 uppercase tracking-wider">
        <ArrowLeft className="h-4 w-4" /> Tüm Yazılara Dön
      </Link>
      
      <div className="bg-brand-slate/5 aspect-video w-full rounded-3xl mb-10 flex items-center justify-center border-2 border-brand-slate/10 overflow-hidden relative">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-brand-slate/30 font-bold text-2xl">Görsel</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <span className="bg-brand-gold text-brand-slate px-4 py-1.5 rounded-full text-sm font-black w-fit uppercase">
          {post.category || "Genel"}
        </span>
        <span className="text-brand-slate/50 font-bold text-sm">
          {new Date(post.createdAt || Date.now()).toLocaleDateString('tr-TR')}
        </span>
      </div>

      <h1 className="text-4xl lg:text-5xl font-black text-brand-slate mb-8 leading-tight">
        {post.title}
      </h1>

      <div className="prose prose-lg prose-slate max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>
    </div>
  )
}
