"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function saveProductDescriptions({
  id,
  shortDescription,
  longDescription,
}: {
  id: string
  shortDescription: string | null
  longDescription: string | null
}) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Bu işlemi gerçekleştirmek için yönetici yetkisi gereklidir.")
  }

  if (!id) {
    throw new Error("Ürün ID gereklidir.")
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      shortDescription: shortDescription ? shortDescription.trim() : null,
      longDescription: longDescription ? longDescription.trim() : null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      longDescription: true,
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "UPDATE_DESCRIPTIONS",
      resource: "Product",
      details: `Ürün açıklaması güncellendi: ${updatedProduct.name}`,
    }
  })

  revalidatePath("/admin-hoppo-twin/hizli-aciklama")
  revalidatePath("/admin-hoppo-twin/urunler")
  revalidatePath("/urun/" + updatedProduct.slug)
  revalidatePath("/")

  return { success: true, product: updatedProduct }
}
