import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ClientPageForm } from "../ClientPageForm"

export default async function EditPagePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const page = await prisma.page.findUnique({ where: { id: params.id } })
  
  if (!page) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Sayfayı Düzenle</h2>
        <p className="text-sm text-slate-500 mt-1">"{page.title}" adlı sayfayı güncelliyorsunuz.</p>
      </div>

      <ClientPageForm initialData={page} />
    </div>
  )
}
