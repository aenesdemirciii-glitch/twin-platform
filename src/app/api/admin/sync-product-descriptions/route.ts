import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import productDescriptions from "@/data/productDescriptions.json"

export const dynamic = "force-dynamic"

function normalizeTitle(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '')
}

export async function GET() {
  try {
    let updatedCount = 0
    let notFoundCount = 0
    const logs: string[] = []

    // Fetch all products in the database
    const dbProducts = await prisma.product.findMany({
      select: { id: true, name: true, slug: true }
    })

    for (const item of productDescriptions) {
      const targetNorm = normalizeTitle(item.name)
      
      // Find matching product in DB by exact name, normalized name, or inclusion
      const matched = dbProducts.find(p => {
        const pNorm = normalizeTitle(p.name)
        return pNorm === targetNorm || p.name.toLowerCase() === item.name.toLowerCase()
      }) || dbProducts.find(p => {
        const pNorm = normalizeTitle(p.name)
        return pNorm.includes(targetNorm) || targetNorm.includes(pNorm)
      })

      if (matched) {
        await prisma.product.update({
          where: { id: matched.id },
          data: {
            shortDescription: item.description,
            longDescription: item.description,
            seoDescription: item.seoDescription,
            seoTitle: `${matched.name} | İkizler Baharatçılık`
          }
        })
        updatedCount++
        logs.push(`Güncellendi: [${matched.name}] <- "${item.name}"`)
      } else {
        notFoundCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount} ürün açıklaması ve SEO metni veritabanında başarıyla güncellendi.`,
      stats: {
        totalJsonItems: productDescriptions.length,
        totalDbProducts: dbProducts.length,
        updatedCount,
        notFoundCount
      },
      sampleLogs: logs.slice(0, 15)
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
