import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createYurticiShipment, YurticiCreateShipmentInput } from "@/services/courier/yurtici"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderIds } = body

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "Lütfen en az bir sipariş seçiniz." }, { status: 400 })
    }

    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: {
        address: true,
        user: true,
        items: true,
      },
    })

    const results = {
      total: orders.length,
      successful: [] as any[],
      failed: [] as any[],
      skipped: [] as any[],
    }

    for (const order of orders) {
      let parsedNotes: any = {}
      if (order.notes) {
        try {
          parsedNotes = JSON.parse(order.notes)
        } catch (e) {
          parsedNotes = {}
        }
      }

      // 1. Ödeme Kontrolü
      if (order.paymentStatus !== "PAID") {
        results.skipped.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          reason: "Ödeme henüz onaylanmamış.",
        })
        continue
      }

      // 2. Mükerrer Gönderi Kontrolü
      if (parsedNotes.cargoKey) {
        results.skipped.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          cargoKey: parsedNotes.cargoKey,
          reason: "Zaten aktif Yurtiçi Kargo kaydı mevcut.",
        })
        continue
      }

      // Alıcı ve Adres Çözümleme
      let receiverName = parsedNotes.customerName || order.address?.fullName || ""
      if (!receiverName && order.user) {
        receiverName = `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
      }
      if (!receiverName) receiverName = "Değerli Müşterimiz"

      const receiverPhone = parsedNotes.customerPhone || order.address?.phone || order.user?.phone || ""
      const emailAddress = parsedNotes.customerEmail || order.user?.email || ""
      const cityName = parsedNotes.city || order.address?.city || "İstanbul"
      const townName = parsedNotes.district || order.address?.district || "Kadıköy"
      const fullAddress = parsedNotes.shippingAddress || order.address?.address || `${townName}, ${cityName}`

      const cargoKey = `IKZ-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, "")}`
      const totalItemsQty = order.items.reduce((sum, item) => sum + item.quantity, 0)
      const estimatedWeight = Math.max(1, Math.round(totalItemsQty * 0.5))

      const shipmentInput: YurticiCreateShipmentInput = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        cargoKey,
        receiverName,
        receiverAddress: fullAddress,
        cityName,
        townName,
        receiverPhone,
        emailAddress,
        desi: estimatedWeight,
        kg: estimatedWeight,
        cargoCount: 1,
        paymentType: "SENDER", // İkizler Baharatçılık anlaşmalı gönderici ödemeli
        description: `İkizler Baharatçılık #${order.orderNumber}`,
      }

      try {
        const res = await createYurticiShipment(shipmentInput)

        if (res.success) {
          const updatedNotesObj = {
            ...parsedNotes,
            cargoCarrier: "Yurtiçi Kargo",
            cargoKey: res.cargoKey,
            cargoJobId: res.jobId || null,
            cargoPaymentType: "SENDER",
            cargoShippedAt: new Date().toISOString(),
            cargoStatus: "Kargo Referans Kodu Oluşturuldu (Şube Kabulü Bekleniyor)",
            cargoLastError: null,
            cargoCount: 1,
            desi: estimatedWeight,
            kg: estimatedWeight,
            isSimulated: !!res.isSimulated,
          }

          await prisma.order.update({
            where: { id: order.id },
            data: { notes: JSON.stringify(updatedNotesObj) },
          })

          results.successful.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            cargoKey: res.cargoKey,
          })
        } else {
          results.failed.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            error: res.errorMessage || "Yurtiçi Kargo servisi yanıt vermedi.",
          })
        }
      } catch (err: any) {
        results.failed.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          error: err.message || String(err),
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Toplu işlem tamamlandı: ${results.successful.length} başarılı, ${results.skipped.length} atlandı, ${results.failed.length} hatalı.`,
      results,
    })
  } catch (error: any) {
    console.error("Yurtici batch route error:", error)
    return NextResponse.json({
      error: "Sunucu hatası: " + (error.message || String(error)),
    }, { status: 500 })
  }
}

