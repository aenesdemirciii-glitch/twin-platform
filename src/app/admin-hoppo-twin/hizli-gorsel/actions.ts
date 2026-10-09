"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addImageToProduct(productId: string, imageUrl: string) {
  try {
    // Veritabanındaki eski kırık görselleri sil ki iki tane görsel görünmesin
    await prisma.productImage.deleteMany({
      where: { productId }
    })

    await prisma.productImage.create({
      data: {
        productId: productId,
        url: imageUrl,
        creator: "Hızlı Yükleyici",
        isMain: true,
      }
    })
    
    revalidatePath('/admin-hoppo-twin/urunler')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Action error:", error)
    throw new Error(error.message || "Veritabanı kayıt hatası")
  }
}
