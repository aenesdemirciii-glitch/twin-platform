import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

// 1. Sipariş Durumu Güncelleme (Beklemede, Paketleniyor, Gönderildi, Teslim Edildi, İptal)
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Sipariş ID gereklidir." }, { status: 400 })
    }

    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Geçersiz durum. Geçerli durumlar: ${validStatuses.join(", ")}` 
      }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
      },
      include: {
        items: true,
        payments: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "Sipariş durumu güncellendi.",
      order: updated 
    })
  } catch (error: any) {
    console.error("Order status update error:", error)
    return NextResponse.json({ 
      error: "Sipariş güncellenirken bir hata oluştu: " + (error.message || String(error)) 
    }, { status: 500 })
  }
}

// 2. Sipariş Silme
export async function DELETE(req: Request) {
  try {
    let id: string | null = null

    // Hem JSON body hem de query param desteği
    try {
      const body = await req.json()
      id = body.id
    } catch (e) {
      // body json değilse query param kontrol et
    }

    if (!id) {
      const { searchParams } = new URL(req.url)
      id = searchParams.get("id")
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Silinecek sipariş ID gereklidir." }, { status: 400 })
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { id: true, orderNumber: true }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 })
    }

    // Cascade ilişki olduğu için orderItems, payments, refunds otomatik silinir
    await prisma.order.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true, 
      message: `#${existingOrder.orderNumber} numaralı sipariş başarıyla silindi.` 
    })
  } catch (error: any) {
    console.error("Order delete error:", error)
    return NextResponse.json({ 
      error: "Sipariş silinirken bir hata oluştu: " + (error.message || String(error)) 
    }, { status: 500 })
  }
}

// 3. Tekil Sipariş Detaylarını Getir
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Sipariş ID belirtilmelidir." }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
        payments: true,
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            },
            variant: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Order get error:", error)
    return NextResponse.json({ error: "Sipariş yüklenirken hata oluştu." }, { status: 500 })
  }
}
