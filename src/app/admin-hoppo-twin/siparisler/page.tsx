import prisma from "@/lib/prisma"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Siparişler</h2>
          <p className="text-sm text-slate-500 mt-1">Tüm siparişlerinizi görüntüleyin ve yönetin.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Sipariş No</th>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold">Müşteri</th>
                <th className="px-6 py-4 font-semibold">Tutar</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      {order.createdAt.toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4">
                      {order.address?.fullName || order.user?.name || "Misafir"}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ₺{Number(order.grandTotal).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        {order.status === "PENDING" ? "Bekliyor" : 
                         order.status === "PROCESSING" ? "Hazırlanıyor" :
                         order.status === "SHIPPED" ? "Kargoda" :
                         order.status === "DELIVERED" ? "Teslim Edildi" : 
                         order.status === "CANCELLED" ? "İptal" : order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Henüz sipariş bulunmuyor.
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
