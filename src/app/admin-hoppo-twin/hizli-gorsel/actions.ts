"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addImageToProduct(productId: string, imageUrl: string) {
  // Veritabanındaki eski kırık görselleri sil ki iki tane görsel görünmesin
  await prisma.productImage.deleteMany({
    where: { productId }
  })

  await prisma.productImage.create({
    data: {
      productId: productId,
      url: imageUrl,
      creator: "Hızlı Yükleyici",
      license: "Yerel"
    }
  })
  
  revalidatePath('/admin-hoppo-twin/urunler')
  revalidatePath('/')
  return { success: true }
}
