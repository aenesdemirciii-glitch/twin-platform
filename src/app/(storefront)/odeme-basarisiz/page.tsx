"use client"
import Link from "next/link"
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ErrorContent() {
  const searchParams = useSearchParams()
  const rawReason = searchParams.get("reason") || ""

  // Anlaşılır kullanıcı dostu mesaj belirleme
  let displayMessage = "Ödeme işlemi bankanız tarafından onaylanmadı."

  if (rawReason) {
    const decoded = decodeURIComponent(rawReason).replace(/_/g, ' ')
    if (decoded.includes("no_token") || decoded.includes("Gecersiz")) {
      displayMessage = "Ödeme oturumu zaman aşımına uğradı veya geçersiz bir istek alındı."
    } else if (decoded.toLowerCase().includes("limit") || decoded.toLowerCase().includes("bakiye")) {
      displayMessage = "Kart bakiyeniz veya internet alışveriş limitiniz yetersiz olabilir."
    } else if (decoded.toLowerCase().includes("3d") || decoded.toLowerCase().includes("sms")) {
      displayMessage = "3D Secure SMS doğrulama kodu doğrulanamadı veya zaman aşımına uğradı."
    } else if (!decoded.includes("error") && !decoded.includes("Exception") && !decoded.includes("prisma")) {
      displayMessage = decoded
    }
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-200">
      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Ödeme Tamamlanamadı</h1>
      <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
        İşleminiz gerçekleştirilirken bir sorun oluştu. <strong>Kredi veya banka kartınızdan herhangi bir ücret tahsil edilmemiştir.</strong>
      </p>
      
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold mb-6 text-left space-y-1">
        <p className="font-bold text-rose-900">Banka Yanıtı:</p>
        <p className="leading-relaxed">{displayMessage}</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 text-left mb-8 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <span>Kartınızın internet alışverişlerine açık olduğunu ve limitinizi kontrol ettikten sonra tekrar deneyebilirsiniz.</span>
      </div>

      <div className="flex flex-col gap-3">
        <Link 
          href="/checkout" 
          className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Tekrar Dene
        </Link>
        <Link 
          href="/sepet" 
          className="inline-flex items-center justify-center w-full bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors text-sm gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Sepete Dön
        </Link>
      </div>
    </div>
  )
}

export default function OdemeBasarisizPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-500 text-sm">Yükleniyor...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
