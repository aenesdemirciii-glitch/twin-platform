import fs from "fs"
import path from "path"
import sharp from "sharp"

export async function downloadAndOptimizeImage(url: string, prefix: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Görsel indirilemedi.")
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate safe filename: antep-fistigi-1704067200.webp
    const timestamp = Date.now()
    const fileName = `${prefix}-${timestamp}.webp`
    
    // Create Year/Month folders
    const date = new Date()
    const yearMonth = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", yearMonth)
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)

    // Optimize and convert to WebP
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath)

    // Return public URL path
    return `/uploads/${yearMonth}/${fileName}`
  } catch (error) {
    console.error("Media Service Error:", error)
    throw new Error("Görsel işlenirken hata oluştu.")
  }
}
