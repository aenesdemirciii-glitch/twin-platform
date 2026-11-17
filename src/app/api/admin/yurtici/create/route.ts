import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createYurticiShipment, YurticiCreateShipmentInput } from "@/services/courier/yurtici"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, desi, kg, cargoCount, paymentType, forceOffline } = body

    if (!orderId) {
      return NextResponse.json({ error: "Sipariş ID gereklidir." }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        user: true,
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş veritabanında bulunamadı." }, { status: 404 })
    }

    // 1. İyzico Ödeme Kontrolü
    if (order.paymentStatus !== "PAID") {
      return NextResponse.json({
        error: "Bu siparişin ödemesi henüz onaylanmamış. Yalnızca ödemesi tamamlanan siparişler kargoya aktarılabilir.",
      }, { status: 400 })
    }

    // Mevcut notları ve kargo bilgilerini parse et
    let parsedNotes: any = {}
    if (order.notes) {
      try {
        parsedNotes = JSON.parse(order.notes)
      } catch (e) {
        parsedNotes = {}
      }
    }

    // Alıcı ve Adres Bilgilerini Çözümle
    let receiverName = parsedNotes.customerName || order.address?.fullName || ""
    if (!receiverName && order.user) {
      receiverName = `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
    }
    if (!receiverName) receiverName = "Değerli Müşterimiz"

    const receiverPhone = parsedNotes.customerPhone || order.address?.phone || order.user?.phone || ""
    const emailAddress = parsedNotes.customerEmail || order.user?.email || ""

    // 2. Mükerrer Gönderi Koruması: Zaten oluşturulmuşsa mevcut kaydı başarıyla döndür
    if (parsedNotes.cargoKey && !body.forceNew) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        cargoKey: parsedNotes.cargoKey,
        jobId: parsedNotes.cargoJobId || null,
        trackingNumber: parsedNotes.trackingNumber || null,
        trackingUrl: parsedNotes.trackingUrl || null,
        cargoStatus: parsedNotes.cargoStatus || "Kargo Referans Kodu Hazır (Şube Kabulü Bekleniyor)",
        message: `Bu sipariş için zaten aktif bir Yurtiçi Kargo gönderi kaydı mevcuttur (Referans Kodu: ${parsedNotes.cargoKey}).`,
        customerName: receiverName,
        customerPhone: receiverPhone,
        orderNumber: order.orderNumber,
      }, { status: 200 })
    }

    // İl ve İlçe
    let cityName = parsedNotes.city || order.address?.city || "İstanbul"
    let townName = parsedNotes.district || order.address?.district || "Kadıköy"
    let fullAddress = parsedNotes.shippingAddress || order.address?.address || ""

    // Benzersiz ve Karışmayan cargoKey (Referans Kodu) Üretimi
    // Yurtiçi Kargo için Sipariş Numarasını baz alan temiz referans (tek IKZ öneki)
    const cleanOrderNum = order.orderNumber.replace(/[^a-zA-Z0-9]/g, "")
    const cargoKey = cleanOrderNum.startsWith("IKZ") ? cleanOrderNum : `IKZ-${cleanOrderNum}`

    // 3. Kargo Ödeme Tipi Belirleme (İkizler Baharatçılık Kuralları)
    // 3.000 TL ve üzeri siparişler ücretsiz kargo -> Gönderici Ödemeli
    // Müşterinin ödeme ekranında kargo ücreti ödemiş olması da mağazanın anlaşmalı hesabı üzerinden gönderileceği anlamına gelir (Gönderici Ödemeli).
    // Yalnızca yönetici açıkça "Alıcı Ödemeli" seçerse Alıcı Ödemeli yapılır.
    const resolvedPaymentType: "SENDER" | "RECEIVER" = paymentType === "RECEIVER" ? "RECEIVER" : "SENDER"

    // Paket ve Ağırlık Bilgileri
    const finalCargoCount = Math.max(1, Number(cargoCount) || 1)
    const totalItemsQty = order.items.reduce((sum, item) => sum + item.quantity, 0)
    const estimatedWeight = Math.max(1, Math.round(totalItemsQty * 0.5))
    const finalDesi = Number(desi) || estimatedWeight
    const finalKg = Number(kg) || estimatedWeight

    const shipmentInput: YurticiCreateShipmentInput = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      cargoKey,
      receiverName,
      receiverAddress: fullAddress || `${townName}, ${cityName}`,
      cityName,
      townName,
      receiverPhone,
      emailAddress,
      desi: finalDesi,
      kg: finalKg,
      cargoCount: finalCargoCount,
      paymentType: resolvedPaymentType,
      description: `İkizler Baharatçılık #${order.orderNumber} (${finalCargoCount} Paket)`,
      forceOffline: !!forceOffline,
    }

    // 4. Yurtiçi Kargo SOAP Çağrısı
    const result = await createYurticiShipment(shipmentInput)

    if (!result.success) {
      // API bağlantısı kurulamadığında veya hata aldığında sipariş durumunu DEĞİŞTİRME!
      // Hata detayını logla ve yöneticiye göster.
      const errorNotesObj = {
        ...parsedNotes,
        cargoLastError: result.errorMessage || "Yurtiçi Kargo API gönderi oluşturma başarısız oldu.",
        cargoLastErrorAt: new Date().toISOString(),
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { notes: JSON.stringify(errorNotesObj) },
      })

      return NextResponse.json({
        success: false,
        error: result.errorMessage || "Yurtiçi Kargo gönderisi oluşturulamadı.",
        details: result.rawResponse,
      }, { status: 502 })
    }

    // 5. Başarılı İşlem: Veritabanına Kaydet
    const updatedNotesObj = {
      ...parsedNotes,
      cargoCarrier: "Yurtiçi Kargo",
      cargoKey: result.cargoKey,
      cargoJobId: result.jobId || null,
      cargoPaymentType: resolvedPaymentType,
      cargoShippedAt: new Date().toISOString(),
      cargoStatus: "Kargo Referans Kodu Oluşturuldu (Şube Kabulü Bekleniyor)",
      cargoLastError: null,
      cargoCount: finalCargoCount,
      desi: finalDesi,
      kg: finalKg,
      isSimulated: !!result.isSimulated,
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        notes: JSON.stringify(updatedNotesObj),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Yurtiçi Kargo gönderi referans kodu başarıyla oluşturuldu.",
      cargoKey: result.cargoKey,
      jobId: result.jobId,
      customerName: receiverName,
      customerPhone: receiverPhone,
      orderNumber: order.orderNumber,
      isSimulated: !!result.isSimulated,
      outResult: result.outResult,
    })
  } catch (error: any) {
    console.error("Yurtici create route exception:", error)
    return NextResponse.json({
      error: "Sunucu hatası: " + (error.message || String(error)),
    }, { status: 500 })
  }
}

