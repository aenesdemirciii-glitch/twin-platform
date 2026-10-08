"use client"
import Link from "next/link"
import { XCircle, ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ErrorContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason") || "Bilinmeyen bir hata oluştu."

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
      <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-black text-brand-slate mb-4">Ödeme Başarısız</h1>
      <p className="text-slate-600 mb-4 font-medium leading-relaxed">
        İşleminiz gerçekleştirilirken bir hata oluştu. Kredi kartınızdan herhangi bir ücret çekilmemiştir.
      </p>
      
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm font-bold mb-8">
        Hata: {decodeURIComponent(reason)}
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/checkout" className="inline-flex items-center justify-center w-full bg-brand-slate text-white font-bold py-4 rounded-xl hover:bg-brand-gold hover:text-brand-slate transition-colors text-lg">
          Tekrar Dene
        </Link>
        <Link href="/sepet" className="inline-flex items-center justify-center w-full bg-white text-slate-500 font-bold py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-lg">
          <ArrowLeft className="ml-2 w-5 h-5 mr-2" /> Sepete Dön
        </Link>
      </div>
    </div>
  )
}

export default function OdemeBasarisizPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
