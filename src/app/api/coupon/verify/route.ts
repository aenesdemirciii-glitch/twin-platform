import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Kupon kodu eksik" }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code }
    })

    if (!coupon) {
      return NextResponse.json({ error: "Geçersiz kupon kodu" }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "Bu kupon artık aktif değil" }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Bu kuponun kullanım sınırı dolmuş" }, { status: 400 })
    }

    if (coupon.startDate && new Date() < coupon.startDate) {
      return NextResponse.json({ error: "Bu kupon henüz geçerli değil" }, { status: 400 })
    }

    if (coupon.endDate && new Date() > coupon.endDate) {
      return NextResponse.json({ error: "Bu kuponun süresi dolmuş" }, { status: 400 })
    }

    if (coupon.minCartAmount && cartTotal < Number(coupon.minCartAmount)) {
      return NextResponse.json({ error: `Bu kuponu kullanmak için sepet tutarı en az ${Number(coupon.minCartAmount)} TL olmalıdır` }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
      }
    })
  } catch (error) {
    console.error("Coupon verify error:", error)
    return NextResponse.json({ error: "Kupon doğrulanırken bir hata oluştu" }, { status: 500 })
  }
}
