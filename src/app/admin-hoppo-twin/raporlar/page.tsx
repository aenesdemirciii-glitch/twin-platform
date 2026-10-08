import prisma from "@/lib/prisma"
import { Download, BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Package } from "lucide-react"

export default async function AdminReportsPage() {
  const [totalProducts, totalUsers, totalOrders] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count()
  ])

  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    select: { grandTotal: true, createdAt: true }
  })

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.grandTotal), 0)
  
  // Real monthly data calculation can be added here. Currently resetting to 0 for empty states.
  const monthlyData = [
    { month: "Ocak", sales: 0 },
    { month: "Şubat", sales: 0 },
    { month: "Mart", sales: 0 },
    { month: "Nisan", sales: 0 },
    { month: "Mayıs", sales: 0 },
    { month: "Haziran", sales: 0 },
  ]
  const maxSales = 100 // default to avoid division by zero if no sales

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Raporlar ve Analizler</h2>
          <p className="text-sm text-slate-500 mt-1">Platformun genel istatistikleri ve satış analizleri.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg text-sm font-bold transition-colors shadow-sm">
          <Download className="h-4 w-4" />
          Raporu İndir (.csv)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Toplam Ciro</p>
              <h4 className="text-2xl font-black text-slate-800">{totalRevenue.toLocaleString('tr-TR')} TL</h4>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> %12 Geçen aya göre
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Toplam Sipariş</p>
              <h4 className="text-2xl font-black text-slate-800">{totalOrders}</h4>
            </div>
          </div>
          <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> %5 Geçen aya göre
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Toplam Ürün</p>
              <h4 className="text-2xl font-black text-slate-800">{totalProducts}</h4>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            Aktif ürün sayısı
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Kayıtlı Müşteri</p>
              <h4 className="text-2xl font-black text-slate-800">{totalUsers}</h4>
            </div>
          </div>
          <div className="text-xs font-semibold text-purple-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> %8 Geçen aya göre
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          Aylık Satış Grafiği (Son 6 Ay)
        </h3>
        <div className="flex items-end gap-2 h-64 mt-4">
          {monthlyData.map((d, i) => {
            const height = (d.sales / maxSales) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex items-end justify-center h-full bg-slate-50 rounded-t-lg">
                  <div 
                    className="w-full bg-amber-400 rounded-t-lg transition-all duration-500 group-hover:bg-amber-500 relative"
                    style={{ height: `${height}%` }}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-sm">
                      {d.sales.toLocaleString()} ₺
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">{d.month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
