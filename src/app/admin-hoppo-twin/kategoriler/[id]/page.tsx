import prisma from "@/lib/prisma"
import { ClientCategoryForm } from "../ClientCategoryForm"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { id: resolvedParams.id }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!category) {
    notFound()
  }

  const cleanCategory = {
    id: category.id,
    name: category.name,
    description: category.description,
    parentId: category.parentId,
    active: category.active,
    seoTitle: category.seoTitle,
    seoDesc: category.seoDesc,
    imageUrl: category.imageUrl
  }

  const cleanCategories = categories.map(c => ({
    id: c.id,
    name: c.name
  }))

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kategori Düzenle: {category.name}</h2>
        <p className="text-sm text-slate-500 mt-1">Kategori bilgilerini ve kapak görselini güncelleyin.</p>
      </div>

      <ClientCategoryForm categories={cleanCategories} initialData={cleanCategory} />
    </div>
  )
}
