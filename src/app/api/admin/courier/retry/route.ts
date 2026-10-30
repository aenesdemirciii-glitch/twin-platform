import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createBanabiOrder, getBanabiOrderStatus } from "@/services/courier/banabikurye"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { orderId, action } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "Sipariş ID belirtilmedi." }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 })
    }

    let notesObj: any = {}
    if (order.notes) {
      try {
        notesObj = JSON.parse(order.notes)
      } catch (e) {
        notesObj = {}
      }
    }

    // 1. EYLEM: DURUM GÜNCELLEME (Refresh Status from Banabikurye API)
    if (action === "refresh_status" && notesObj.banabiOrderId) {
      const statusData = await getBanabiOrderStatus(notesObj.banabiOrderId)
      if (statusData) {
        notesObj.banabiStatus = statusData.status || notesObj.banabiStatus
        if (statusData.tracking_url) notesObj.banabiTrackingUrl = statusData.tracking_url

        await prisma.order.update({
          where: { id: order.id },
          data: { notes: JSON.stringify(notesObj) },
        })

        return NextResponse.json({
          success: true,
          status: notesObj.banabiStatus,
          trackingUrl: notesObj.banabiTrackingUrl,
          message: "Kurye durumu güncellendi.",
        })
      } else {
        return NextResponse.json({ error: "Kurye durumu API'den alınamadı." }, { status: 400 })
      }
    }

    // 2. EYLEM: KURYE ÇAĞIR / YENİDEN DENE (Dispatch / Retry Courier)
    const fullAddress = `${notesObj.shippingAddress || ""} ${notesObj.district ? notesObj.district + " " : ""}${notesObj.city || ""}`.trim()

    const courierRes = await createBanabiOrder({
      orderId: order.id,
      orderNumber: order.orderNumber,
      deliveryAddress: fullAddress,
      recipientName: notesObj.customerName || "Müşteri",
      recipientPhone: notesObj.customerPhone || "",
      matter: "Baharat ve Doğal Gıda Ürünleri",
      note: notesObj.orderNotes || `İkizler Baharatçılık Siparişi #${order.orderNumber}`,
    })

    if (courierRes.success && courierRes.banabiOrderId) {
      notesObj.banabiOrderId = courierRes.banabiOrderId
      notesObj.banabiTrackingUrl = courierRes.trackingUrl || ""
      notesObj.banabiStatus = courierRes.status || "created"
      notesObj.banabiError = null
      notesObj.banabiCreatedAt = new Date().toISOString()

      await prisma.order.update({
        where: { id: order.id },
        data: { notes: JSON.stringify(notesObj) },
      })

      return NextResponse.json({
        success: true,
        banabiOrderId: courierRes.banabiOrderId,
        trackingUrl: courierRes.trackingUrl,
        message: "Banabikurye kurye çağrısı başarıyla oluşturuldu!",
      })
    } else {
      notesObj.banabiStatus = "FAILED"
      notesObj.banabiError = courierRes.error || "Kurye siparişi oluşturulamadı."

      await prisma.order.update({
        where: { id: order.id },
        data: { notes: JSON.stringify(notesObj) },
      })

      return NextResponse.json({
        success: false,
        error: courierRes.error || "Kurye çağrısı başarısız oldu.",
      }, { status: 400 })
    }
  } catch (err: any) {
    console.error("Admin courier retry error:", err)
    return NextResponse.json({ error: err.message || "İşlem sırasında bir hata oluştu." }, { status: 500 })
  }
}
