import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { cancelYurticiShipment } from "@/services/courier/yurtici"

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
        error: "Bu sipariş için aktif bir Yurtiçi Kargo gönderi kaydı bulunmuyor.",
      }, { status: 400 })
    }

    const force = !!body.force
    let cancelError = null

    // Yurtiçi Kargo SOAP cancelShipment çağrısı
    try {
      const cancelResult = await cancelYurticiShipment(cargoKey)
      if (!cancelResult.success && !force) {
        cancelError = cancelResult.errorMessage || cancelResult.outResult || "Gönderi iptal edilemedi."
      }
    } catch (e: any) {
      if (!force) cancelError = e.message || String(e)
    }

    if (cancelError && !force) {
      return NextResponse.json({
        success: false,
        error: cancelError,
        canForce: true,
      }, { status: 502 })
    }

    // İptal başarılı: Notlardan kargo alanlarını temizle veya iptal bilgisi ekle
    const updatedNotesObj = {
      ...parsedNotes,
      cargoKey: null,
      trackingNumber: null,
      trackingUrl: null,
      cargoStatus: "Gönderi İptal Edildi",
      cargoCancelledAt: new Date().toISOString(),
      cargoPreviousKey: cargoKey,
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        notes: JSON.stringify(updatedNotesObj),
        // Eğer sipariş durumu SHIPPED ise tekrar PROCESSING'e çekilebilir
        status: order.status === "SHIPPED" ? "PROCESSING" : order.status,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Yurtiçi Kargo gönderisi (Referans: ${cargoKey}) başarıyla iptal edildi.`,
    })
  } catch (error: any) {
    console.error("Yurtici cancel route error:", error)
    return NextResponse.json({
      error: "Sunucu hatası: " + (error.message || String(error)),
    }, { status: 500 })
  }
}

