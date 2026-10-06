import prisma from "@/lib/prisma"
import { Edit, Trash2, Plus, Search } from "lucide-react"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kategoriler</h2>
          <p className="text-sm text-slate-500 mt-1">Ürün kategorilerinizi ve alt dallarını yönetin.</p>
        </div>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
          <Plus className="h-4 w-4" />
          Yeni Kategori (Geliştirme Aşamasında)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              disabled
              placeholder="Arama geliştirme aşamasındadır..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Kategori Adı</th>
                <th className="px-6 py-4">URL (Slug)</th>
                <th className="px-6 py-4 text-center">Ürün Sayısı</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-500">/{cat.slug}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        {cat._count.products} Ürün
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-300 cursor-not-allowed" title="Düzenleme geliştirme aşamasında">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-slate-300 cursor-not-allowed" title="Silme geliştirme aşamasında">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Henüz kategori bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
