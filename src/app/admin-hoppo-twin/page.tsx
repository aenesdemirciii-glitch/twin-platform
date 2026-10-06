import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react"
import prisma from "@/lib/prisma"

export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count()
  
  // Aggregate sales
  const salesAgg = await prisma.order.aggregate({
    _sum: {
      grandTotal: true
    },
    where: {
      status: { notIn: ["CANCELLED", "REFUNDED"] }
    }
  })

  const totalSales = salesAgg._sum.grandTotal ? Number(salesAgg._sum.grandTotal) : 0
  
  const totalUsers = await prisma.user.count()
  const activeProducts = await prisma.product.count({ where: { isActive: true } })

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Genel Bakış</h2>
        <p className="text-sm text-slate-500 mt-1">Mağazanızın genel durumu ve özet veriler.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Toplam Ciro" value={`₺${totalSales.toLocaleString('tr-TR')}`} icon={DollarSign} trend="Canlı" isPositive={true} />
        <StatCard title="Toplam Sipariş" value={totalOrders.toString()} icon={ShoppingBag} trend="Canlı" isPositive={true} />
        <StatCard title="Toplam Müşteri" value={totalUsers.toString()} icon={Users} trend="Canlı" isPositive={true} />
        <StatCard title="Aktif Ürün" value={activeProducts.toString()} icon={Activity} trend="Canlı" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder for Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Satış Grafiği</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-lg text-slate-400">
            [Grafik Modülü Geliştirme Aşamasında]
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Son Siparişler</h3>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">#{order.orderNumber}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.user?.name || 'Misafir'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">₺{Number(order.grandTotal).toLocaleString('tr-TR')}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 mt-1">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Henüz sipariş bulunmuyor.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, trend, isPositive }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold text-slate-800 mt-2">{value}</h4>
        </div>
        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center">
          <Icon className="h-6 w-6 text-slate-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend}
        </span>
        <span className="text-slate-400 ml-2">gerçek zamanlı veri</span>
      </div>
    </div>
  )
}
