"use client"

import { useState } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import { saveSettings } from "../ayarlar/actions" // We can reuse this!

export function ClientShippingForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")

  async function action(formData: FormData) {
    setIsPending(true)
    setMessage("")
    try {
      await saveSettings(formData)
      setMessage("Kargo ayarları başarıyla güncellendi.")
    } catch (e: any) {
      setMessage("Hata: " + e.message)
    }
    setIsPending(false)
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ücretsiz Kargo Eşiği (TL)</label>
          <input 
            type="number" 
            name="free_shipping_threshold"
            defaultValue={initialSettings['free_shipping_threshold'] || '3000'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">Bu tutarın üzerindeki sepetlerde kargo bedava olur.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Standart Kargo Ücreti (TL)</label>
          <input 
            type="number" 
            name="shipping_cost"
            defaultValue={initialSettings['shipping_cost'] || '249'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">Eşik altı siparişlerde uygulanan sabit ücret.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Aynı Gün (Anadolu) Ücreti (TL)</label>
          <input 
            type="number" 
            name="same_day_anadolu"
            defaultValue={initialSettings['same_day_anadolu'] || '199'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Aynı Gün (Avrupa) Ücreti (TL)</label>
          <input 
            type="number" 
            name="same_day_avrupa"
            defaultValue={initialSettings['same_day_avrupa'] || '299'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex-1">
          {message && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg transition-colors ${
            isPending 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <Save className="h-4 w-4" />
          {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  )
}
