"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  Zap, 
  Eye, 
  Trash2, 
  AlertTriangle,
  Loader2,
  ChevronDown
} from "lucide-react"
import { CourierActionButtons } from "./CourierActionButtons"
import { OrderDetailModal } from "./OrderDetailModal"

interface OrderManagerClientProps {
  initialOrders: any[]
}

export function parseOrderCustomer(order: any) {
  let notesObj: any = {}
  if (order.notes) {
    try {
      notesObj = JSON.parse(order.notes)
    } catch (e) {
      notesObj = {}
    }
  }

  const deliveryMethod = notesObj.deliveryMethod || "standard"
  const deliveryTitle = notesObj.deliveryTitle || (deliveryMethod === "banabikurye" ? "Aynı Gün Teslimat (Banabikurye)" : "Standart Kargo")
  const shippingFee = typeof notesObj.shippingFee === "number" ? notesObj.shippingFee : Number(order.shippingCost || 0)

  let name = "Misafir Müşteri"
  let phone = "-"
  let email = "-"
  let address = "-"

  if (order.address?.fullName) {
    name = order.address.fullName
    phone = order.address.phone
    address = `${order.address.address}, ${order.address.district || ''} / ${order.address.city}`
  } else if (order.user) {
    const fullName = `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
    name = fullName || order.user.email || "Kayıtlı Müşteri"
    phone = order.user.phone || "-"
  }

  if (notesObj.customerName) name = notesObj.customerName
  if (notesObj.customerPhone) phone = notesObj.customerPhone
  if (notesObj.customerEmail) email = notesObj.customerEmail
  if (notesObj.shippingAddress) address = notesObj.shippingAddress
  if (notesObj.city && !address.includes(notesObj.city)) {
    address = `${address}, ${notesObj.district ? notesObj.district + ' / ' : ''}${notesObj.city}`
  }

  return {
    name,
    phone,
    email,
    address,
    identityNumber: notesObj.identityNumber,
    orderNotes: notesObj.orderNotes,
    deliveryMethod,
    deliveryTitle,
    shippingFee,
    banabiOrderId: notesObj.banabiOrderId,
    banabiTrackingUrl: notesObj.banabiTrackingUrl,
    banabiStatus: notesObj.banabiStatus,
    banabiError: notesObj.banabiError,
  }
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Beklemede", badgeClass: "bg-amber-100 text-amber-900 border-amber-200" },
  { value: "PROCESSING", label: "Paketleniyor", badgeClass: "bg-blue-100 text-blue-900 border-blue-200" },
  { value: "SHIPPED", label: "Gönderildi", badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-200" },
  { value: "DELIVERED", label: "Teslim Edildi", badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  { value: "CANCELLED", label: "İptal Edildi", badgeClass: "bg-rose-100 text-rose-900 border-rose-200" },
]

export function OrderManagerClient({ initialOrders }: OrderManagerClientProps) {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Silme Onay Modal Durumu
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; orderNumber: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Durum Güncelleme Loading State
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  // Sipariş Detayını Aç
  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order)
    setSelectedCustomer(parseOrderCustomer(order))
    setIsModalOpen(true)
  }

  // Sipariş Durumu Değiştir
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }))
        }
        router.refresh()
      } else {
        alert(data.error || "Durum güncellenemedi.")
      }
    } catch (err: any) {
      alert("Hata: " + (err.message || String(err)))
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Sipariş Silme
  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
        setOrderToDelete(null)
        if (selectedOrder?.id === orderId) {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }
        router.refresh()
      } else {
        alert(data.error || "Sipariş silinemedi.")
      }
    } catch (err: any) {
      alert("Hata: " + (err.message || String(err)))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Sipariş No & Tarih</th>
              <th className="px-6 py-4">Müşteri & İletişim</th>
              <th className="px-6 py-4">Teslimat & Kurye</th>
              <th className="px-6 py-4">Ürünler</th>
              <th className="px-6 py-4">Tutar</th>
              <th className="px-6 py-4">Ödeme Durumu</th>
              <th className="px-6 py-4">Sipariş Durumu</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length > 0 ? (
              orders.map((order) => {
                const customer = parseOrderCustomer(order)
                const isUpdating = updatingOrderId === order.id

                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Sipariş No & Tarih */}
                    <td className="px-6 py-4 align-top">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(order)}
                        className="font-mono font-bold text-slate-900 block text-xs bg-slate-100 hover:bg-amber-100 hover:text-amber-950 px-2.5 py-1 rounded-md border border-slate-200 transition-colors text-left"
                        title="Detayları İncele"
                      >
                        #{order.orderNumber}
                      </button>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {new Date(order.createdAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </td>

                    {/* Müşteri */}
                    <td className="px-6 py-4 align-top">
                      <p className="font-bold text-slate-900 text-xs">{customer.name}</p>
                      {customer.phone && customer.phone !== "-" && (
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {customer.phone}
                        </p>
                      )}
                      {customer.email && customer.email !== "-" && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-[160px]" title={customer.email}>
                          <Mail className="w-3 h-3 text-slate-400" /> {customer.email}
                        </p>
                      )}
                    </td>

                    {/* Teslimat Yöntemi & Adresi */}
                    <td className="px-6 py-4 align-top max-w-xs">
                      <div className="space-y-1">
                        {customer.deliveryMethod === "banabikurye" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            <Zap className="w-3 h-3 text-amber-600 fill-amber-500" /> Aynı Gün Kurye ({customer.shippingFee} TL)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <Truck className="w-3 h-3 text-slate-500" /> Standart Kargo ({customer.shippingFee} TL)
                          </span>
                        )}

                        <p className="text-xs text-slate-600 line-clamp-2 mt-1" title={customer.address}>
                          {customer.address}
                        </p>

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
                    </td>

                    {/* Ürünler */}
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-1">
                        {order.items?.slice(0, 2).map((item: any) => (
                          <p key={item.id} className="text-xs text-slate-700 truncate max-w-[180px]">
                            <span className="font-bold text-slate-900">{item.quantity}x</span> {item.productName}
                          </p>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-[11px] text-amber-600 font-semibold">
                            +{order.items.length - 2} ürün daha
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Tutar */}
                    <td className="px-6 py-4 align-top font-bold text-slate-900 text-sm whitespace-nowrap">
                      ₺{Number(order.grandTotal).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Ödeme Durumu */}
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      {order.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Ödendi (iyzico)
                        </span>
                      ) : order.paymentStatus === "FAILED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Ödeme Başarısız
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" /> Ödeme Bekliyor
                        </span>
                      )}
                    </td>

                    {/* Sipariş Durumu (Seçici Dropdown) */}
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          disabled={isUpdating}
                          value={order.status || "PENDING"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border appearance-none pr-7 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 ${
                            order.status === "SHIPPED"
                              ? "bg-indigo-50 text-indigo-900 border-indigo-200"
                              : order.status === "PENDING"
                              ? "bg-amber-50 text-amber-900 border-amber-200"
                              : order.status === "PROCESSING"
                              ? "bg-blue-50 text-blue-900 border-blue-200"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                              : "bg-rose-50 text-rose-900 border-rose-200"
                          }`}
                        >
                          <option value="PENDING">⏳ Beklemede</option>
                          <option value="PROCESSING">📦 Paketleniyor</option>
                          <option value="SHIPPED">🚚 Gönderildi</option>
                          <option value="DELIVERED">✅ Teslim Edildi</option>
                          <option value="CANCELLED">❌ İptal Edildi</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-slate-500" />
                      </div>
                      {isUpdating && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 mt-1 block">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" /> Güncelleniyor...
                        </span>
                      )}
                    </td>

                    {/* İşlemler (Detay & Sil) */}
                    <td className="px-6 py-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors"
                          title="Sipariş Detaylarını Gör"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detay</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderToDelete({ id: order.id, orderNumber: order.orderNumber })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Siparişi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  Henüz kayıtlı sipariş bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sipariş Detay Modalı */}
      <OrderDetailModal
        order={selectedOrder}
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteOrder}
      />

      {/* Silme Onay Modalı */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Siparişi Silmek İstiyor musunuz?</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              <strong className="font-mono text-slate-900 font-bold">#{orderToDelete.orderNumber}</strong> numaralı sipariş ve buna bağlı tüm ürün/ödeme kayıtları kalıcı olarak silinecektir. Bu işlem geri alınamaz.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteOrder(orderToDelete.id, orderToDelete.orderNumber)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? "Siliniyor..." : "Evet, Siparişi Sil"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
