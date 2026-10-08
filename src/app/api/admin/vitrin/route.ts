import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 401 })
    }

    const { bestSellerIds, popularIds } = await req.json()

    // Çok satanları güncelle (isFeatured)
    if (bestSellerIds && Array.isArray(bestSellerIds)) {
      await prisma.product.updateMany({
        data: { isFeatured: false }
      })
      if (bestSellerIds.length > 0) {
        await prisma.product.updateMany({
          where: { id: { in: bestSellerIds } },
          data: { isFeatured: true }
        })
      }
    }

    // Popüler ürünleri güncelle (isNew)
    if (popularIds && Array.isArray(popularIds)) {
      await prisma.product.updateMany({
        data: { isNew: false }
      })
      if (popularIds.length > 0) {
        await prisma.product.updateMany({
          where: { id: { in: popularIds } },
          data: { isNew: true }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Vitrin güncelleme hatası:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
