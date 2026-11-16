import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { queryYurticiShipment } from "@/services/courier/yurtici"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: "Sipariş ID gereklidir." }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 })
    }

    let parsedNotes: any = {}
    if (order.notes) {
      try {
        parsedNotes = JSON.parse(order.notes)
      } catch (e) {
        parsedNotes = {}
      }
    }

    const cargoKey = parsedNotes.cargoKey

    if (!cargoKey) {
      return NextResponse.json({
        error: "Bu sipariş için henüz oluşturulmuş bir Yurtiçi Kargo gönderi referansı bulunmuyor.",
      }, { status: 400 })
    }

    // Yurtiçi Kargo SOAP queryShipment çağrısı
    const queryResult = await queryYurticiShipment(cargoKey)

    if (!queryResult.success) {
      return NextResponse.json({
        success: false,
        error: queryResult.error || "Kargo durumu sorgulanamadı.",
      }, { status: 502 })
    }

    // Gerçek takip numarası var mı? (Uydurma takip numarası kesinlikle atanmaz)
    const hasRealTrackingNumber = !!queryResult.trackingNumber && queryResult.trackingNumber.trim().length > 3
    const isDelivered = queryResult.cargoEvent?.toLowerCase().includes("teslim edildi") || queryResult.operationStatus === "DELIVERED"

    const updatedNotesObj = {
      ...parsedNotes,
      trackingNumber: hasRealTrackingNumber ? queryResult.trackingNumber : (parsedNotes.trackingNumber || null),
      trackingUrl: queryResult.trackingUrl || parsedNotes.trackingUrl || (hasRealTrackingNumber ? `https://yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(queryResult.trackingNumber!)}` : null),
      cargoStatus: queryResult.cargoEvent || queryResult.operationMessage || "Şube Kabulü Bekleniyor",
      cargoLastQueriedAt: new Date().toISOString(),
      cargoDepartureUnit: queryResult.departureUnit || parsedNotes.cargoDepartureUnit,
      cargoArrivalUnit: queryResult.arrivalUnit || parsedNotes.cargoArrivalUnit,
      cargoDeliveryDate: queryResult.deliveryDate || parsedNotes.cargoDeliveryDate,
    }

    // Sipariş durumu güncellemesi:
    // Eğer gerçek takip numarası oluştuysa ve sipariş henüz PENDING/PROCESSING ise -> SHIPPED (Gönderildi) yapılır.
    // Teslim edildiyse -> DELIVERED yapılır.
    let newOrderStatus = order.status
    if (isDelivered) {
      newOrderStatus = "DELIVERED"
    } else if (hasRealTrackingNumber && (order.status === "PENDING" || order.status === "PROCESSING")) {
      newOrderStatus = "SHIPPED"
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newOrderStatus,
        notes: JSON.stringify(updatedNotesObj),
      },
    })

    return NextResponse.json({
      success: true,
      cargoKey,
      trackingNumber: updatedNotesObj.trackingNumber,
      trackingUrl: updatedNotesObj.trackingUrl,
      cargoStatus: updatedNotesObj.cargoStatus,
      orderStatus: newOrderStatus,
      departureUnit: updatedNotesObj.cargoDepartureUnit,
      arrivalUnit: updatedNotesObj.cargoArrivalUnit,
      deliveryDate: updatedNotesObj.cargoDeliveryDate,
      isRealTrackingAvailable: hasRealTrackingNumber,
    })
  } catch (error: any) {
    console.error("Yurtici query route error:", error)
    return NextResponse.json({
      error: "Sunucu hatası: " + (error.message || String(error)),
    }, { status: 500 })
  }
}

