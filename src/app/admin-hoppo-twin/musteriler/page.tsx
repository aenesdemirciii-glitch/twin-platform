import prisma from "@/lib/prisma"
import { Search, Mail, Eye } from "lucide-react"

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Müşteriler</h2>
          <p className="text-sm text-slate-500 mt-1">Platforma kayıtlı tüm müşterileri görüntüleyin.</p>
        </div>
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
                <th className="px-6 py-4">Müşteri Adı</th>
                <th className="px-6 py-4">İletişim</th>
                <th className="px-6 py-4 text-center">Toplam Sipariş</th>
                <th className="px-6 py-4 font-semibold text-right">Toplam Harcama</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length > 0 ? (
                customers.map((user) => {
                  const totalSpent = user.orders.reduce((sum, order) => {
                    return order.status !== "CANCELLED" && order.status !== "REFUNDED" 
                      ? sum + Number(order.grandTotal) 
                      : sum;
                  }, 0);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{user.name || "İsimsiz Kullanıcı"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-700">{user.orders.length}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-amber-600">
                        ₺{totalSpent.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-300 cursor-not-allowed" title="Detaylar geliştirme aşamasında">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Henüz müşteri kaydı bulunmuyor.
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
