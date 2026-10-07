import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { join } from "path"
import { readFile, rename } from "fs/promises"
import { existsSync } from "fs"

export async function GET(req: Request) {
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
          // File is actually WebP but has wrong extension
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

    return NextResponse.json({ success: true, fixedCount })
  } catch (error) {
    console.error("Fix images error:", error)
    return NextResponse.json({ error: "Onarım sırasında hata oluştu." }, { status: 500 })
  }
}
