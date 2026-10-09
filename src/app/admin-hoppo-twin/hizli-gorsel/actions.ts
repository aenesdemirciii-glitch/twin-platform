"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addImageToProduct(productId: string, imageUrl: string) {
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
