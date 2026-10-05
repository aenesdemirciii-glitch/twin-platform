import { NextResponse } from "next/server"
import { searchImagesOnUnsplash } from "@/services/imageService"

export async function GET(req: Request) {
  try {
    // 1. Auth Check (Mock for now)
    // const session = await getServerSession(authOptions) ...

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 12

    if (!query) {
      return NextResponse.json({ error: "Arama terimi (query) gereklidir." }, { status: 400 })
    }

    // 2. Fetch images
    const images = await searchImagesOnUnsplash(query, limit)

    return NextResponse.json({ images })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Görsel arama sırasında hata oluştu." }, { status: 500 })
  }
}
