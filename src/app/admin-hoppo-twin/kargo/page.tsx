import prisma from "@/lib/prisma"
import { ClientShippingForm } from "./ClientShippingForm"

export default async function AdminShippingPage() {
  const settings = await prisma.settings.findMany({
    where: {
      key: { in: ['free_shipping_threshold', 'shipping_cost', 'same_day_anadolu', 'same_day_avrupa'] }
    }
  })

  // Create a map for easy access
  const settingsMap = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kargo ve Teslimat</h2>
          <p className="text-sm text-slate-500 mt-1">Sabit kargo ücretleri ve bedava kargo eşiklerini yönetin.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <ClientShippingForm initialSettings={settingsMap} />
      </div>
    </div>
  )
}
