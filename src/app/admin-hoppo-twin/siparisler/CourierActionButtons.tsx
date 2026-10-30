"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Loader2, Zap } from "lucide-react"

interface Props {
  orderId: string
  orderNumber: string
  banabiOrderId?: string | number | null
  banabiTrackingUrl?: string | null
  banabiStatus?: string | null
  banabiError?: string | null
  deliveryMethod?: string | null
}

export function CourierActionButtons({
  orderId,
  orderNumber,
  banabiOrderId,
  banabiTrackingUrl,
  banabiStatus,
  banabiError,
  deliveryMethod,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (deliveryMethod !== "banabikurye") {
    return null
  }

  async function handleCourierAction(action: "retry" | "refresh_status") {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/courier/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage(data.message || "İşlem başarılı!")
        router.refresh()
      } else {
        alert(data.error || "İşlem başarısız oldu.")
      }
    } catch (err: any) {
      alert("Hata: " + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-100 text-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        {banabiOrderId ? (
          <>
            <span className="font-mono bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
              Kurye No: #{banabiOrderId}
            </span>

            {banabiTrackingUrl && (
              <a
                href={banabiTrackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded text-[11px] font-bold transition-colors"
                title="Canlı Haritada Kuryeyi Takip Et"
              >
                Takip Et <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={() => handleCourierAction("refresh_status")}
              disabled={loading}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
              title="Kurye Durumunu Güncelle"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleCourierAction("retry")}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-md text-[11px] transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
            <span>Kuryeyi Çağır (Banabikurye)</span>
          </button>
        )}
      </div>

      {banabiError && (
        <div className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 rounded p-1.5 leading-snug flex items-start gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-rose-600" />
          <span>Kurye Uyarısı: {banabiError}</span>
        </div>
      )}

      {message && (
        <p className="text-[10px] text-emerald-600 font-semibold">{message}</p>
      )}
    </div>
  )
}
