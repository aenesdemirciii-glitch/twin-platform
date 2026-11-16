import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { queryYurticiShipment } from "@/services/courier/yurtici"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const orderNumber = (url.searchParams.get("orderNumber") || "").trim()
    const contact = (url.searchParams.get("contact") || "").trim().toLowerCase()

    if (!orderNumber) {
      return NextResponse.json({ error: "Lütfen sipariş numaranızı giriniz." }, { status: 400 })
    }

    // Temiz sipariş no
    const cleanOrderNumber = orderNumber.replace(/^#/, "").trim()

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: cleanOrderNumber },
          { id: cleanOrderNumber },
        ],
      },
      include: {
        items: true,
        address: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol ediniz." }, { status: 404 })
    }

    let parsedNotes: any = {}
    if (order.notes) {
      try {
        parsedNotes = JSON.parse(order.notes)
      } catch (e) {
        parsedNotes = {}
      }
    }

    // Güvenlik doğrulaması (Opsiyonel ama önerilen: Telefon veya e-posta girilmişse doğrula)
    if (contact) {
      const orderEmail = (parsedNotes.customerEmail || "").toLowerCase()
      const orderPhone = (parsedNotes.customerPhone || order.address?.phone || "").replace(/\D/g, "")
      const searchPhone = contact.replace(/\D/g, "")

      const isEmailMatch = orderEmail && orderEmail.includes(contact)
      const isPhoneMatch = searchPhone.length >= 4 && orderPhone.includes(searchPhone)

      if (!isEmailMatch && !isPhoneMatch) {
        return NextResponse.json({
          error: "Sipariş numarası ile girilen iletişim bilgisi (telefon/e-posta) eşleşmedi.",
        }, { status: 403 })
      }
    }

    // Canlı Kargo Sorgulama (Eğer Yurtiçi Kargo cargoKey varsa)
    let liveCargoStatus = parsedNotes.cargoStatus || "Hazırlanıyor"
    let trackingNumber = parsedNotes.trackingNumber || null
    let trackingUrl = parsedNotes.trackingUrl || null

    if (parsedNotes.cargoKey && !trackingNumber) {
      try {
        const liveQuery = await queryYurticiShipment(parsedNotes.cargoKey)
        if (liveQuery.success && liveQuery.trackingNumber) {
          trackingNumber = liveQuery.trackingNumber
          trackingUrl = liveQuery.trackingUrl || `https://yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(trackingNumber)}`
          liveCargoStatus = liveQuery.cargoEvent || "Kargoda"
        }
      } catch (e) {
        // Sessiz hata toleransı
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        status: order.status,
        paymentStatus: order.paymentStatus,
        grandTotal: Number(order.grandTotal),
        customerName: parsedNotes.customerName || order.address?.fullName || "Değerli Müşterimiz",
        deliveryMethod: parsedNotes.deliveryMethod || "standard",
        deliveryTitle: parsedNotes.deliveryTitle || "Standart Kargo",
        cargoCarrier: parsedNotes.cargoCarrier || (parsedNotes.deliveryMethod === "banabikurye" ? "Banabikurye" : "Yurtiçi Kargo"),
        cargoKey: parsedNotes.cargoKey || null,
        trackingNumber: trackingNumber,
        trackingUrl: trackingUrl,
        cargoStatus: liveCargoStatus,
        cargoShippedAt: parsedNotes.cargoShippedAt || null,
        items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        })),
      },
    })
  } catch (error: any) {
    console.error("Order tracking route error:", error)
    return NextResponse.json({
      error: "Sipariş sorgulanırken bir hata oluştu.",
    }, { status: 500 })
  }
}

