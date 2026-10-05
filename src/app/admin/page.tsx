import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Mağazanızın genel durumu ve özet veriler.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Bugünkü Ciro" value="₺12,450" icon={DollarSign} trend="+14%" isPositive={true} />
        <StatCard title="Siparişler (Aylık)" value="342" icon={ShoppingBag} trend="+5%" isPositive={true} />
        <StatCard title="Yeni Müşteri" value="89" icon={Users} trend="-2%" isPositive={false} />
        <StatCard title="Aktif Ziyaretçi" value="1,204" icon={Activity} trend="+24%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder for Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Satış Grafiği (Son 7 Gün)</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-lg text-slate-400">
            [Chart.js / Recharts Alanı]
          </div>
        </div>

        {/* Placeholder for Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Son Siparişler</h3>
            <button className="text-sm text-amber-600 font-medium hover:text-amber-700">Tümü</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">#ORD-{9000 + i}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ahmet Yılmaz</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">₺{(150 * i).toFixed(2)}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 mt-1">
                    Hazırlanıyor
                  </span>
                </div>
              </div>
            ))}
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
        <span className="text-slate-400 ml-2">önceki döneme göre</span>
      </div>
    </div>
  )
}
