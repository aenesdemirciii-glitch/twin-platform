import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const { url, altText, creator } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL gereklidir" }, { status: 400 })
    }

    // Download image
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Resim indirilemedi: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const contentType = response.headers.get("content-type") || "image/jpeg"
    let finalExt = "jpg"
    if (contentType.includes("webp")) finalExt = "webp"
    else if (contentType.includes("png")) finalExt = "png"
    else if (contentType.includes("gif")) finalExt = "gif"
    
    const uniqueId = crypto.randomBytes(8).toString("hex")
    const fileName = `product-${uniqueId}.${finalExt}`

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    try {
      await fs.access(uploadsDir)
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true })
    }

    const filePath = path.join(uploadsDir, fileName)
    await fs.writeFile(filePath, buffer)

    const localUrl = `/uploads/${fileName}`

    return NextResponse.json({
      localUrl,
      fileName,
      mimeType: response.headers.get("content-type") || "image/jpeg",
      size: buffer.length
    })

  } catch (error: any) {
    console.error("Download Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
