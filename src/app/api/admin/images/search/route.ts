import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    
    if (!query) {
      return NextResponse.json({ error: "Arama terimi gereklidir" }, { status: 400 })
    }

    // Read API key from env
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY

    if (!unsplashKey) {
      // Mock response if no key is provided, so UI still works
      return NextResponse.json({
        results: [
          {
            id: "mock1",
            urls: { regular: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80" },
            user: { name: "Mock Creator 1", links: { html: "https://unsplash.com" } }
          },
          {
            id: "mock2",
            urls: { regular: "https://images.unsplash.com/photo-1512805147242-c3e794c39686?w=800&q=80" },
            user: { name: "Mock Creator 2", links: { html: "https://unsplash.com" } }
          }
        ],
        warning: "UNSPLASH_ACCESS_KEY eksik. Sahte veriler gösteriliyor."
      })
    }

    // Call Unsplash API
    // Append 'food, spices, nuts' based on the site context if we want, but user query is enough
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape&client_id=${unsplashKey}`
    
    const response = await fetch(unsplashUrl)
    if (!response.ok) {
      throw new Error(`Unsplash API Hatası: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unsplash Search Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
