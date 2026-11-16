"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Truck, 
  Send, 
  RefreshCw, 
  ExternalLink, 
  Printer, 
  XCircle, 
  Copy, 
  Check, 
  Loader2, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react"
import { CargoLabelModal } from "@/components/admin/CargoLabelModal"

interface YurticiActionButtonsProps {
  orderId: string
  orderNumber: string
  customerName: string
  customerPhone: string
  paymentStatus: string
  orderStatus: string
  customer: any
  order: any
}

export function YurticiActionButtons({
  orderId,
  orderNumber,
  customerName,
  customerPhone,
  paymentStatus,
  orderStatus,
  customer,
  order,
}: YurticiActionButtonsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const cargoKey = customer.cargoKey
  const trackingNumber = customer.trackingNumber
  const trackingUrl = customer.trackingUrl
  const cargoStatus = customer.cargoStatus
  const cargoShippedAt = customer.cargoShippedAt
  const cargoCarrier = customer.cargoCarrier || "Yurtiçi Kargo"

  // 1. Gönderi Oluşturma (createShipment)
  const handleCreateShipment = async (forceOffline: boolean = false) => {
    if (paymentStatus !== "PAID") {
      alert("Bu siparişin ödemesi henüz tamamlanmamış. Yalnızca ödenmiş siparişler kargoya aktarılabilir.")
      return
    }

    setLoading(true)
    setLoadingAction(forceOffline ? "create-offline" : "create")
    setMessage(null)

    try {
      const res = await fetch("/api/admin/yurtici/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, forceOffline }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ 
          type: "success", 
          text: forceOffline 
            ? "Yurtiçi Kargo şube teslimat kodu oluşturuldu (Kozyatağı Şubesi teslimata hazır)!" 
            : "Yurtiçi Kargo referans kodu başarıyla oluşturuldu!" 
        })
        router.refresh()
      } else {
        setMessage({ type: "error", text: data.error || "Gönderi kaydı oluşturulamadı." })
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Bağlantı hatası: " + (err.message || String(err)) })
    } finally {
      setLoading(false)
      setLoadingAction(null)
    }
  }

  // 2. Durumu Sorgulama (queryShipment)
  const handleQueryStatus = async () => {
    if (!cargoKey) return

    setLoading(true)
    setLoadingAction("query")
    setMessage(null)

    try {
      const res = await fetch("/api/admin/yurtici/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        if (data.isRealTrackingAvailable) {
          setMessage({ type: "success", text: `Takip no güncellendi: ${data.trackingNumber}` })
        } else {
          setMessage({ type: "success", text: `Durum güncellendi: ${data.cargoStatus || "Şube Kabulü Bekleniyor"}` })
        }
        router.refresh()
      } else {
        setMessage({ type: "error", text: data.error || "Kargo durumu sorgulanamadı." })
        alert(data.error || "Kargo durumu sorgulanamadı.")
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Hata: " + (err.message || String(err)) })
    } finally {
      setLoading(false)
      setLoadingAction(null)
    }
  }

  // 3. Gönderiyi İptal Et (cancelShipment)
  const handleCancelShipment = async () => {
    if (!cargoKey) return

    setLoading(true)
    setLoadingAction("cancel")
    setMessage(null)

    try {
      const res = await fetch("/api/admin/yurtici/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Yurtiçi Kargo gönderisi iptal edildi." })
        setShowCancelModal(false)
        router.refresh()
      } else {
        alert(data.error || "Gönderi iptal edilemedi.")
      }
    } catch (err: any) {
      alert("Hata: " + (err.message || String(err)))
    } finally {
      setLoading(false)
      setLoadingAction(null)
    }
  }

  // Referans Kodunu Kopyala
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs">
      {/* 1. Durum: Henüz Yurtiçi Kargo kaydı oluşturulmamış */}
      {!cargoKey ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCreateShipment(false)}
            disabled={loading || paymentStatus !== "PAID"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title={paymentStatus !== "PAID" ? "Ödeme alınmadan kargo kaydı oluşturulamaz" : "Yurtiçi Kargo Standart SOAP Gönderisi Oluştur"}
          >
            {loading && loadingAction === "create" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Yurtiçi Kargo Gönderisi Oluştur</span>
          </button>

          {paymentStatus !== "PAID" && (
            <span className="text-[10px] text-slate-400 italic">
              (Ödeme bekleniyor)
            </span>
          )}
        </div>
      ) : (
        /* 2. Durum: Yurtiçi Kargo kaydı oluşturulmuş */
        <div className="space-y-2">
          {/* BÜYÜK VE KOLAY OKUNABİLİR REFERANS KODU KARTI (Yazıcısız Mağaza İçin Özel) */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                GÖNDERİ REFERANS KODU (CARGO KEY)
              </span>
              <button
                onClick={() => handleCopyCode(cargoKey)}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-bold text-[11px] transition-colors"
                title="Kodu Kopyala"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Kopyalandı!" : "Kopyala"}</span>
              </button>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono font-black text-slate-900 text-base md:text-lg tracking-wider selection:bg-amber-300">
                {cargoKey}
              </span>
            </div>

            {/* Referans Kodu Yanında Müşteri Bilgileri */}
            <div className="mt-1.5 pt-1.5 border-t border-amber-200/60 grid grid-cols-2 gap-1 text-[11px] text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Alıcı:</span>
                <strong className="truncate block font-semibold">{customerName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Telefon:</span>
                <strong className="block font-semibold">{customerPhone}</strong>
              </div>
            </div>

            {/* Yazıcısız Mağaza Teslimat Durumu */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px]">
              {!trackingNumber ? (
                <div className="flex items-center gap-1 text-amber-800 font-medium bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200 w-full">
                  <Clock className="w-3 h-3 text-amber-700 flex-shrink-0" />
                  <span>Şube Kabulü Bekleniyor (Etiketsiz Referans Kodu ile Teslim Edilebilir)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 w-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                  <span>Şube Girişi Yapıldı: </span>
                  <span className="font-mono">{trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {/* Gönderi Durumunu Sorgula */}
            <button
              onClick={handleQueryStatus}
              disabled={loading}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[11px] font-bold transition-colors border border-slate-200"
              title="Yurtiçi Kargo'dan Anlık Gönderi Durumunu Sorgula"
            >
              <RefreshCw className={`w-3 h-3 ${loading && loadingAction === "query" ? "animate-spin text-amber-600" : ""}`} />
              <span>Durumu Sorgula</span>
            </button>

            {/* Kargo Etiketi Yazdır (Opsiyonel / A4) */}
            <button
              onClick={() => setShowLabelModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-[11px] font-semibold transition-colors border border-slate-200 shadow-sm"
              title="A4 Sevk Etiketi ve Barkod Görüntüle"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Etiket Yazdır (A4)</span>
            </button>

            {/* Canlı Takip Bağlantısı (Varsa) */}
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md text-[11px] font-bold transition-colors"
                title="Yurtiçi Kargo Resmi Sayfasında Takip Et"
              >
                <span>Takip Linki</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* Gönderiyi İptal Et */}
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={loading}
              className="inline-flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md text-[11px] font-medium transition-colors ml-auto"
              title="Yurtiçi Kargo Gönderisini İptal Et"
            >
              <XCircle className="w-3 h-3" />
              <span>İptal Et</span>
            </button>
          </div>

          {/* Bilgi Rozetleri: Kargo Firması, Son Durum, Gönderim Tarihi */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 pt-1">
            <span className="font-semibold text-slate-700">Firma: {cargoCarrier}</span>
            <span>•</span>
            <span>Son Durum: <strong className="text-slate-800">{cargoStatus || "Kayıt Açıldı"}</strong></span>
            {cargoShippedAt && (
              <>
                <span>•</span>
                <span>Tarih: {new Date(cargoShippedAt).toLocaleDateString("tr-TR")}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mesaj Bildirimi ve Şube Fallback Seçeneği */}
      {message && (
        <div className={`mt-2 p-2.5 rounded-xl text-[11px] space-y-2 ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
            : "bg-rose-50 text-rose-900 border border-rose-200"
        }`}>
          <div className="flex items-start gap-1.5 leading-snug">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>

          {/* API IP/Ağ Hatası Aldığında Personeli Kilitlemeyen Şube Kodu Seçeneği */}
          {message.type === "error" && !cargoKey && (
            <div className="pt-2 border-t border-rose-200/80 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCreateShipment(true)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] transition-colors shadow-sm"
              >
                {loading && loadingAction === "create-offline" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Şube Teslimat Kodu ile Oluştur (Elden Teslimat)</span>
              </button>
              <span className="text-[10px] text-slate-500 italic">
                IP yetkilendirmesi beklenirken şubeye koli teslimi için anında referans kodu üretir.
              </span>
            </div>
          )}
        </div>
      )}

      {/* A4 Kargo Etiketi Modalı */}
      <CargoLabelModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        order={order}
        customer={customer}
      />

      {/* Gönderi İptal Onay Modalı */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Kargo Gönderisini İptal Et</h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong>{cargoKey}</strong> referanslı Yurtiçi Kargo gönderi kaydı iptal edilecek. Emin misiniz?
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleCancelShipment}
                disabled={loading && loadingAction === "cancel"}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {loading && loadingAction === "cancel" ? "İptal Ediliyor..." : "Evet, İptal Et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

