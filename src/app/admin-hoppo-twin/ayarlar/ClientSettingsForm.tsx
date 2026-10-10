"use client"

import { useState, useRef } from "react"
import { Save, CheckCircle2, Upload, Loader2, X, Image as ImageIcon } from "lucide-react"
import { saveSettings } from "./actions"

export function ClientSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")
  
  const [logoUrl, setLogoUrl] = useState(initialSettings['site_logo'] || "")
  const [faviconUrl, setFaviconUrl] = useState(initialSettings['site_favicon'] || "")
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)
  
  const [reelsCovers, setReelsCovers] = useState<string[]>([
    initialSettings['reel_1_cover'] || "",
    initialSettings['reel_2_cover'] || "",
    initialSettings['reel_3_cover'] || "",
    initialSettings['reel_4_cover'] || ""
  ])
  const [isUploadingReel, setIsUploadingReel] = useState([false, false, false, false])
  
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    if (type === 'logo') setIsUploadingLogo(true)
    else setIsUploadingFavicon(true)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (res.ok && data.url) {
        if (type === 'logo') setLogoUrl(data.url)
        else setFaviconUrl(data.url)
      } else {
        alert(data.error || "Yükleme başarısız")
      }
    } catch (err) {
      console.error(err)
      alert("Yükleme sırasında hata oluştu")
    }
    
    if (type === 'logo') setIsUploadingLogo(false)
    else setIsUploadingFavicon(false)
    
    e.target.value = "" // reset
  }

  async function handleReelUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    const newUploading = [...isUploadingReel]
    newUploading[index] = true
    setIsUploadingReel(newUploading)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (res.ok && data.url) {
        const newCovers = [...reelsCovers]
        newCovers[index] = data.url
        setReelsCovers(newCovers)
      } else {
        alert(data.error || "Yükleme başarısız")
      }
    } catch (err) {
      console.error(err)
      alert("Yükleme sırasında hata oluştu")
    }
    
    const newUploadingEnd = [...isUploadingReel]
    newUploadingEnd[index] = false
    setIsUploadingReel(newUploadingEnd)
    e.target.value = ""
  }

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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Logo (Header/Footer)</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 relative overflow-hidden shrink-0 group">
                {logoUrl ? (
                  <>
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    <button type="button" onClick={() => setLogoUrl("")} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Yok</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input type="hidden" name="site_logo" value={logoUrl} />
                <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => handleFileUpload(e, 'logo')} />
                <button 
                  type="button" 
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  {isUploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploadingLogo ? "Yükleniyor..." : "PC'den Logo Yükle"}
                </button>
                <p className="text-xs text-slate-500">Önerilen: Şeffaf arka planlı PNG (Örn: 200x50px)</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Favicon / Site İkonu</label>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 relative overflow-hidden shrink-0 group">
                {faviconUrl ? (
                  <>
                    <img src={faviconUrl} alt="Favicon" className="w-full h-full object-contain p-1" />
                    <button type="button" onClick={() => setFaviconUrl("")} className="absolute top-0 right-0 bg-white/90 p-1 rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Yok</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input type="hidden" name="site_favicon" value={faviconUrl} />
                <input type="file" accept="image/*" className="hidden" ref={faviconInputRef} onChange={(e) => handleFileUpload(e, 'favicon')} />
                <button 
                  type="button" 
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={isUploadingFavicon}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  {isUploadingFavicon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploadingFavicon ? "Yükleniyor..." : "PC'den İkon Yükle"}
                </button>
                <p className="text-xs text-slate-500">Önerilen: Kare formatta PNG veya ICO (Örn: 32x32px veya 128x128px)</p>
              </div>
            </div>
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

      {/* Instagram Reels Ayarları */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <h3 className="text-lg font-semibold text-slate-800">Instagram Reels (Ana Sayfa)</h3>
        <p className="text-sm text-slate-500 mb-4">Ana sayfada sergilenecek 4 adet Instagram Reels videosunun kapak fotoğrafını ve Instagram linkini girin.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((num, i) => (
            <div key={num} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-700">Reels {num}</h4>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kapak Görseli</label>
                {reelsCovers[i] ? (
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden border border-slate-200 mb-2 group">
                    <img src={reelsCovers[i]} alt={`Reel ${num}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => {
                      const newCovers = [...reelsCovers];
                      newCovers[i] = "";
                      setReelsCovers(newCovers);
                    }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[9/16] rounded-lg border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 mb-2 p-4 text-center">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-xs">Görsel Yükle (9:16)</span>
                  </div>
                )}
                
                <input type="hidden" name={`reel_${num}_cover`} value={reelsCovers[i]} />
                
                <label className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                  {isUploadingReel[i] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploadingReel[i] ? "Yükleniyor..." : "Görsel Seç"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReelUpload(e, i)} disabled={isUploadingReel[i]} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Instagram Linki</label>
                <input 
                  type="url" 
                  name={`reel_${num}_link`}
                  defaultValue={initialSettings[`reel_${num}_link`] || ""}
                  placeholder="https://instagram.com/p/..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
                />
              </div>
            </div>
          ))}
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
