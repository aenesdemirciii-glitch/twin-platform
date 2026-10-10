"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function bulkUpdatePrices(updates: { id: string; price: number; discountPrice: number | null; stock: number }[]) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  // Use a transaction to perform all updates efficiently
  const transactions = updates.map((update) => {
    return prisma.product.update({
      where: { id: update.id },
      data: {
        price: update.price,
        discountPrice: update.discountPrice,
        stock: update.stock
      }
    })
  })

  await prisma.$transaction(transactions)
  
  return { success: true, count: updates.length }
}
