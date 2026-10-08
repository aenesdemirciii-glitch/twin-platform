import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ClientBlogForm } from "../ClientBlogForm"

export default async function EditBlogPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
  
  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Yazıyı Düzenle</h2>
        <p className="text-sm text-slate-500 mt-1">"{post.title}" adlı yazıyı güncelliyorsunuz.</p>
      </div>

      <ClientBlogForm initialData={post} />
    </div>
  )
}
