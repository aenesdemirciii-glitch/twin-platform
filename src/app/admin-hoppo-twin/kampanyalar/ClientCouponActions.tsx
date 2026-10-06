"use client"

import { useState } from "react"
import { createCoupon, deleteCoupon } from "./actions"
import { Trash2, Plus, X } from "lucide-react"

export function DeleteCouponButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return
    setIsPending(true)
    try {
      await deleteCoupon(id)
    } catch (e: any) {
      alert(e.message)
    }
    setIsPending(false)
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`p-1.5 transition-colors ${isPending ? 'text-slate-300' : 'text-slate-400 hover:text-rose-600'}`}
      title="Sil"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}

export function NewCouponModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  async function action(formData: FormData) {
    setIsPending(true)
    setError("")
    try {
      await createCoupon(formData)
      setIsOpen(false)
    } catch (e: any) {
      setError(e.message)
    }
    setIsPending(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-500 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Kupon Oluştur
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Yeni Kupon Ekle</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form action={action} className="p-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kupon Kodu</label>
                <input required type="text" name="code" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-amber-400 focus:border-amber-400 outline-none" placeholder="YAZ2024" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İndirim Türü</label>
                <select required name="type" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-amber-400 focus:border-amber-400 outline-none">
                  <option value="PERCENTAGE">Yüzdelik (%)</option>
                  <option value="FIXED">Sabit Tutar (TL)</option>
                  <option value="FREE_SHIPPING">Kargo Bedava</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İndirim Değeri (Tutar veya %)</label>
                <input required type="number" step="0.01" name="value" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-amber-400 focus:border-amber-400 outline-none" placeholder="15" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kullanım Sınırı (Opsiyonel)</label>
                <input type="number" name="usageLimit" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-amber-400 focus:border-amber-400 outline-none" placeholder="100" />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isPending} className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-300 transition-colors">
                  {isPending ? "Kaydediliyor..." : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
