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
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate type
    const mimeType = file.type
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ error: "Sadece görsel dosyaları yüklenebilir" }, { status: 400 })
    }

    // Generate unique name
    const ext = file.name.split(".").pop() || "jpg"
    const uniqueId = crypto.randomBytes(8).toString("hex")
    const fileName = `upload-${uniqueId}.${ext}`

    // Ensure directory exists
    const uploadsDir = process.env.STORAGE_PATH 
      ? process.env.STORAGE_PATH 
      : path.join(process.cwd(), "public", "uploads")
      
    try {
      await fs.access(uploadsDir)
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true })
    }

    const filePath = path.join(uploadsDir, fileName)
    await fs.writeFile(filePath, buffer)

    const localUrl = `/api/images/${fileName}`

    return NextResponse.json({
      localUrl,
      fileName,
      mimeType,
      size: buffer.length
    })

  } catch (error: any) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
