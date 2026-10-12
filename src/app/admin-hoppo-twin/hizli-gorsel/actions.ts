"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addImageToProduct(productId: string, imageUrl: string) {
  try {
    if (!productId || !imageUrl) {
      return { success: false, error: "Ürün ID veya görsel adresi eksik." }
    }

    const cleanUrl = imageUrl.trim()

    // Veritabanındaki eski görselleri temizle ve yenisini ana görsel olarak ata
    await prisma.productImage.deleteMany({
      where: { productId }
    })

    const newImage = await prisma.productImage.create({
      data: {
        productId: productId,
        url: cleanUrl,
        creator: "Hızlı Yükleyici",
        isMain: true,
      }
    })
    
    revalidatePath('/admin-hoppo-twin/urunler')
    revalidatePath('/admin-hoppo-twin/hizli-gorsel')
    revalidatePath('/')
    revalidatePath('/urunler')
    
    return { success: true, image: { id: newImage.id, url: newImage.url } }
  } catch (error: any) {
    console.error("Action error:", error)
    return { success: false, error: error.message || "Veritabanı kayıt hatası" }
  }
}

export async function removeProductImage(productId: string) {
  try {
    if (!productId) {
      return { success: false, error: "Ürün ID eksik." }
    }

    await prisma.productImage.deleteMany({
      where: { productId }
    })

    revalidatePath('/admin-hoppo-twin/urunler')
    revalidatePath('/admin-hoppo-twin/hizli-gorsel')
    revalidatePath('/')
    revalidatePath('/urunler')

    return { success: true }
  } catch (error: any) {
    console.error("Remove image error:", error)
    return { success: false, error: error.message || "Görsel silinemedi" }
  }
}
