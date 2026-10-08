"use client"

import { useState, useRef } from "react"
import { Save, CheckCircle2, Upload, Loader2, X, Image as ImageIcon } from "lucide-react"
import { saveSettings } from "@/app/admin-hoppo-twin/ayarlar/actions"

export function ClientBannerForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")
  
  const [bannerUrl, setBannerUrl] = useState(initialSettings['home_hero_image'] || "")
  const [isUploading, setIsUploading] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    setIsUploading(true)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setBannerUrl(data.url)
      } else {
        alert(data.error || "Yükleme başarısız")
      }
    } catch (err) {
      console.error(err)
      alert("Yükleme sırasında hata oluştu")
    } finally {
      setIsUploading(false)
    }
    
    e.target.value = ""
  }

  async function action(formData: FormData) {
    setIsPending(true)
    setMessage("")
    try {
      await saveSettings(formData)
      setMessage("Banner ayarları başarıyla kaydedildi.")
      setTimeout(() => setMessage(""), 3000)
    } catch (e: any) {
      setMessage("Hata: " + e.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form action={action} className="space-y-6">
      
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 font-medium ${message.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message.startsWith("Hata") ? <X className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Ana Sayfa Büyük Banner</h3>
          <p className="text-sm text-slate-500 mb-6">Müşterilerin sitenize girdiğinde ilk göreceği büyük görsel ve yazılar.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sol Kolon - Görsel Yükleme */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Banner Görseli (Tavsiye: 1000x1000 veya daha büyük)</label>
            <div className="relative aspect-square w-full max-w-sm rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 overflow-hidden group">
              {bannerUrl ? (
                <>
                  <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button" 
                      onClick={() => inputRef.current?.click()}
                      className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" /> Değiştir
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 mb-4">Henüz görsel seçilmedi</p>
                  <button 
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-amber-500 transition-colors mx-auto"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {isUploading ? "Yükleniyor..." : "Görsel Seç"}
                  </button>
                </div>
              )}
            </div>
            <input type="file" ref={inputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <input type="hidden" name="home_hero_image" value={bannerUrl} />
            {bannerUrl && (
              <button type="button" onClick={() => setBannerUrl("")} className="text-sm text-red-600 font-medium hover:underline">Görseli Kaldır</button>
            )}
          </div>

          {/* Sağ Kolon - Metinler */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Etiket / Kategori Yazısı (Örn: KIŞA HAZIR)</label>
              <input 
                type="text" 
                name="home_hero_tag" 
                defaultValue={initialSettings['home_hero_tag'] || ""}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Ana Başlık</label>
              <input 
                type="text" 
                name="home_hero_title" 
                defaultValue={initialSettings['home_hero_title'] || ""}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm font-bold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Alt Açıklama (Subtitle)</label>
              <textarea 
                name="home_hero_subtitle" 
                defaultValue={initialSettings['home_hero_subtitle'] || ""}
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Buton Yazısı</label>
                <input 
                  type="text" 
                  name="home_hero_button_text" 
                  defaultValue={initialSettings['home_hero_button_text'] || ""}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Buton Linki (örn: /urun/ornek)</label>
                <input 
                  type="text" 
                  name="home_hero_button_link" 
                  defaultValue={initialSettings['home_hero_button_link'] || ""}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <div className="flex justify-end gap-3 sticky bottom-6 z-10">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  )
}
