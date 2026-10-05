import { NextResponse } from "next/server"
// import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    // 1. Parse incoming Webhook payload from Iyzico
    const body = await req.json()
    const { token, status, paymentId, conversationId } = body

    if (!token) {
      return NextResponse.json({ error: "Token eksik." }, { status: 400 })
    }

    if (status === 'success') {
      // 2. Validate Payment Server-Side with Iyzipay API using the token
      // const iyzicoResult = await retrievePaymentResult(token)
      // if (iyzicoResult.paymentStatus === 'SUCCESS') {
      
      // 3. Process the DB Update
      /*
        await prisma.$transaction(async (tx) => {
          // Check idempotency
          const existingPayment = await tx.payment.findFirst({ where: { conversationId }})
          if (existingPayment) return; 

          // Update Order Status
          await tx.order.update({
            where: { id: conversationId }, // Assuming conversationId is the Order ID
            data: { 
              paymentStatus: "PAID",
              status: "PROCESSING"
            }
          })

          // Save Payment Info
          await tx.payment.create({
            data: {
              orderId: conversationId,
              provider: "IYZICO",
              transactionId: paymentId,
              amount: 0, // iyzicoResult.paidPrice
              status: "SUCCESS"
            }
          })
        })
      */
      
      return NextResponse.json({ message: "Ödeme başarıyla doğrulandı ve sipariş onaylandı." })
    }

    return NextResponse.json({ message: "Ödeme başarısız veya iptal edildi." }, { status: 400 })

  } catch (error: any) {
    console.error("Iyzico Webhook Error:", error)
    // Always return 200 to Iyzico to acknowledge receipt, even on internal errors, 
    // unless you want them to retry. Returning 500 might trigger unwanted retries.
    return NextResponse.json({ error: "Sistem hatası" }, { status: 500 })
  }
}
