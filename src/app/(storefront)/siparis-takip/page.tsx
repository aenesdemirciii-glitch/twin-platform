"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  PhoneCall
} from "lucide-react"

function OrderTrackingContent() {
  const searchParams = useSearchParams()
  const initialOrderNumber = searchParams.get("orderNumber") || ""

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber)
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<any | null>(null)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!orderNumber.trim()) {
      setError("Lütfen sipariş numaranızı giriniz.")
      return
    }

    setLoading(true)
    setError(null)
    setOrderData(null)

    try {
      const url = new URL("/api/order-tracking", window.location.origin)
      url.searchParams.set("orderNumber", orderNumber.trim())
      if (contact.trim()) {
        url.searchParams.set("contact", contact.trim())
      }

      const res = await fetch(url.toString())
      const data = await res.json()

      if (res.ok && data.success) {
        setOrderData(data.order)
      } else {
        setError(data.error || "Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol ediniz.")
      }
    } catch (err: any) {
      setError("Bağlantı hatası: " + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearch()
    }
  }, [initialOrderNumber])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Başlık Alanı */}
      <div className="text-center mb-10">
        <span className="text-amber-800 text-xs font-bold uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
          Kargo ve Gönderi Sorgulama
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
          Sipariş Takibi
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          İkizler Baharatçılık siparişinizin anlık Yurtiçi Kargo durumunu, kargo takip numarasını ve teslimat aşamalarını buradan öğrenebilirsiniz.
        </p>
      </div>

      {/* Arama Formu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sipariş Numarası <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Örn: IKZ-241116-1234"
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm uppercase transition-all"
                required
              />
              <Package className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sipariş onay e-postasında ve SMS mesajında iletilen numara.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Telefon veya E-Posta <span className="text-slate-400 text-[11px] font-normal">(Opsiyonel / Güvenlik Doğrulaması)</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="05xxxxxxxxx veya e-posta adresiniz"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sorgulanıyor...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Siparişi Sorgula</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Sonuç Kartı */}
      {orderData && (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          {/* Üst Bilgi Barı */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-amber-200 text-xs font-bold uppercase tracking-wider block">Sipariş Bilgisi</span>
              <h2 className="text-2xl font-mono font-black mt-1">#{orderData.orderNumber}</h2>
              <p className="text-xs text-amber-100 mt-1">
                Tarih: {new Date(orderData.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-amber-200 text-xs font-semibold block">Toplam Tutar</span>
              <span className="text-2xl font-black">₺{orderData.grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Kargo Takip Özel Alanı */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Kargo Taşıyıcı</span>
                    <strong className="text-base text-slate-900">{orderData.cargoCarrier}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-semibold block">Son Durum</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    {orderData.cargoStatus}
                  </span>
                </div>
              </div>

              {/* Takip No ve Canlı Takip Bağlantısı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block font-medium">Kargo Takip Numarası</span>
                  {orderData.trackingNumber ? (
                    <strong className="text-lg font-mono text-slate-900 mt-1 block">
                      {orderData.trackingNumber}
                    </strong>
                  ) : orderData.cargoKey ? (
                    <div>
                      <strong className="text-sm font-mono text-slate-700 mt-1 block">
                        Ref: {orderData.cargoKey}
                      </strong>
                      <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                        Paket hazırlandı, Yurtiçi Kargo şube kabulü ve barkod girişi bekleniyor.
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500 italic mt-1 block">
                      Sipariş hazırlanıyor, henüz kargo kaydı oluşturulmadı.
                    </span>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <span className="text-xs text-slate-500 block font-medium mb-1.5">Canlı Gönderi Takibi</span>
                  {orderData.trackingUrl ? (
                    <a
                      href={orderData.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                    >
                      <span>Yurtiçi Kargo'da Canlı Takip Et</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : orderData.cargoKey ? (
                    <a
                      href={`https://yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(orderData.cargoKey)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors border border-slate-200"
                    >
                      <span>Yurtiçi Kargo Sorgu Ekranı</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Kargo takip linki şube çıkışı yapıldığında aktif olacaktır.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sipariş Ürünleri */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Sipariş Edilen Ürünler</h3>
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                {orderData.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs">
                        {item.quantity}x
                      </div>
                      <span className="font-semibold text-slate-800">{item.productName}</span>
                    </div>
                    <span className="font-bold text-slate-900">₺{item.totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bilgilendirme */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">İkizler Baharatçılık Güvencesi</strong>
                <span>
                  Baharat ve doğal gıda ürünleriniz tazeliğini ve aromasını koruyan özel hava almaz kilitli ambalajlarda hazırlanarak Yurtiçi Kargo Kozyatağı şubemizden sevk edilmektedir.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<div className="p-12 text-center text-slate-500">Yükleniyor...</div>}>
        <OrderTrackingContent />
      </Suspense>
    </div>
  )
}

