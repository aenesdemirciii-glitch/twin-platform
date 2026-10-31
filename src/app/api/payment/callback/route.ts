import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { retrievePaymentResult } from "@/services/payment/iyzico"
import { sendOrderEmails } from "@/lib/mail"
import { createBanabiOrder } from "@/services/courier/banabikurye"

// Hostinger container arkasında req.url '0.0.0.0:3000' dönebilir.
// Kullanıcı tarayıcısına asla 0.0.0.0 gitmemeli; gerçek alan adı (ikizlerbaharatcilik.com) kullanılmalıdır.
function getRedirectBaseUrl(req: Request): string {
  const forwardedHost = req.headers.get("x-forwarded-host")
  const hostHeader = req.headers.get("host")
  const rawHost = forwardedHost || hostHeader || "ikizlerbaharatcilik.com"

  const isLocalOrContainer = 
    rawHost.includes("0.0.0.0") || 
    rawHost.includes("localhost") || 
    rawHost.includes("127.0.0.1") ||
    rawHost.startsWith("10.") ||
    rawHost.startsWith("172.")

  const cleanHost = isLocalOrContainer ? "ikizlerbaharatcilik.com" : rawHost
  const proto = req.headers.get("x-forwarded-proto") || (cleanHost.includes("ikizlerbaharatcilik.com") ? "https" : "http")

  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  if (envUrl && !envUrl.includes("0.0.0.0") && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "")
  }

  return `${proto}://${cleanHost}`.replace(/\/$/, "")
}

export async function POST(req: Request) {
  const baseUrl = getRedirectBaseUrl(req)

  try {
    // 1. İyzico'dan dönen token'ı al (Form data, JSON veya query param)
    let token: string | null = null
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("form")) {
      const formData = await req.formData()
      token = formData.get("token") as string
    } else if (contentType.includes("json")) {
      const json = await req.json()
      token = json.token
    }

    if (!token) {
      const url = new URL(req.url)
      token = url.searchParams.get("token")
    }

    if (!token) {
      return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Gecersiz_odeme_belirteci`, 303)
    }

    // 2. İyzico sunucularından ödeme sonucunu doğrudan sorgula (Server-to-Server Doğrulama)
    const iyzicoResult = await retrievePaymentResult(token)

    if (iyzicoResult && iyzicoResult.status === "success" && iyzicoResult.paymentStatus === "SUCCESS") {
      const orderId = iyzicoResult.basketId || iyzicoResult.conversationId

      if (!orderId) {
        return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Siparis_numarasi_bulunamadi`, 303)
      }

      let updatedOrder: any = null

      // 3. Atomik işlem: Siparişi güncelle ve Ödeme kaydı oluştur (Mükerrer sipariş korumalı)
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true }
        })

        if (!order) {
          throw new Error("Sipariş veritabanında bulunamadı: " + orderId)
        }

        if (order.paymentStatus !== "PAID") {
          updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              status: "PROCESSING" // Ödeme alındı, sipariş hazırlanıyor
            },
            include: { items: true }
          })

          // Ödeme geçmişi tablosuna kaydet
          await tx.payment.create({
            data: {
              orderId: order.id,
              provider: "IYZICO",
              transactionId: iyzicoResult.paymentId ? String(iyzicoResult.paymentId) : null,
              conversationId: iyzicoResult.conversationId || null,
              amount: iyzicoResult.paidPrice ? Number(iyzicoResult.paidPrice) : order.grandTotal,
              status: "SUCCESS",
              rawResponse: JSON.stringify({
                paymentId: iyzicoResult.paymentId,
                basketId: iyzicoResult.basketId,
                cardType: iyzicoResult.cardType,
                cardAssociation: iyzicoResult.cardAssociation,
                cardFamily: iyzicoResult.cardFamily,
                binNumber: iyzicoResult.binNumber,
                lastFourDigits: iyzicoResult.lastFourDigits,
                installment: iyzicoResult.installment
              })
            }
          })
        } else {
          // Zaten ödenmiş (mükerrer callback çağrısı)
          updatedOrder = order
        }
      })

      // 4. Banabikurye Kurye Siparişi Oluşturma (Yalnızca ödeme doğrulandıktan sonra)
      if (updatedOrder && updatedOrder.notes) {
        try {
          const parsedNotes = JSON.parse(updatedOrder.notes)

          // Mükerrer kurye siparişi oluşturmayı önle
          if (parsedNotes.deliveryMethod === "banabikurye" && !parsedNotes.banabiOrderId) {
            console.log(`Initiating Banabikurye dispatch for Order #${updatedOrder.orderNumber}...`)

            const fullAddress = `${parsedNotes.shippingAddress} ${parsedNotes.district ? parsedNotes.district + ' ' : ''}${parsedNotes.city || ''}`.trim()

            const courierRes = await createBanabiOrder({
              orderId: updatedOrder.id,
              orderNumber: updatedOrder.orderNumber,
              deliveryAddress: fullAddress,
              recipientName: parsedNotes.customerName || "Değerli Müşterimiz",
              recipientPhone: parsedNotes.customerPhone || "",
              matter: "Baharat ve Doğal Gıda Ürünleri",
              note: parsedNotes.orderNotes || `İkizler Baharatçılık Siparişi #${updatedOrder.orderNumber}`
            })

            const updatedNotesObj = { ...parsedNotes }

            if (courierRes.success && courierRes.banabiOrderId) {
              console.log(`Banabikurye courier created: ID ${courierRes.banabiOrderId}`)
              updatedNotesObj.banabiOrderId = courierRes.banabiOrderId
              updatedNotesObj.banabiTrackingUrl = courierRes.trackingUrl || ""
              updatedNotesObj.banabiStatus = courierRes.status || "created"
              updatedNotesObj.banabiError = null
              updatedNotesObj.banabiCreatedAt = new Date().toISOString()
            } else {
              console.warn(`Banabikurye courier failed: ${courierRes.error}`)
              // Ödenmiş sipariş asla başarısız yapılmaz, admin paneline operasyonel müdahale uyarısı düşürülür
              updatedNotesObj.banabiStatus = "FAILED"
              updatedNotesObj.banabiError = courierRes.error || "Kurye siparişi oluşturulamadı."
            }

            await prisma.order.update({
              where: { id: updatedOrder.id },
              data: { notes: JSON.stringify(updatedNotesObj) }
            })
          }
        } catch (courierErr) {
          console.error("Banabikurye courier dispatch exception:", courierErr)
        }
      }

      // 5. Sipariş Onay E-postalarını Gönder
      if (updatedOrder) {
        try {
          let customerEmail = "info@ikizlerbaharatcilik.com"
          let customerName = "Değerli Müşterimiz"

          if (updatedOrder.notes) {
            try {
              const parsed = JSON.parse(updatedOrder.notes)
              if (parsed.customerEmail) customerEmail = parsed.customerEmail
              if (parsed.customerName) customerName = parsed.customerName
            } catch (e) {}
          }

          await sendOrderEmails(updatedOrder, customerEmail, customerName)
        } catch (emailErr) {
          console.error("Email sending failed during callback:", emailErr)
        }
      }

      // 6. Başarılı sayfasına sipariş numarasıyla yönlendir (HTTP 303 ile GET isteğine dönüştür)
      const orderNumber = updatedOrder?.orderNumber || orderId
      return NextResponse.redirect(`${baseUrl}/odeme-basarili?orderId=${orderId}&orderNumber=${encodeURIComponent(orderNumber)}`, 303)

    } else {
      // Ödeme Başarısız veya Reddedildi
      const orderId = iyzicoResult?.basketId || iyzicoResult?.conversationId
      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "FAILED" }
          })
        } catch (dbErr) {
          console.error("Order status update failed:", dbErr)
        }
      }

      const rawError = iyzicoResult?.errorMessage || "Ödeme işlemi bankanız tarafından onaylanmadı."
      return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=${encodeURIComponent(rawError)}`, 303)
    }

  } catch (error: any) {
    console.error("Iyzico Callback Error:", error)
    return NextResponse.redirect(`${baseUrl}/odeme-basarisiz?reason=Odeme_onaylanirken_bir_sorun_olustu`, 303)
  }
}

export async function GET(req: Request) {
  return POST(req)
}
