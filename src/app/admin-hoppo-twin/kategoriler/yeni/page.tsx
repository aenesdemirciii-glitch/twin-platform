import prisma from "@/lib/prisma"
import { ClientCategoryForm } from "../ClientCategoryForm"

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  const cleanCategories = categories.map(c => ({
    id: c.id,
    name: c.name
  }))

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Yeni Kategori Ekle</h2>
        <p className="text-sm text-slate-500 mt-1">Siteniz için yeni bir kategori veya alt kategori oluşturun.</p>
      </div>

      <ClientCategoryForm categories={cleanCategories} />
    </div>
  )
}
