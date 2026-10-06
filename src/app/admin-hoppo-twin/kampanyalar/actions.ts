"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createCoupon(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  const code = formData.get("code")?.toString()
  const type = formData.get("type")?.toString()
  const value = formData.get("value")?.toString()
  const usageLimit = formData.get("usageLimit")?.toString()

  if (!code || !type || !value) {
    throw new Error("Lütfen zorunlu alanları doldurun.")
  }

  const existing = await prisma.coupon.findUnique({ where: { code } })
  if (existing) {
    throw new Error("Bu kupon kodu zaten mevcut.")
  }

  await prisma.coupon.create({
    data: {
      code: code.toUpperCase().replace(/\s+/g, ''),
      type,
      value: parseFloat(value),
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      isActive: true,
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "CREATE",
      resource: "Coupon",
      details: `Yeni kupon oluşturuldu: ${code}`
    }
  })

  revalidatePath("/admin-hoppo-twin/kampanyalar")
  return { success: true }
}

export async function deleteCoupon(id: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  const coupon = await prisma.coupon.findUnique({ where: { id } })
  if (!coupon) throw new Error("Kupon bulunamadı")

  await prisma.coupon.delete({ where: { id } })

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "DELETE",
      resource: "Coupon",
      details: `Kupon silindi: ${coupon.code}`
    }
  })

  revalidatePath("/admin-hoppo-twin/kampanyalar")
  return { success: true }
}
