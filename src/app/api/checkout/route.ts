import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createCheckoutForm } from "@/services/payment/iyzico"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shippingAddress, billingAddress, buyer, discountCode } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Sepetiniz boş." }, { status: 400 })
    }
    if (!shippingAddress || !billingAddress || !buyer) {
      return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 })
    }

    // 1. Validate prices from DB
    let subtotal = 0
    const basketItems = []
    const dbOrderItems = []

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!dbProduct) {
        return NextResponse.json({ error: `Ürün bulunamadı: ${item.name}` }, { status: 400 })
      }
      
      const price = Number(dbProduct.discountPrice || dbProduct.price)
      const itemTotal = price * item.quantity
      subtotal += itemTotal

      dbOrderItems.push({
        productId: dbProduct.id,
        quantity: item.quantity,
        price: price,
        total: itemTotal
      })

      basketItems.push({
        id: dbProduct.id,
        name: dbProduct.name,
        category1: dbProduct.categoryId || "Genel",
        itemType: "PHYSICAL", // "PHYSICAL" or "VIRTUAL" in Iyzico
        price: (price * item.quantity).toFixed(2)
      })
    }

    // 2. Calculate Discounts & Shipping
    let discountAmount = 0
    let shippingCost = subtotal > 1500 ? 0 : 299.00
    
    // Check real coupon
    let appliedCouponId = null
    if (discountCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: discountCode.toUpperCase() } })
      if (coupon && coupon.isActive) {
        if (coupon.type === "PERCENTAGE") {
          discountAmount = subtotal * (Number(coupon.value) / 100)
        } else if (coupon.type === "FIXED") {
          discountAmount = Number(coupon.value)
        } else if (coupon.type === "FREE_SHIPPING") {
          shippingCost = 0
        }
        appliedCouponId = coupon.id
      }
    }

    const grandTotal = Math.max(0, subtotal - discountAmount) + shippingCost

    // 3. Create PENDING Order in Database
    const newOrder = await prisma.order.create({
      data: {
        userId: buyer.id || null,
        status: "PENDING",
        paymentStatus: "PENDING",
        subTotal: subtotal,
        shippingCost: shippingCost,
        taxAmount: 0,
        discountAmount: discountAmount,
        grandTotal: grandTotal,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        customerName: `${buyer.name} ${buyer.surname}`,
        customerEmail: buyer.email,
        customerPhone: buyer.gsmNumber,
        items: {
          create: dbOrderItems
        }
      }
    })

    // 4. Create Iyzico Checkout Form Request
    const requestData = {
      locale: "tr",
      conversationId: newOrder.id,
      price: grandTotal.toFixed(2),
      paidPrice: grandTotal.toFixed(2),
      currency: "TRY",
      basketId: newOrder.id,
      paymentGroup: "PRODUCT",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/callback`,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: buyer.id || "BY789",
        name: buyer.name,
        surname: buyer.surname,
        gsmNumber: buyer.gsmNumber,
        email: buyer.email,
        identityNumber: buyer.identityNumber || "11111111111",
        lastLoginDate: "2023-10-09 00:00:00",
        registrationDate: "2023-10-09 00:00:00",
        registrationAddress: shippingAddress,
        ip: "85.34.78.112", // In production, get real IP
        city: buyer.city || "Istanbul",
        country: "Turkey",
        zipCode: buyer.zipCode || "34732"
      },
      shippingAddress: {
        contactName: `${buyer.name} ${buyer.surname}`,
        city: buyer.city || "Istanbul",
        country: "Turkey",
        address: shippingAddress,
        zipCode: buyer.zipCode || "34732"
      },
      billingAddress: {
        contactName: `${buyer.name} ${buyer.surname}`,
        city: buyer.city || "Istanbul",
        country: "Turkey",
        address: billingAddress,
        zipCode: buyer.zipCode || "34732"
      },
      basketItems: basketItems
    }

    const iyzicoResult = await createCheckoutForm(requestData)

    if (iyzicoResult.status === "success") {
      return NextResponse.json({
        success: true,
        token: iyzicoResult.token,
        checkoutFormContent: iyzicoResult.checkoutFormContent,
        paymentPageUrl: iyzicoResult.paymentPageUrl,
        orderId: newOrder.id
      })
    } else {
      console.error("Iyzico API Error:", iyzicoResult)
      // Delete the pending order since payment init failed
      await prisma.order.delete({ where: { id: newOrder.id } })
      return NextResponse.json({ error: iyzicoResult.errorMessage || "Ödeme sistemi başlatılamadı." }, { status: 400 })
    }

  } catch (error: any) {
    console.error("Checkout API Error:", error)
    return NextResponse.json({ error: "Sistem hatası: " + error.message }, { status: 500 })
  }
}
