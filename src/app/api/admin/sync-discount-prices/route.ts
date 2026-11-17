import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

function calculateOriginalPrice(sellingPrice: number): number {
  if (sellingPrice <= 0) return 0
  const rawOriginal = sellingPrice * 1.20
  let original = Math.ceil(rawOriginal / 5) * 5
  if (original <= sellingPrice) {
    original = sellingPrice + 5
  }
  return original
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true }
    })

    let updatedProductCount = 0
    let updatedVariantCount = 0
    const summary: any[] = []

    for (const product of products) {
      const isWinter = 
        product.slug === 'k-paketi' || 
        product.slug === 'kis-paketi' || 
        product.name.toLowerCase().includes('kış paketi') || 
        product.name.toLowerCase().includes('kis paketi')

      let currentSelling = 0
      if (isWinter) {
        currentSelling = 3000
      } else if (product.discountPrice && Number(product.discountPrice) > 0 && Number(product.discountPrice) < Number(product.price)) {
        currentSelling = Number(product.discountPrice)
      } else {
        currentSelling = Number(product.price) || 0
      }

      if (currentSelling > 0) {
        const originalPrice = isWinter ? 3600 : calculateOriginalPrice(currentSelling)

        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: originalPrice,
            discountPrice: currentSelling
          }
        })
        updatedProductCount++
        summary.push({
          id: product.id,
          name: product.name,
          oldSellingPrice: currentSelling,
          newOriginalPrice: originalPrice,
          newDiscountPrice: currentSelling
        })
      }

      // Varyantlar
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          let vSelling = 0
          if (variant.discountPrice && Number(variant.discountPrice) > 0 && Number(variant.discountPrice) < Number(variant.price)) {
            vSelling = Number(variant.discountPrice)
          } else {
            vSelling = Number(variant.price || currentSelling) || 0
          }

          if (vSelling > 0) {
            const vOriginal = isWinter ? 3600 : calculateOriginalPrice(vSelling)
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: {
                price: vOriginal,
                discountPrice: vSelling
              }
            })
            updatedVariantCount++
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedProductCount} ürün ve ${updatedVariantCount} varyant başarıyla güncellendi.`,
      updatedProductCount,
      updatedVariantCount,
      sample: summary.slice(0, 10)
    })
  } catch (error: any) {
    console.error("Fiyat senkronizasyonu hatası:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
