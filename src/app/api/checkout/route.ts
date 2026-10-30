import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createCheckoutForm } from "@/services/payment/iyzico"
import { calculateBanabiOrder, getBanabiConfig, isSameDayDeliveryAvailable } from "@/services/courier/banabikurye"

// Benzersiz ve kurumsal sipariş numarası oluşturucu
async function generateUniqueOrderNumber(): Promise<string> {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  for (let attempt = 0; attempt < 5; attempt++) {
    const randomPart = Math.floor(1000 + Math.random() * 9000)
    const candidate = `IKZ-${dateStr}-${randomPart}`
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true }
    })
    if (!existing) {
      return candidate
    }
  }
  return `IKZ-${Date.now()}`
}

// İyzico uyumlu telefon numarası formatı (+905xxxxxxxxx)
function formatGsmNumber(phone: string): string {
  if (!phone) return "+905555555555"
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('90') && digits.length === 12) {
    return `+${digits}`
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `+9${digits}`
  }
  if (digits.length === 10) {
    return `+90${digits}`
  }
  return digits.startsWith('+') ? digits : `+${digits}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      buyer, 
      discountCode, 
      deliveryMethod, 
      clientShippingFee, 
      orderNotes 
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Sepetinizde ürün bulunmuyor." }, { status: 400 })
    }

    if (!shippingAddress || !buyer || !buyer.name || !buyer.surname || !buyer.email || !buyer.gsmNumber) {
      return NextResponse.json({ error: "Lütfen ad, soyad, e-posta, telefon ve teslimat adresinizi eksiksiz doldurun." }, { status: 400 })
    }

    // 1. Veritabanından güncel ürün fiyatlarını ve stoklarını kontrol et
    let subtotal = 0
    let totalWeight = 0
    const basketItems: any[] = []
    const dbOrderItems: any[] = []

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId || item.id },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          discountPrice: true,
          taxRate: true,
          categoryId: true,
          stock: true,
        }
      })

      if (!dbProduct) {
        return NextResponse.json({ error: `Seçtiğiniz ürün artık mevcut değil: ${item.name || 'Ürün'}` }, { status: 400 })
      }

      const qty = Math.max(1, Number(item.quantity) || 1)
      const unitPrice = Number(dbProduct.discountPrice || dbProduct.price)
      const itemTotal = unitPrice * qty
      subtotal += itemTotal
      totalWeight += qty * 0.5 // Ortalama ürün ağırlığı

      dbOrderItems.push({
        productId: dbProduct.id,
        variantId: item.variantId || null,
        productName: dbProduct.name,
        sku: dbProduct.sku || `SKU-${dbProduct.id.slice(0, 8)}`,
        quantity: qty,
        unitPrice: unitPrice,
        taxRate: Number(dbProduct.taxRate) || 18,
        discountAmount: 0,
        totalPrice: itemTotal
      })

      basketItems.push({
        id: dbProduct.id,
        name: dbProduct.name.slice(0, 45),
        category1: dbProduct.categoryId || "Baharat & Şifalı Bitkiler",
        itemType: "PHYSICAL",
        price: itemTotal.toFixed(2)
      })
    }

    // 2. TESLİMAT YÖNTEMİ & ÜCRET DOĞRULAMASI
    const banabiConfig = await getBanabiConfig()
    const deliveryMethodSelected: "standard" | "banabikurye" = deliveryMethod === "banabikurye" ? "banabikurye" : "standard"
    let shippingCost = banabiConfig.standardShippingFee || 199.00
    let deliveryTitle = "Standart Kargo"

    if (deliveryMethodSelected === "banabikurye") {
      // Saat kontrolü (17:00 sınırı)
      const timeCheck = isSameDayDeliveryAvailable(banabiConfig.cutoffHour)
      if (!timeCheck.available) {
        return NextResponse.json({
          error: timeCheck.reason || "Bugün için Aynı Gün Teslimat sipariş saati (17:00) sona erdi. Lütfen Standart Kargo seçeneğini kullanınız."
        }, { status: 400 })
      }

      // Sunucu tarafında Banabikurye API'sinden anlık fiyatı yeniden doğrula
      const fullDeliveryAddress = `${shippingAddress} ${buyer.district ? buyer.district + ' ' : ''}${buyer.city || ''}`.trim()
      const banabiCalc = await calculateBanabiOrder({
        deliveryAddress: fullDeliveryAddress,
        deliveryCity: buyer.city || "İstanbul",
        deliveryDistrict: buyer.district || "",
        weightKg: Math.max(1, Math.round(totalWeight)),
        matter: "Baharat ve Doğal Gıda Ürünleri"
      })

      if (!banabiCalc.success || !banabiCalc.available || typeof banabiCalc.price !== "number") {
        return NextResponse.json({
          error: banabiCalc.error || "Aynı Gün Teslimat bu adres için sağlanamamaktadır. Lütfen Standart Kargo'yu tercih ediniz."
        }, { status: 400 })
      }

      // İstemciye gösterilen fiyat ile API'nin sunduğu güncel fiyat arasında fark varsa müşteriden onay iste
      if (typeof clientShippingFee === "number" && Math.abs(banabiCalc.price - clientShippingFee) > 1) {
        return NextResponse.json({
          error: `Kurye teslimat ücreti güncellendi (${banabiCalc.price.toFixed(2)} TL). Lütfen yeni tutarı kontrol edip onaylayınız.`,
          priceUpdated: true,
          newShippingFee: banabiCalc.price
        }, { status: 409 })
      }

      shippingCost = banabiCalc.price
      deliveryTitle = "Aynı Gün Teslimat (Banabikurye)"
    } else {
      // Standart Kargo: Sabit 199 TL (Sepet tutarından bağımsız kural)
      shippingCost = banabiConfig.standardShippingFee || 199.00
      deliveryTitle = "Standart Kargo"
    }

    // 3. Kupon İndirim Hesaplaması
    let discountAmount = 0
    if (discountCode && typeof discountCode === "string") {
      const coupon = await prisma.coupon.findUnique({ where: { code: discountCode.trim().toUpperCase() } })
      if (coupon && coupon.isActive) {
        if (coupon.type === "PERCENTAGE") {
          discountAmount = subtotal * (Number(coupon.value) / 100)
        } else if (coupon.type === "FIXED") {
          discountAmount = Math.min(subtotal, Number(coupon.value))
        } else if (coupon.type === "FREE_SHIPPING" && deliveryMethodSelected === "standard") {
          shippingCost = 0
        }
      }
    }

    // İyzico kuralı: Teslimat ücreti sepet kalemlerine eklenmelidir
    if (shippingCost > 0) {
      basketItems.push({
        id: "KARGO",
        name: deliveryTitle.slice(0, 45),
        category1: "Teslimat",
        itemType: "PHYSICAL",
        price: shippingCost.toFixed(2)
      })
    }

    const catalogPrice = subtotal + shippingCost
    const grandTotal = Math.max(0, subtotal - discountAmount) + shippingCost

    // 4. Kullanıcı eşleştirme (Üye veya Misafir)
    let matchedUserId: string | null = buyer.id || null
    if (!matchedUserId && buyer.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: buyer.email.trim() },
        select: { id: true }
      })
      if (existingUser) {
        matchedUserId = existingUser.id
      }
    }

    // 5. Benzersiz Sipariş Numarası Üret
    const orderNumber = await generateUniqueOrderNumber()

    // 6. Siparişi Veritabanında PENDING Durumunda Oluştur
    const customerNotes = JSON.stringify({
      customerName: `${buyer.name} ${buyer.surname}`.trim(),
      customerEmail: buyer.email.trim(),
      customerPhone: buyer.gsmNumber.trim(),
      shippingAddress: shippingAddress.trim(),
      billingAddress: (billingAddress || shippingAddress).trim(),
      city: buyer.city || "İstanbul",
      district: buyer.district || "",
      identityNumber: buyer.identityNumber || "11111111111",
      deliveryMethod: deliveryMethodSelected,
      deliveryTitle: deliveryTitle,
      shippingFee: shippingCost,
      banabiStatus: deliveryMethodSelected === "banabikurye" ? "PENDING_PAYMENT" : null,
      banabiOrderId: null,
      banabiTrackingUrl: null,
      banabiError: null,
      orderNotes: orderNotes || ""
    })

    const newOrder = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        userId: matchedUserId,
        subTotal: subtotal,
        shippingCost: shippingCost,
        taxTotal: 0,
        discountTotal: discountAmount,
        grandTotal: grandTotal,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "IYZICO_CARD",
        notes: customerNotes,
        items: {
          create: dbOrderItems
        }
      }
    })

    // 7. Callback URL Belirleme
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "ikizlerbaharatcilik.com"
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`
    const callbackUrl = `${baseUrl}/api/payment/callback`

    // İstemci IP adresi
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "85.34.78.112"

    // 8. İyzico Checkout Form İsteğini Hazırla
    const requestData = {
      locale: "tr",
      conversationId: newOrder.id,
      price: catalogPrice.toFixed(2),
      paidPrice: grandTotal.toFixed(2),
      currency: "TRY",
      basketId: newOrder.id,
      paymentGroup: "PRODUCT",
      callbackUrl: callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: matchedUserId || newOrder.id,
        name: buyer.name.trim(),
        surname: buyer.surname.trim(),
        gsmNumber: formatGsmNumber(buyer.gsmNumber),
        email: buyer.email.trim(),
        identityNumber: buyer.identityNumber ? String(buyer.identityNumber).trim() : "11111111111",
        lastLoginDate: "2024-01-01 00:00:00",
        registrationDate: "2024-01-01 00:00:00",
        registrationAddress: shippingAddress.trim().slice(0, 150),
        ip: clientIp,
        city: buyer.city ? buyer.city.trim() : "İstanbul",
        country: "Turkey",
        zipCode: buyer.zipCode ? buyer.zipCode.trim() : "34732"
      },
      shippingAddress: {
        contactName: `${buyer.name} ${buyer.surname}`.trim(),
        city: buyer.city ? buyer.city.trim() : "İstanbul",
        country: "Turkey",
        address: shippingAddress.trim().slice(0, 150),
        zipCode: buyer.zipCode ? buyer.zipCode.trim() : "34732"
      },
      billingAddress: {
        contactName: `${buyer.name} ${buyer.surname}`.trim(),
        city: buyer.city ? buyer.city.trim() : "İstanbul",
        country: "Turkey",
        address: (billingAddress || shippingAddress).trim().slice(0, 150),
        zipCode: buyer.zipCode ? buyer.zipCode.trim() : "34732"
      },
      basketItems: basketItems
    }

    const iyzicoResult = await createCheckoutForm(requestData)

    if (iyzicoResult && iyzicoResult.status === "success") {
      return NextResponse.json({
        success: true,
        token: iyzicoResult.token,
        checkoutFormContent: iyzicoResult.checkoutFormContent,
        paymentPageUrl: iyzicoResult.paymentPageUrl,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber
      })
    } else {
      console.error("Iyzico Initialization Failed:", iyzicoResult)
      await prisma.order.delete({ where: { id: newOrder.id } }).catch(() => {})
      const errorMsg = iyzicoResult?.errorMessage || "Ödeme sistemi başlatılamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz."
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

  } catch (error: any) {
    console.error("Checkout Internal Error:", error)
    return NextResponse.json({
      error: "Sipariş oluşturulurken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz."
    }, { status: 500 })
  }
}
