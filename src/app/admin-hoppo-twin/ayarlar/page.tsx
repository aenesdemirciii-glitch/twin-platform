import prisma from "@/lib/prisma"
import { Save, AlertCircle } from "lucide-react"

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findMany()
  const settingsMap = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Site Ayarları</h2>
        <p className="text-sm text-slate-500 mt-1">Mağaza bilgileri, logo, sosyal medya ve genel ayarlar.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <form className="space-y-8">
          
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h3 className="text-lg font-semibold text-slate-800">Mağaza Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mağaza Adı</label>
                <input 
                  type="text" 
                  defaultValue={settingsMap['store_name'] || "İKİZLER Baharatçılık"}
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">E-posta Adresi</label>
                <input 
                  type="email" 
                  defaultValue={settingsMap['store_email'] || "info@ikizlerbaharatcilik.com"}
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon Numarası</label>
                <input 
                  type="text" 
                  defaultValue={settingsMap['store_phone'] || "0534 720 19 00"}
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Açık Adres</label>
                <textarea 
                  defaultValue={settingsMap['store_address'] || "Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul"}
                  disabled
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Sosyal Medya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram URL</label>
                <input 
                  type="text" 
                  defaultValue={settingsMap['social_instagram'] || "https://www.instagram.com/ikizlerbaharatcilik/"}
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Facebook URL</label>
                <input 
                  type="text" 
                  defaultValue={settingsMap['social_facebook'] || "https://www.facebook.com/ikizlerbaharatcilik/"}
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Ayarlar şu anda tasarım dosyalarından çekilmektedir. Form kapalıdır.
            </div>
            <button type="button" disabled className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-400 font-semibold rounded-lg cursor-not-allowed">
              <Save className="h-4 w-4" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
