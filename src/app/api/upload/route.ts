import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Determine correct extension from mime type
    const mimeType = file.type || "image/jpeg"
    let ext = "jpg"
    if (mimeType.includes("png")) ext = "png"
    else if (mimeType.includes("webp")) ext = "webp"
    else if (mimeType.includes("gif")) ext = "gif"
    else if (mimeType.includes("heic")) ext = "heic"

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    let originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "") // Sanitize filename
    
    // Ensure filename ends with correct extension
    if (!originalName.toLowerCase().endsWith(`.${ext}`)) {
      originalName = `${originalName}.${ext}`
    }
    
    const filename = `${uniqueSuffix}-${originalName}`
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({ url: `/api/images/${filename}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 })
  }
}
