import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Ürünler</h2>
          <p className="text-sm text-slate-500 mt-1">Tüm ürünlerinizi yönetin, AI ile yeni ürünler oluşturun.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
            <span className="font-bold">✨ AI ile Oluştur</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-500 transition-colors">
            <Plus className="h-4 w-4" />
            Yeni Ürün
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Ürün adı, SKU veya barkod ara..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="h-4 w-4" />
            Filtrele
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Ürün</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Fiyat</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: "Kavrulmuş Antep Fıstığı", sku: "KRY-ANT-001", cat: "Kuru Yemiş", stock: 120, price: "450.00 TL", status: "Aktif" },
                { name: "Çiğ Badem İçi", sku: "KRY-BDM-002", cat: "Kuru Yemiş", stock: 45, price: "320.00 TL", status: "Aktif" },
                { name: "Sarı Üzüm", sku: "KRY-UZM-003", cat: "Kuru Meyve", stock: 8, price: "120.00 TL", status: "Düşük Stok" },
              ].map((product, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg border border-slate-200 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.cat}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock < 10 ? "text-rose-600 font-medium" : "text-slate-600"}>
                      {product.stock} adet
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      product.status === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
