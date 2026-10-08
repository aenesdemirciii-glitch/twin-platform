"use client"

import { useState } from "react"
import { Save, Search } from "lucide-react"

export default function VitrinClient({ products }: { products: any[] }) {
  const [bestSellerIds, setBestSellerIds] = useState<string[]>(
    products.filter(p => p.isFeatured).map(p => p.id)
  )
  const [popularIds, setPopularIds] = useState<string[]>(
    products.filter(p => p.isNew).map(p => p.id)
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleBestSeller = (id: string) => {
    if (bestSellerIds.includes(id)) {
      setBestSellerIds(prev => prev.filter(pId => pId !== id))
    } else {
      if (bestSellerIds.length >= 8) {
        setMessage({ type: "error", text: "En fazla 8 Çok Satan ürün seçebilirsiniz." })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
        return
      }
      setBestSellerIds(prev => [...prev, id])
    }
  }

  const togglePopular = (id: string) => {
    if (popularIds.includes(id)) {
      setPopularIds(prev => prev.filter(pId => pId !== id))
    } else {
      if (popularIds.length >= 8) {
        setMessage({ type: "error", text: "En fazla 8 Popüler Ürün seçebilirsiniz." })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
        return
      }
      setPopularIds(prev => [...prev, id])
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ type: "", text: "" })
    
    try {
      const res = await fetch("/api/admin/vitrin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bestSellerIds, popularIds })
      })

      if (!res.ok) throw new Error("Kaydedilemedi")

      setMessage({ type: "success", text: "Vitrin başarıyla güncellendi!" })
    } catch (error: any) {
      setMessage({ type: "error", text: "Bir hata oluştu." })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">
      
      {/* Action Bar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          {message.text && (
            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </span>
          )}
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Çok Satan: <strong className="text-amber-600">{bestSellerIds.length}/8</strong></span>
            <span>Popüler: <strong className="text-amber-600">{popularIds.length}/8</strong></span>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const isBestSeller = bestSellerIds.includes(product.id)
            const isPopular = popularIds.includes(product.id)
            
            return (
              <div key={product.id} className="border border-slate-200 rounded-lg p-3 flex flex-col gap-3 hover:border-amber-300 transition-colors bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400">Görsel Yok</span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm text-slate-800 line-clamp-2 leading-tight flex-1">{product.name}</h3>
                </div>
                
                <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isBestSeller ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 group-hover:border-amber-400'}`}>
                      {isBestSeller && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isBestSeller} onChange={() => toggleBestSeller(product.id)} />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Çok Satanlara Ekle</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPopular ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 group-hover:border-amber-400'}`}>
                      {isPopular && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isPopular} onChange={() => togglePopular(product.id)} />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Popüler Ürünlere Ekle</span>
                  </label>
                </div>
              </div>
            )
          })}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              Aramanızla eşleşen ürün bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
