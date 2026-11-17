"use client"

import { useState } from "react"
import { createProduct, updateProduct } from "../actions"
import { useRouter } from "next/navigation"
import { Search, Image as ImageIcon, X, Loader2, Save, DownloadCloud } from "lucide-react"

export function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  
  const [images, setImages] = useState<any[]>(initialData?.images || [])
  const [variants, setVariants] = useState<any[]>(initialData?.variants || [])
  const [showImageModal, setShowImageModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Unsplash state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null) // stores ID of currently downloading image

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setIsUploading(true)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setImages([...images, { url: data.url, creator: "Yüklenen", license: "Yerel" }])
      } else {
        alert(data.error || "Yükleme başarısız")
      }
    } catch (err) {
      console.error(err)
      alert("Yükleme sırasında hata oluştu")
    }
    
    setIsUploading(false)
    e.target.value = "" // Reset input
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const res = await fetch(`/api/admin/images/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.results) {
        setSearchResults(data.results)
      } else if (data.error) {
        alert(data.error)
      }
    } catch (e) {
      console.error(e)
    }
    setIsSearching(false)
  }

  async function handleSelectImage(img: any) {
    setIsDownloading(img.id)
    try {
      const res = await fetch('/api/admin/images/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: img.urls.regular,
          altText: img.alt_description || "Ürün görseli",
          creator: img.user?.name || "Bilinmiyor"
        })
      })
      const data = await res.json()
      
      if (data.localUrl) {
        setImages(prev => [...prev, {
          url: data.localUrl,
          sourceUrl: img.links?.html || img.urls.regular,
          creator: img.user?.name || "Bilinmiyor",
        }])
        setShowImageModal(false)
      } else {
        alert(data.error || "İndirme başarısız.")
      }
    } catch (e: any) {
      alert("Hata: " + e.message)
    }
    setIsDownloading(null)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      categoryId: formData.get("categoryId"),
      price: formData.get("price"),
      discountPrice: formData.get("discountPrice"),
      stock: formData.get("stock"),
      shortDescription: formData.get("shortDescription"),
      longDescription: formData.get("longDescription"),
      seoTitle: formData.get("seoTitle"),
      seoDescription: formData.get("seoDescription"),
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      isNew: formData.get("isNew") === "on",
      images,
      variants
    }

    try {
      if (initialData?.id) {
        await updateProduct(initialData.id, data)
      } else {
        await createProduct(data)
      }
      router.push("/admin-hoppo-twin/urunler")
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setIsPending(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Kolon - Detaylar */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Temel Bilgiler</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ürün Adı</label>
                <input required type="text" name="name" defaultValue={initialData?.name || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stok Kodu (SKU)</label>
                  <input required type="text" name="sku" defaultValue={initialData?.sku || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select name="categoryId" defaultValue={initialData?.categoryId || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none bg-white">
                    <option value="">Kategori Seçin</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ürün Açıklamaları */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-semibold text-slate-800 text-base">Ürün Açıklamaları</h3>
                <p className="text-xs text-slate-500 mt-0.5">Sitede ürün detay sayfasında ve listelerde görünen açıklamaları buradan düzenleyin.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kısa Açıklama (Ürün Özeti / Üst Açıklama)
                </label>
                <textarea 
                  rows={3}
                  name="shortDescription" 
                  defaultValue={initialData?.shortDescription || ""} 
                  placeholder="Ürün sayfasında fiyatın ve başlığın hemen altında görünen özet tanıtım metni..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none text-sm text-slate-800"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ürünün en belirgin özelliklerini anlatan 1-2 cümlelik kısa tanıtım.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Detaylı Ürün Açıklaması & Paket Detayları
                  </label>
                  <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Markdown Destekli (Başlıklar, Maddeler)
                  </span>
                </div>
                <textarea 
                  rows={8}
                  name="longDescription" 
                  defaultValue={initialData?.longDescription || ""} 
                  placeholder={"## Ürün Açıklaması\nİkizler Baharatçılık kalitesiyle hazırlanan bu özel lezzet...\n\n### Faydaları ve Özellikleri\n- %100 Doğal ve Taze\n- Katkısız ve Koruyucusuz\n- Serin ve kuru yerde muhafaza ediniz."}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none text-sm font-mono text-slate-800 leading-relaxed"
                />
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                  <span>İpuçları:</span>
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">## Başlık</code>
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">### Alt Başlık</code>
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">- Madde işareti</code>
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">**Kalın Yazı**</code>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Fiyat ve Stok</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Orijinal Fiyat (TL)</label>
                  <input required type="number" step="0.01" name="price" defaultValue={initialData?.price ? Number(initialData.price) : ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none" />
                  <span className="text-[11px] text-slate-400 mt-1 block">İndirim yoksa satış fiyatı, indirim varsa üstü çizili fiyat</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">İndirimli Fiyat (TL)</label>
                  <input type="number" step="0.01" name="discountPrice" defaultValue={initialData?.discountPrice ? Number(initialData.discountPrice) : ""} placeholder="Örn: 100" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none" />
                  <span className="text-[11px] text-slate-400 mt-1 block">Müşterinin ödeyeceği tutar (opsiyonel)</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stok Adedi</label>
                  <input required type="number" name="stock" defaultValue={initialData?.stock ?? 0} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none" />
                </div>
              </div>
            </div>

            {/* SEO Bilgileri */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Arama Motoru (SEO)</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEO Başlığı</label>
                <input type="text" name="seoTitle" defaultValue={initialData?.seoTitle || ""} placeholder="Ürün Adı | İkizler Baharatçılık" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEO Açıklaması</label>
                <textarea rows={2} name="seoDescription" defaultValue={initialData?.seoDescription || ""} placeholder="Google aramalarında çıkacak meta açıklaması..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none text-sm" />
              </div>
            </div>

            {/* Varyasyonlar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-semibold text-slate-800">Seçenekler & Varyasyonlar</h3>
                <button type="button" onClick={() => setVariants([...variants, { id: crypto.randomUUID(), name: "", sku: "", price: "", stock: 0 }])} className="text-sm font-medium text-amber-600 hover:text-amber-700">
                  + Seçenek Ekle (Örn: 250g)
                </button>
              </div>
              
              {variants.length > 0 && (
                <div className="space-y-4">
                  {variants.map((v, i) => (
                    <div key={v.id || i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Seçenek Adı (Örn: 250g, Kavrulmuş)</label>
                        <input type="text" value={v.name} onChange={e => { const newV = [...variants]; newV[i].name = e.target.value; setVariants(newV) }} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400" placeholder="250g" />
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">SKU</label>
                        <input type="text" value={v.sku} onChange={e => { const newV = [...variants]; newV[i].sku = e.target.value; setVariants(newV) }} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400" placeholder="SKU-250" />
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Fiyat (TL)</label>
                        <input type="number" step="0.01" value={v.price} onChange={e => { const newV = [...variants]; newV[i].price = e.target.value; setVariants(newV) }} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400" />
                      </div>
                      <div className="w-full sm:w-24">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Stok</label>
                        <input type="number" value={v.stock} onChange={e => { const newV = [...variants]; newV[i].stock = parseInt(e.target.value) || 0; setVariants(newV) }} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400" />
                      </div>
                      <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 mb-[1px]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Görseller */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-semibold text-slate-800">Ürün Görselleri</h3>
                <button type="button" onClick={() => setShowImageModal(true)} className="text-sm font-medium text-amber-600 flex items-center gap-1 hover:text-amber-700">
                  <Search className="h-4 w-4" /> Açık Kaynak Görsel Bul (API)
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                    {img.creator && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate text-center">
                        © {img.creator}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Manuel Yükleme Butonu */}
                <label className={`aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-400 transition-colors bg-slate-50 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 mb-2 animate-spin text-emerald-500" />
                  ) : (
                    <DownloadCloud className="h-6 w-6 mb-2" />
                  )}
                  <span className="text-xs font-medium text-center px-2">Cihazdan<br/>Yükle</span>
                </label>

                {/* API Modal Butonu */}
                <button type="button" onClick={() => setShowImageModal(true)} className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-400 transition-colors bg-slate-50">
                  <ImageIcon className="h-6 w-6 mb-2" />
                  <span className="text-xs font-medium text-center px-2">Görsel<br/>Bul (API)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Durum */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Yayın Durumu</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                <span className="text-sm font-medium text-slate-700">Ürünü hemen yayına al</span>
              </label>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isFeatured" defaultChecked={initialData ? initialData.isFeatured : false} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                <div>
                  <h4 className="font-semibold text-slate-800">Çok Satan Ürün</h4>
                  <p className="text-sm text-slate-500 mt-1">Bu ürün ana sayfada "Çok Satanlar" kısmında gösterilir.</p>
                </div>
              </label>

              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isNew" defaultChecked={initialData ? initialData.isNew : false} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Popüler Ürün</h4>
                    <p className="text-sm text-slate-500 mt-1">Bu ürün ana sayfada "Popüler Ürünler" kısmında gösterilir.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button type="submit" disabled={isPending} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:bg-slate-300 transition-colors shadow-sm">
            <Save className="h-5 w-5" />
            {isPending ? "Kaydediliyor..." : "Ürünü Kaydet"}
          </button>
        </div>
      </form>

      {/* Görsel Bulma Modalı */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-slate-500" /> API ile Lisanslı Görsel Ara
              </h3>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Örn: ceviz, badem, baharat, kahve..." 
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <button onClick={handleSearch} disabled={isSearching} className="px-6 py-2 bg-amber-400 text-slate-900 font-medium rounded-lg hover:bg-amber-500 transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Ara
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              {searchResults.length === 0 && !isSearching && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 py-12">
                  <Search className="h-12 w-12 opacity-20" />
                  <p>Arama yaparak Unsplash kütüphanesinden telifsiz görseller bulabilirsiniz.</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {searchResults.map((img: any) => (
                  <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm">
                    <img src={img.urls.small || img.urls.regular} alt="" className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                      {isDownloading === img.id ? (
                        <div className="text-white flex flex-col items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
                          <span className="text-xs font-medium">İndiriliyor...</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleSelectImage(img)}
                          className="px-4 py-2 bg-amber-400 text-slate-900 text-sm font-bold rounded-lg shadow-lg hover:bg-amber-500 transition-colors flex items-center gap-2"
                        >
                          <DownloadCloud className="h-4 w-4" />
                          Seç ve İndir
                        </button>
                      )}
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <a href={img.user.links?.html} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/80 hover:text-white hover:underline truncate block">
                        📷 {img.user.name}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
