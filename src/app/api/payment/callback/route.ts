import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { retrievePaymentResult } from "@/services/payment/iyzico"

export async function POST(req: Request) {
  try {
    // Iyzico sends token via form urlencoded POST request to callback URL
    const formData = await req.formData()
    const token = formData.get('token') as string

    if (!token) {
      return NextResponse.redirect(new URL('/odeme-basarisiz?reason=no_token', req.url))
    }

    // Retrieve the payment result from Iyzico
    const iyzicoResult = await retrievePaymentResult(token)

    if (iyzicoResult.status === 'success' && iyzicoResult.paymentStatus === 'SUCCESS') {
      const orderId = iyzicoResult.basketId || iyzicoResult.conversationId

      if (!orderId) {
        return NextResponse.redirect(new URL('/odeme-basarisiz?reason=no_order_id', req.url))
      }

      // Update Order Status safely
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId } })
        
        if (order && order.paymentStatus !== "PAID") {
          await tx.order.update({
            where: { id: orderId },
            data: { 
              paymentStatus: "PAID",
              status: "PROCESSING" // Payment received, now processing for shipment
            }
          })
        }
      })

      // Redirect user to success page
      return NextResponse.redirect(new URL(`/odeme-basarili?orderId=${orderId}`, req.url))
    } else {
      // Payment Failed
      const orderId = iyzicoResult.basketId || iyzicoResult.conversationId
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: "FAILED" }
        })
      }
      return NextResponse.redirect(new URL(`/odeme-basarisiz?reason=${encodeURIComponent(iyzicoResult.errorMessage || 'Ödeme reddedildi')}`, req.url))
    }

  } catch (error: any) {
    console.error("Iyzico Callback Error:", error)
    return NextResponse.redirect(new URL('/odeme-basarisiz?reason=system_error', req.url))
  }
}
