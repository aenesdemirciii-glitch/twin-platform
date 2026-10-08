import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { join } from "path"
import { readFile, rename } from "fs/promises"
import { existsSync } from "fs"

export async function GET(req: Request) {
  try {
    let output = []
    
    // 1. Fix Image MIME types (JPG -> WEBP)
    try {
      const images = await prisma.productImage.findMany()
      let fixedCount = 0

      for (const img of images) {
        if (!img.url.startsWith("/uploads/")) continue

        const filename = img.url.split("/").pop()
        if (!filename) continue

        const filepath = join(process.cwd(), "public", "uploads", filename)
        if (!existsSync(filepath)) continue

        // Read first 12 bytes to check for WebP signature (RIFF....WEBP)
        const buffer = await readFile(filepath)
        if (buffer.length > 12) {
          const isWebP = buffer.toString('utf8', 8, 12) === 'WEBP'
          
          if (isWebP && !filename.toLowerCase().endsWith('.webp')) {
            const newFilename = filename.replace(/\.[^/.]+$/, "") + ".webp"
            const newFilepath = join(process.cwd(), "public", "uploads", newFilename)
            
            await rename(filepath, newFilepath)
            
            await prisma.productImage.update({
              where: { id: img.id },
              data: { url: `/uploads/${newFilename}` }
            })
            
            fixedCount++
          }
        }
      }
      output.push(`Fixed ${fixedCount} WebP images.`)
    } catch (e: any) {
      output.push(`Error fixing images: ${e.message}`)
    }

    // 2. Set Popular Products
    const popularNames = [
      "Nar ekşisi", 
      "Fıstık ezmesi", 
      "Sumak ekşisi", 
      "Karadut özü", 
      "Türk kahvesi", 
      "Zarlı kaju", 
      "Hindistan cevizi yağı",
      "H cevizi yağı",
      "Gül suyu"
    ]

    try {
      // First, set all products to not featured to reset
      // Optional: await prisma.product.updateMany({ data: { isFeatured: false } })
      
      let matchedCount = 0
      for (const name of popularNames) {
        const products = await prisma.product.findMany({
          where: { name: { contains: name } }
        })
        
        for (const p of products) {
          await prisma.product.update({
            where: { id: p.id },
            data: { isFeatured: true }
          })
          matchedCount++
        }
      }
      output.push(`Set ${matchedCount} products to popular based on names.`)
    } catch (e: any) {
      output.push(`Error setting popular products: ${e.message}`)
    }

    return NextResponse.json({ success: true, log: output })
  } catch (error) {
    console.error("Auto-fix error:", error)
    return NextResponse.json({ error: "Onarım sırasında genel bir hata oluştu." }, { status: 500 })
  }
}
