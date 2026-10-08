"use client"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { useEffect, Suspense } from "react"
import { useCartStore } from "@/store/useCartStore"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
  const { clearCart } = useCartStore()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || ""

  useEffect(() => {
    // Odeme basarili oldugu icin sepeti temizle
    clearCart()
  }, [clearCart])

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-black text-brand-slate mb-4">Siparişiniz Alındı!</h1>
      <p className="text-slate-600 mb-8 font-medium leading-relaxed">
        Teşekkür ederiz. Ödemeniz iyzico güvencesiyle başarıyla tamamlandı. Sipariş numaranız:
        <br />
        <strong className="text-xl mt-2 block break-all">#{orderId.split('-')[0].toUpperCase()}</strong>
      </p>
      
      <p className="text-sm text-slate-500 mb-8">
        Sipariş detaylarınız kayıtlı e-posta adresinize gönderildi. Sipariş durumunuzu üye panelinizden takip edebilirsiniz.
      </p>

      <Link href="/" className="inline-flex items-center justify-center w-full bg-brand-slate text-white font-bold py-4 rounded-xl hover:bg-brand-gold hover:text-brand-slate transition-colors text-lg">
        Alışverişe Dön <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  )
}

export default function OdemeBasariliPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
