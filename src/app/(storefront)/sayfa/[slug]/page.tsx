import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CorporatePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = await prisma.page.findUnique({
    where: { slug: params.slug }
  })

  if (!page || !page.isActive) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 min-h-[60vh] max-w-4xl">
      <h1 className="text-4xl lg:text-5xl font-black text-brand-slate mb-8 leading-tight text-center">
        {page.title}
      </h1>

      <div className="prose prose-lg prose-slate max-w-none mx-auto
        prose-headings:font-black prose-headings:text-brand-slate 
        prose-p:text-brand-slate/80 prose-p:font-medium prose-p:leading-relaxed 
        prose-strong:text-brand-slate prose-strong:font-bold
        prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
        bg-white p-8 lg:p-12 rounded-3xl border border-brand-slate/10 shadow-sm">
        
        {page.content.split('\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return <h3 key={idx} className="text-2xl mt-8 mb-4">{paragraph.replace('### ', '')}</h3>
          }
          if (paragraph.trim() === '') return <br key={idx} />
          return <p key={idx} className="mb-4">{paragraph}</p>
        })}
      </div>
    </div>
  )
}
