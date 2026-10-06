import prisma from "@/lib/prisma"
import { History, Activity } from "lucide-react"

export default async function AdminAuditLogPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">İşlem Geçmişi</h2>
          <p className="text-sm text-slate-500 mt-1">Panel üzerinde yapılan değişiklikler ve sistem kayıtları.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">İşlem</th>
                <th className="px-6 py-4">Kaynak</th>
                <th className="px-6 py-4">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">
                      {log.createdAt.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {log.user?.name || "Sistem"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        <Activity className="h-3 w-3 text-slate-400" />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">
                      {log.details || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <History className="h-10 w-10 text-slate-300 mb-3" />
                      <p>Kayıtlı işlem geçmişi bulunmuyor veya Audit sistemi pasif.</p>
                    </div>
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
