import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      parent: true,
      _count: {
        select: { products: true, children: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kategoriler</h2>
          <p className="text-sm text-slate-500 mt-1">Ürünlerinizi hiyerarşik olarak gruplandırın.</p>
        </div>
        <Link href="/admin-hoppo-twin/kategoriler/yeni" className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg text-sm font-bold hover:bg-amber-500 transition-colors">
          <Plus className="h-4 w-4" />
          Kategori Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              disabled
              placeholder="Arama..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 "
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Kategori Adı</th>
                <th className="px-6 py-4">Üst Kategori</th>
                <th className="px-6 py-4">Bağlı Ürünler</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length > 0 ? categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden flex-shrink-0">
                        {cat.imageUrl ? (
                          <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FolderTree className="h-4 w-4" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {cat.parent ? cat.parent.name : <span className="text-slate-400 italic">Ana Kategori</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {cat._count.products} Ürün
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      cat.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {cat.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin-hoppo-twin/kategoriler/${cat.id}`} className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors" title="Düzenle">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="p-1.5 text-slate-300 " >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Henüz kategori eklenmemiş.
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
