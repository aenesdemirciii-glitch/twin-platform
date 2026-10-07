import prisma from "@/lib/prisma"
import { Search, History, Edit2 } from "lucide-react"

import { SearchInput } from "@/components/admin/SearchInput"

export default async function AdminStockPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";

  const products = await prisma.product.findMany({
    where: q ? { name: { contains: q } } : undefined,
    orderBy: { stock: 'asc' }, // Show lowest stock first
    include: {
      variants: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Stok Yönetimi</h2>
          <p className="text-sm text-slate-500 mt-1">Ürünlerin ve varyantların stok durumlarını takip edin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tükenen Ürünler</p>
          <h4 className="text-2xl font-bold text-rose-600 mt-2">
            {products.filter(p => p.stock === 0).length}
          </h4>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Kritik Stok ( &lt; 10 )</p>
          <h4 className="text-2xl font-bold text-amber-600 mt-2">
            {products.filter(p => p.stock > 0 && p.stock < 10).length}
          </h4>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Yeterli Stok</p>
          <h4 className="text-2xl font-bold text-emerald-600 mt-2">
            {products.filter(p => p.stock >= 10).length}
          </h4>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <SearchInput placeholder="Ürün adı ile ara..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Ürün / Varyant</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4 text-center">Mevcut Stok</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">Hızlı İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                    <td className="px-6 py-4 text-slate-500">{product.sku}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-700">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      {product.stock === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700">Tükendi</span>
                      ) : product.stock < 10 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">Kritik</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">Yeterli</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-300 " >
                          <History className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-slate-300 " >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Sistemde stoklanacak ürün bulunmuyor.
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
