import prisma from "@/lib/prisma"
import { Search, Tag, Edit } from "lucide-react"
import { NewCouponModal, DeleteCouponButton } from "./ClientCouponActions"

import { SearchInput } from "@/components/admin/SearchInput"

export default async function AdminCampaignsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";

  const coupons = await prisma.coupon.findMany({
    where: q ? { code: { contains: q } } : undefined,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kampanyalar ve Kuponlar</h2>
          <p className="text-sm text-slate-500 mt-1">İndirim kodlarını ve kampanya koşullarını yönetin.</p>
        </div>
        <NewCouponModal />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <SearchInput placeholder="Kupon kodu ile ara..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Kupon Kodu</th>
                <th className="px-6 py-4">Değer / Tür</th>
                <th className="px-6 py-4">Kullanım Durumu</th>
                <th className="px-6 py-4">Bitiş Tarihi</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 tracking-wide">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-amber-500" />
                        {coupon.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {coupon.type === "PERCENTAGE" ? `%${coupon.value}` : 
                       coupon.type === "FREE_SHIPPING" ? "Kargo Bedava" : 
                       `₺${coupon.value}`}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'Kullanım (Sınırsız)'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {coupon.endDate ? coupon.endDate.toLocaleDateString('tr-TR') : 'Süresiz'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        coupon.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {coupon.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-300 " >
                          <Edit className="h-4 w-4" />
                        </button>
                        <DeleteCouponButton id={coupon.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Sistemde henüz indirim kuponu tanımlanmamış.
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
