import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { retrievePaymentResult } from "@/services/payment/iyzico"
import { sendOrderEmails } from "@/lib/mail"

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
      let updatedOrder = null;
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ 
          where: { id: orderId },
          include: { items: true } // We need items for email
        })
        
        if (order && order.paymentStatus !== "PAID") {
          updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { 
              paymentStatus: "PAID",
              status: "PROCESSING" // Payment received, now processing for shipment
            },
            include: { items: true } // get full order for email
          })
        } else if (order && order.paymentStatus === "PAID") {
          updatedOrder = order
        }
      })

      if (updatedOrder) {
        try {
          // Prepare and send emails
          const customerEmail = (updatedOrder as any).customerEmail || "info@ikizlerbaharatcilik.com"
          const customerName = (updatedOrder as any).customerName || "Değerli Müşterimiz"
          
          await sendOrderEmails(updatedOrder, customerEmail, customerName)
        } catch (emailErr) {
          console.error("Email sending failed during callback:", emailErr)
        }
      }

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
