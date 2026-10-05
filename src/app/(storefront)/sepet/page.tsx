"use client"

import Link from "next/link"
import { useCartStore } from "@/store/useCartStore"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Trash2 className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-brand-slate mb-4">Sepetiniz Boş</h2>
        <p className="text-slate-500 mb-8 max-w-md">Sepetinizde henüz ürün bulunmuyor. Harika lezzetlerimizi keşfetmek için mağazamıza göz atın.</p>
        <Link href="/" className="bg-brand-gold text-brand-slate font-bold px-8 py-3 rounded-lg hover:bg-[#e6bb45] transition-colors">
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-brand-slate mb-10">Sepetim</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="h-24 w-24 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                <span className="text-xs text-slate-400">Görsel</span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-slate text-lg">{item.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">SKU: {item.sku}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 font-medium text-brand-slate border-x border-slate-200 text-sm">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-bold text-brand-slate text-lg">{(item.price * item.quantity).toFixed(2)} TL</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-brand-slate mb-6">Sipariş Özeti</h3>
            
            <div className="space-y-4 text-sm mb-6 pb-6 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Ara Toplam</span>
                <span className="font-medium text-slate-800">{getTotal().toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Kargo</span>
                <span className="text-emerald-600 font-medium">Ücretsiz</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-brand-slate">Genel Toplam</span>
              <span className="text-2xl font-bold text-brand-gold">{getTotal().toFixed(2)} TL</span>
            </div>
            
            <Link 
              href="/checkout" 
              className="flex items-center justify-center gap-2 w-full bg-brand-slate text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Güvenli Ödeme <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
