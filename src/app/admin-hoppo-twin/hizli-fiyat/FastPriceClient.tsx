"use client"

import { useState, useMemo } from "react"
import { bulkUpdatePrices } from "./actions"
import { Search, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

type ProductData = {
  id: string
  name: string
  sku: string
  price: number
  discountPrice: number | null
  stock: number
  categoryName: string
}

export function FastPriceClient({ initialProducts }: { initialProducts: ProductData[] }) {
  const [products, setProducts] = useState<ProductData[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Track which fields have been edited
  const [editedItems, setEditedItems] = useState<Record<string, Partial<ProductData>>>({})

  const handleInputChange = (id: string, field: keyof ProductData, value: string) => {
    // Parse value depending on field
    let parsedValue: any = value
    if (field === 'price' || field === 'discountPrice') {
      parsedValue = value === "" ? null : parseFloat(value)
    } else if (field === 'stock') {
      parsedValue = value === "" ? 0 : parseInt(value, 10)
    }

    setEditedItems(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: parsedValue
      }
    }))
  }

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const s = search.toLowerCase()
    return products.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s))
  }, [products, search])

  const hasChanges = Object.keys(editedItems).length > 0

  const handleSave = async () => {
    setIsPending(true)
    setMessage("")
    setError("")

    // Construct the payload for the server
    const updates = Object.entries(editedItems).map(([id, edits]) => {
      const original = products.find(p => p.id === id)!
      return {
        id,
        price: edits.price !== undefined ? edits.price : original.price,
        discountPrice: edits.discountPrice !== undefined ? edits.discountPrice : original.discountPrice,
        stock: edits.stock !== undefined ? edits.stock : original.stock
      }
    })

    try {
      const res = await bulkUpdatePrices(updates)
      if (res.success) {
        setMessage(`${res.count} ürün başarıyla güncellendi.`)
        // Update local state
        setProducts(prev => prev.map(p => {
          if (editedItems[p.id]) {
            return { ...p, ...editedItems[p.id] } as ProductData
          }
          return p
        }))
        setEditedItems({}) // Clear edits
        
        setTimeout(() => setMessage(""), 4000)
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu")
    }

    setIsPending(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ürün adı veya SKU ile ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
            hasChanges 
              ? "bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-sm" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isPending ? "Kaydediliyor..." : `Değişiklikleri Kaydet ${hasChanges ? `(${Object.keys(editedItems).length})` : ''}`}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Ürün Adı</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 w-32">Stok</th>
                <th className="px-6 py-4 w-40">Fiyat (₺)</th>
                <th className="px-6 py-4 w-40">İndirimli Fiyat (₺)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => {
                const edits = editedItems[p.id] || {}
                const currentPrice = edits.price !== undefined ? edits.price : p.price
                const currentDiscount = edits.discountPrice !== undefined ? edits.discountPrice : (p.discountPrice || "")
                const currentStock = edits.stock !== undefined ? edits.stock : p.stock
                const isEdited = !!editedItems[p.id]

                return (
                  <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${isEdited ? "bg-amber-50/30" : ""}`}>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">SKU: {p.sku}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {p.categoryName}
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        type="number"
                        value={currentStock}
                        onChange={(e) => handleInputChange(p.id, 'stock', e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded focus:ring-2 focus:ring-amber-400 outline-none transition-colors ${isEdited && edits.stock !== undefined ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        type="number"
                        step="0.01"
                        value={currentPrice}
                        onChange={(e) => handleInputChange(p.id, 'price', e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded focus:ring-2 focus:ring-amber-400 outline-none transition-colors ${isEdited && edits.price !== undefined ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        type="number"
                        step="0.01"
                        placeholder="Yok"
                        value={currentDiscount === null ? "" : currentDiscount}
                        onChange={(e) => handleInputChange(p.id, 'discountPrice', e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded focus:ring-2 focus:ring-amber-400 outline-none transition-colors ${isEdited && edits.discountPrice !== undefined ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}
                      />
                    </td>
                  </tr>
                )
              })}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Aramanızla eşleşen ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
