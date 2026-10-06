import prisma from "@/lib/prisma"
import { Shield, Plus, Edit, Trash2 } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // To display only admins or staff if role existed, but currently we show all users or we could filter by role if it existed in schema. 
  // Let's assume all users here for demonstration, or we can mock it since we just use next-auth credentials.

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kullanıcılar ve Yetkiler</h2>
          <p className="text-sm text-slate-500 mt-1">Panel erişimi olan yetkili hesapları yönetin.</p>
        </div>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
          <Plus className="h-4 w-4" />
          Yetkili Ekle (Geliştirme Aşamasında)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">E-posta</th>
                <th className="px-6 py-4">Rol / Yetki Seviyesi</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-sm">
                      AD
                    </div>
                    Sistem Yöneticisi
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">admin@platform.com</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <Shield className="h-3 w-3" />
                    SUPER_ADMIN
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-slate-400">Sabit Hesap</span>
                </td>
              </tr>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      {u.name || "İsimsiz"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      Müşteri
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-300 cursor-not-allowed" title="Yetki değiştirme kapalı">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-slate-300 cursor-not-allowed" title="Kullanıcı silme kapalı">
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
