import prisma from "@/lib/prisma"
import { SearchInput } from "@/components/admin/SearchInput"
import { CourierActionButtons } from "./CourierActionButtons"
import { Package, MapPin, Phone, Mail, CheckCircle2, Clock, XCircle, Truck, Zap } from "lucide-react"

export const dynamic = "force-dynamic"

function parseOrderCustomer(order: any) {
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
  const shippingFee = typeof notesObj.shippingFee === "number" ? notesObj.shippingFee : Number(order.shippingCost)

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

  return {
    name,
    phone,
    email,
    address,
    deliveryMethod,
    deliveryTitle,
    shippingFee,
    banabiOrderId: notesObj.banabiOrderId,
    banabiTrackingUrl: notesObj.banabiTrackingUrl,
    banabiStatus: notesObj.banabiStatus,
    banabiError: notesObj.banabiError,
  }
}

export default async function AdminOrdersPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ""

  const orders = await prisma.order.findMany({
    where: q ? {
      OR: [
        { orderNumber: { contains: q } },
        { address: { fullName: { contains: q } } },
        { notes: { contains: q } }
      ]
    } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      address: true,
      payments: true,
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Siparişler</h1>
          <p className="text-sm text-slate-500 mt-1">Gelen siparişleri, Banabikurye kurye çağrılarını ve kargo durumlarını yönetin.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <SearchInput placeholder="Sipariş no, müşteri adı veya telefon ile ara..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Sipariş No & Tarih</th>
                <th className="px-6 py-4">Müşteri & İletişim</th>
                <th className="px-6 py-4">Teslimat & Kurye</th>
                <th className="px-6 py-4">Ürünler</th>
                <th className="px-6 py-4">Tutar</th>
                <th className="px-6 py-4">Ödeme / Sipariş Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const customer = parseOrderCustomer(order)

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Sipariş No & Tarih */}
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono font-bold text-slate-900 block text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 w-fit">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          {order.createdAt.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
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
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> {customer.email}
                          </p>
                        )}
                      </td>

                      {/* Teslimat Yöntemi & Adresi & Banabikurye İşlemleri */}
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

                          {/* Banabikurye Kurye Aksiyon Butonları */}
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
                          {order.items.slice(0, 2).map((item) => (
                            <p key={item.id} className="text-xs text-slate-700 truncate max-w-[200px]">
                              <span className="font-bold text-slate-900">{item.quantity}x</span> {item.productName}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-[11px] text-amber-600 font-semibold">
                              +{order.items.length - 2} ürün daha
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Tutar */}
                      <td className="px-6 py-4 align-top font-bold text-slate-900 text-sm">
                        ₺{Number(order.grandTotal).toLocaleString('tr-TR')}
                      </td>

                      {/* Durum */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-1.5 items-start">
                          {/* Ödeme Durumu */}
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

                          {/* Kargo / Sipariş Aşaması */}
                          <span className="text-[11px] text-slate-500 font-medium">
                            {order.status === "PENDING" ? "Onay Bekliyor" : 
                             order.status === "PROCESSING" ? "Paketleniyor" :
                             order.status === "SHIPPED" ? "Kargoya Verildi" :
                             order.status === "DELIVERED" ? "Teslim Edildi" : 
                             order.status === "CANCELLED" ? "İptal Edildi" : order.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Henüz kayıtlı sipariş bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
