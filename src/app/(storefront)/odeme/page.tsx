"use client"

import { useCartStore } from "@/store/useCartStore"
import { ShieldCheck } from "lucide-react"

export default function CheckoutPage() {
  const { getTotal } = useCartStore()

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <h1 className="text-2xl font-bold text-brand-slate mb-8">Güvenli Ödeme</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-brand-slate mb-4">Teslimat Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adınız</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Soyadınız</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teslimat Adresi</label>
                  <textarea rows={3} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-emerald-500 h-5 w-5" />
                <h2 className="text-lg font-bold text-brand-slate">Ödeme Bilgileri</h2>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 flex items-center justify-center text-slate-500 text-sm text-center">
                Iyzico Ödeme Formu burada yüklenecektir. (Server-side oluşturulan token ile initialize edilecek.)
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-brand-slate mb-4">Sipariş Özeti</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Ödenecek Tutar</span>
                  <span className="font-bold text-brand-slate">{getTotal().toFixed(2)} TL</span>
                </div>
              </div>
              <button className="w-full bg-brand-gold text-brand-slate font-bold py-3 rounded-lg hover:bg-[#e6bb45] transition-colors">
                Ödemeyi Tamamla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
