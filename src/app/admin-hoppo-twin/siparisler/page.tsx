import prisma from "@/lib/prisma"
import { SearchInput } from "@/components/admin/SearchInput"
import { OrderManagerClient } from "./OrderManagerClient"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ""

  const rawOrders = await prisma.order.findMany({
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
          product: {
            include: {
              images: true
            }
          },
          variant: true
        }
      }
    }
  })

  // Prisma Decimal ve Date nesnelerini client component serileştirmesi için güvenle dönüştür
  const orders = JSON.parse(JSON.stringify(rawOrders))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Siparişler</h1>
          <p className="text-sm text-slate-500 mt-1">Gelen siparişleri, durumları (Beklemede, Gönderildi vb.), detayları ve kurye işlemlerini yönetin.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <SearchInput placeholder="Sipariş no, müşteri adı veya telefon ile ara..." />
        </div>
        <OrderManagerClient initialOrders={orders} />
      </div>
    </div>
  )
}
