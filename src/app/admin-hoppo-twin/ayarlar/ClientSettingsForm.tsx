"use client"

import { useState } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import { saveSettings } from "./actions"

export function ClientSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")

  async function action(formData: FormData) {
    setIsPending(true)
    setMessage("")
    try {
      await saveSettings(formData)
      setMessage("Ayarlar başarıyla kaydedildi.")
    } catch (e: any) {
      setMessage("Hata: " + e.message)
    }
    setIsPending(false)
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <form action={action} className="space-y-8">
      
      {/* Genel Bilgiler */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <h3 className="text-lg font-semibold text-slate-800">Mağaza Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mağaza Adı (Site Title)</label>
            <input 
              type="text" 
              name="store_name"
              defaultValue={initialSettings['store_name'] || "İKİZLER Baharatçılık"}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">E-posta Adresi</label>
            <input 
              type="email" 
              name="store_email"
              defaultValue={initialSettings['store_email'] || "info@ikizlerbaharatcilik.com"}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon Numarası</label>
            <input 
              type="text" 
              name="store_phone"
              defaultValue={initialSettings['store_phone'] || "0534 720 19 00"}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Açık Adres</label>
            <textarea 
              name="store_address"
              defaultValue={initialSettings['store_address'] || "Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul"}
              rows={3}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Görünüm Ayarları */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <h3 className="text-lg font-semibold text-slate-800">Görünüm Ayarları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Logo URL (Header/Footer)</label>
            <input 
              type="text" 
              name="site_logo"
              defaultValue={initialSettings['site_logo'] || ""}
              placeholder="https://cdn.../logo.png"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Favicon / Site İkonu URL</label>
            <input 
              type="text" 
              name="site_favicon"
              defaultValue={initialSettings['site_favicon'] || ""}
              placeholder="https://cdn.../favicon.ico"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sosyal Medya */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <h3 className="text-lg font-semibold text-slate-800">Sosyal Medya</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram URL</label>
            <input 
              type="text" 
              name="social_instagram"
              defaultValue={initialSettings['social_instagram'] || "https://www.instagram.com/ikizlerbaharatcilik/"}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Facebook URL</label>
            <input 
              type="text" 
              name="social_facebook"
              defaultValue={initialSettings['social_facebook'] || "https://www.facebook.com/ikizlerbaharatcilik/"}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Ödeme / Iyzico */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <h3 className="text-lg font-semibold text-slate-800">İyzico Ödeme Entegrasyonu</h3>
        <p className="text-sm text-slate-500 mb-4">Müşterilerden online kredi kartı ile ödeme almak için gerekli API anahtarlarını girin.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">API Key</label>
            <input 
              type="text" 
              name="iyzico_api_key"
              defaultValue={initialSettings['iyzico_api_key'] || ""}
              placeholder="sandbox-..."
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Secret Key</label>
            <input 
              type="password" 
              name="iyzico_secret_key"
              defaultValue={initialSettings['iyzico_secret_key'] || ""}
              placeholder="sandbox-..."
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Base URL</label>
            <input 
              type="text" 
              name="iyzico_base_url"
              defaultValue={initialSettings['iyzico_base_url'] || "https://sandbox-api.iyzipay.com"}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Canlı ortam için: https://api.iyzipay.com</p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
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
