"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/useCartStore"
import { Check, ShoppingBag, ArrowRight, X, Sparkles } from "lucide-react"

export function CartNotificationModal() {
  const isCartModalOpen = useCartStore((state) => state.isCartModalOpen)
  const lastAddedItem = useCartStore((state) => state.lastAddedItem)
  const closeCartModal = useCartStore((state) => state.closeCartModal)
  const getTotal = useCartStore((state) => state.getTotal)
  const getItemCount = useCartStore((state) => state.getItemCount)

  // ESC tuşuyla kapatma desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCartModal()
      }
    }
    if (isCartModalOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isCartModalOpen, closeCartModal])

  if (!isCartModalOpen || !lastAddedItem) {
    return null
  }

  const cartTotal = getTotal()
  const itemCount = getItemCount()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Arka plan tıklama alanı */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={closeCartModal}
      />

      {/* Modal / Bottom Sheet Kartı */}
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Çizgi (Mobilde kaydırma tutamacı) */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Başlığı */}
        <div className="px-6 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                Ürün Sepetinize Eklendi!
              </h3>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" /> Sepetiniz güncellendi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCartModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Eklenen Ürün Kartı */}
        <div className="p-5 sm:p-6 bg-slate-50/60">
          <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center">
              {lastAddedItem.image ? (
                <img 
                  src={lastAddedItem.image} 
                  alt={lastAddedItem.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <ShoppingBag className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                {lastAddedItem.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {lastAddedItem.quantity} Adet × ₺{Number(lastAddedItem.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm sm:text-base font-black text-amber-600">
                ₺{Number(lastAddedItem.price * lastAddedItem.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Sepet Özeti Bilgi Şeridi */}
          <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">
              Sepetinizde Toplam <strong>{itemCount} ürün</strong> var
            </span>
            <span className="font-black text-slate-900">
              ₺{cartTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Aksiyon Butonları (Sepete Git / Alışverişe Devam Et) */}
        <div className="p-5 sm:p-6 pt-3 bg-white space-y-2.5">
          <Link
            href="/sepet"
            onClick={closeCartModal}
            className="w-full bg-brand-gold hover:bg-amber-400 text-slate-950 font-black py-3.5 px-4 rounded-xl text-center text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sepete Git</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={closeCartModal}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-center text-xs sm:text-sm transition-colors"
          >
            Alışverişe Devam Et
          </button>
        </div>

      </div>
    </div>
  )
}
