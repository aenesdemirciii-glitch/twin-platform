"use client"

import { useState } from "react"
import { Upload, SkipForward, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react"
import { addImageToProduct } from "./actions"

export function FastUploaderClient({ products }: { products: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  if (products.length === 0 || currentIndex >= products.length) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Harika!</h3>
        <p className="text-slate-500">Tüm ürünlerin en az bir görseli var. Görselsiz ürün kalmadı.</p>
      </div>
    )
  }

  const currentProduct = products[currentIndex]

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setIsUploading(true)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      // 1. Upload to storage
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      
      if (res.ok && data.url) {
        // 2. Attach to product
        await addImageToProduct(currentProduct.id, data.url)
        // 3. Move to next product automatically
        setCurrentIndex(prev => prev + 1)
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

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
        <div>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-3">
            Kalan Ürün: {products.length - currentIndex}
          </span>
          <h3 className="text-xl font-bold text-slate-800">{currentProduct.name}</h3>
          <p className="text-sm text-slate-500 mt-1">SKU: {currentProduct.sku} | Fiyat: {currentProduct.price} TL</p>
        </div>
        
        <button 
          onClick={() => setCurrentIndex(prev => prev + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
          disabled={isUploading}
        >
          Sonrakine Geç <SkipForward className="w-4 h-4" />
        </button>
      </div>

      <div className="p-8">
        <label className={`w-full aspect-[2/1] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
          isUploading 
            ? 'border-emerald-300 bg-emerald-50 text-emerald-500 pointer-events-none' 
            : 'border-slate-300 bg-slate-50 text-slate-500 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600'
        }`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 mb-4 animate-spin" />
              <p className="text-lg font-bold">Görsel Yükleniyor ve Kaydediliyor...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 mb-4" />
              <p className="text-lg font-bold mb-2">Görsel Yüklemek İçin Tıklayın veya Sürükleyin</p>
              <p className="text-sm opacity-80">Yükleme biter bitmez otomatik olarak sıradaki ürüne geçecektir.</p>
            </>
          )}
        </label>
      </div>
      
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-amber-400 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(currentIndex / products.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-center text-slate-500 mt-2">
          %{( (currentIndex / products.length) * 100 ).toFixed(0)} Tamamlandı
        </p>
      </div>
    </div>
  )
}
