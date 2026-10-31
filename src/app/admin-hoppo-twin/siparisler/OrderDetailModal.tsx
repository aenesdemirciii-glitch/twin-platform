"use client"

import { useState } from "react"
import { 
  X, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  Zap, 
  CreditCard, 
  Calendar, 
  User, 
  Trash2, 
  Printer, 
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { CourierActionButtons } from "./CourierActionButtons"

interface OrderDetailModalProps {
  order: any
  customer: any
  isOpen: boolean
  onClose: () => void
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>
  onDelete: (orderId: string, orderNumber: string) => Promise<void>
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING: { label: "Beklemede / Onay Bekliyor", color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200" },
  PROCESSING: { label: "Paketleniyor / Hazırlanıyor", color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200" },
  SHIPPED: { label: "Gönderildi / Kargoda", color: "text-indigo-800", bg: "bg-indigo-50", border: "border-indigo-200" },
  DELIVERED: { label: "Teslim Edildi", color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
  CANCELLED: { label: "İptal Edildi", color: "text-rose-800", bg: "bg-rose-50", border: "border-rose-200" },
}

export function OrderDetailModal({
  order,
  customer,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}: OrderDetailModalProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !order) return null

  const currentStatus = order.status || "PENDING"
  const statusMeta = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING

  const handleStatusSelect = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    setIsUpdatingStatus(true)
    try {
      await onStatusChange(order.id, newStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleCopyAddress = () => {
    if (customer.address) {
      navigator.clipboard.writeText(customer.address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDeleteClick = async () => {
    setIsDeleting(true)
    try {
      await onDelete(order.id, order.orderNumber)
      onClose()
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 font-mono">#{order.orderNumber}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}>
                  {statusMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(order.createdAt).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Yazdır"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Yazdır</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Hızlı Durum Değiştirme Çubuğu */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-amber-50/40 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Sipariş Durumu:</span>
              {isUpdatingStatus && <Loader2 className="w-4 h-4 animate-spin text-amber-600" />}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: "PENDING", label: "Beklemede", icon: Clock },
                { key: "PROCESSING", label: "Hazırlanıyor", icon: Package },
                { key: "SHIPPED", label: "Gönderildi (Kargoda)", icon: Truck },
                { key: "DELIVERED", label: "Teslim Edildi", icon: CheckCircle2 },
                { key: "CANCELLED", label: "İptal", icon: XCircle },
              ].map(({ key, label, icon: Icon }) => {
                const isActive = currentStatus === key
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusSelect(key)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      isActive
                        ? "bg-slate-900 text-white shadow-slate-300 scale-105"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* İki Kolon: Müşteri/Teslimat & Ödeme/Özet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sol Kolon: Müşteri ve Teslimat Bilgileri */}
            <div className="space-y-4">
              {/* Müşteri Bilgileri */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Müşteri Bilgileri
                </h3>
                <div>
                  <p className="font-extrabold text-slate-900 text-base">{customer.name}</p>
                  {customer.identityNumber && customer.identityNumber !== "11111111111" && (
                    <p className="text-xs text-slate-500 mt-0.5">T.C. No: {customer.identityNumber}</p>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  {customer.phone && customer.phone !== "-" && (
                    <a 
                      href={`tel:${customer.phone}`} 
                      className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{customer.phone}</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Ara)</span>
                    </a>
                  )}
                  {customer.email && customer.email !== "-" && (
                    <a 
                      href={`mailto:${customer.email}`} 
                      className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors font-medium truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                      <span className="text-[10px] text-slate-400 font-normal">(E-Posta)</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Teslimat ve Adres Bilgileri */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Teslimat Adresi
                  </h3>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
                  >
                    {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAddress ? "Kopyalandı" : "Adresi Kopyala"}</span>
                  </button>
                </div>

                {/* Yöntem Rozeti */}
                <div>
                  {customer.deliveryMethod === "banabikurye" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> Aynı Gün Kurye (Banabikurye - {customer.shippingFee} TL)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      <Truck className="w-3.5 h-3.5 text-slate-500" /> Standart Kargo ({customer.shippingFee} TL)
                    </span>
                  )}
                </div>

                {/* Tam Adres Metni */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {customer.address}
                </p>

                {/* Sipariş Notu Varsa */}
                {customer.orderNotes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 block">Müşteri Sipariş Notu:</span>
                    <p className="text-xs text-slate-800 italic mt-0.5 font-medium">"{customer.orderNotes}"</p>
                  </div>
                )}

                {/* Banabikurye Kurye Aksiyonu */}
                <CourierActionButtons
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  deliveryMethod={customer.deliveryMethod}
                  banabiOrderId={customer.banabiOrderId}
                  banabiTrackingUrl={customer.banabiTrackingUrl}
                  banabiStatus={customer.banabiStatus}
                  banabiError={customer.banabiError}
                />
              </div>
            </div>

            {/* Sağ Kolon: Ödeme ve Tutar Bilgileri */}
            <div className="space-y-4">
              {/* Ödeme Durumu Kartı */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  Ödeme Durumu
                </h3>

                <div className="flex items-center justify-between">
                  {order.paymentStatus === "PAID" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ödendi (iyzico ile Onaylandı)
                    </span>
                  ) : order.paymentStatus === "FAILED" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                      <XCircle className="w-4 h-4 text-rose-600" /> Ödeme Başarısız
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-600" /> Ödeme Bekliyor
                    </span>
                  )}

                  <span className="font-mono text-xs text-slate-500 font-bold">
                    {order.paymentMethod || "IYZICO_CARD"}
                  </span>
                </div>

                {order.payments && order.payments.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    {order.payments.map((p: any) => (
                      <div key={p.id} className="flex justify-between items-center">
                        <span>İşlem ID:</span>
                        <span className="font-mono font-bold text-slate-700">{p.transactionId || p.id.slice(0, 12)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tutar Dökümü */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Tutar Özeti</h3>
                
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Ara Toplam:</span>
                  <span className="font-medium">₺{Number(order.subTotal || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                </div>

                {Number(order.discountTotal || 0) > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold">
                    <span>Kupon İndirimi:</span>
                    <span>-₺{Number(order.discountTotal).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Kargo Ücreti:</span>
                  <span className="font-medium">₺{Number(order.shippingCost || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-black text-slate-900">Genel Toplam:</span>
                  <span className="text-xl font-black text-amber-600">
                    ₺{Number(order.grandTotal).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Sipariş Edilen Ürünler Tablosu */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                Sipariş Edilen Ürünler ({order.items?.length || 0} Kalem)
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item: any) => {
                const productImage = item.product?.images?.[0]?.url || null

                return (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {productImage ? (
                          <img src={productImage} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{item.productName}</h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {item.sku || "-"}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-slate-900 text-xs">
                        ₺{Number(item.totalPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity} adet × ₺{Number(item.unitPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Siparişi Sil</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Emin misiniz?
                </span>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteClick}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Vazgeç
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
