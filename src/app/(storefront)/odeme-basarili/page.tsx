"use client"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Package, Truck, PhoneCall } from "lucide-react"
import { useEffect, Suspense } from "react"
import { useCartStore } from "@/store/useCartStore"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
  const { clearCart } = useCartStore()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || ""
  const orderNumberParam = searchParams.get("orderNumber")
  const orderNumber = orderNumberParam || (orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : "#IKZ-SİPARİŞ")

  useEffect(() => {
    // Ödeme başarılı olduğu için sepeti temizle
    clearCart()
  }, [clearCart])

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-200">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Siparişiniz Alındı!</h1>
      <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
        Teşekkür ederiz. Ödemeniz <strong>iyzico güvencesiyle</strong> başarıyla tamamlandı.
      </p>

      {/* Sipariş Numarası Kartı */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-6">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">Sipariş Takip Numaranız</span>
        <strong className="text-xl md:text-2xl font-mono text-slate-900 block mt-1 tracking-wide">
          {orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`}
        </strong>
        <p className="text-[11px] text-amber-700 mt-1">Sipariş detayları ve faturanız kayıtlı e-posta adresinize iletildi.</p>
      </div>

      {/* Sonraki Adımlar */}
      <div className="text-left space-y-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <Package className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Siparişiniz taze baharat ve gıda standartlarına uygun olarak özenle paketleniyor.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Kargoya teslim edildiğinde SMS ve e-posta ile takip numarası gönderilecektir.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <PhoneCall className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Her türlü soru için: <strong>0216 384 48 37</strong> veya WhatsApp hattımızdan bize ulaşabilirsiniz.</span>
        </div>
      </div>

      <div className="space-y-3">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-slate-800 transition-colors text-sm shadow-md"
        >
          Alışverişe Devam Et <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default function OdemeBasariliPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-500 text-sm">Yükleniyor...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
