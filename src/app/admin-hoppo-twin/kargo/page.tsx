import prisma from "@/lib/prisma"
import { Truck, Save } from "lucide-react"

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

  // Defaults fallback
  const freeShippingThreshold = settingsMap['free_shipping_threshold'] || '3000'
  const shippingCost = settingsMap['shipping_cost'] || '249'
  const sameDayAnadolu = settingsMap['same_day_anadolu'] || '199'
  const sameDayAvrupa = settingsMap['same_day_avrupa'] || '299'

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kargo ve Teslimat</h2>
          <p className="text-sm text-slate-500 mt-1">Sabit kargo ücretleri ve bedava kargo eşiklerini yönetin.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ücretsiz Kargo Eşiği (TL)</label>
              <input 
                type="number" 
                defaultValue={freeShippingThreshold}
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Bu tutarın üzerindeki sepetlerde kargo bedava olur.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Standart Kargo Ücreti (TL)</label>
              <input 
                type="number" 
                defaultValue={shippingCost}
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Eşik altı siparişlerde uygulanan sabit ücret.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Aynı Gün (Anadolu) Ücreti (TL)</label>
              <input 
                type="number" 
                defaultValue={sameDayAnadolu}
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Aynı Gün (Avrupa) Ücreti (TL)</label>
              <input 
                type="number" 
                defaultValue={sameDayAvrupa}
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-amber-600 font-medium">Form düzenleme yetkisi henüz aktif değildir.</p>
            <button type="button" disabled className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-400 font-semibold rounded-lg cursor-not-allowed">
              <Save className="h-4 w-4" />
              Ayarları Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
