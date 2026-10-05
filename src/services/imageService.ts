export interface ImageSearchResult {
  id: string
  url: string
  thumbUrl: string
  alt: string
  creatorName: string
  creatorUrl: string
  source: string // "unsplash", "pexels" vb.
}

export async function searchImagesOnUnsplash(query: string, limit = 12): Promise<ImageSearchResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    console.warn("Unsplash API Key eksik.")
    return []
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`
        }
      }
    )

    if (!res.ok) {
      throw new Error(`Unsplash API Error: ${res.statusText}`)
    }

    const data = await res.json()
    
    return data.results.map((item: any) => ({
      id: item.id,
      url: item.urls.regular,
      thumbUrl: item.urls.thumb,
      alt: item.alt_description || query,
      creatorName: item.user.name,
      creatorUrl: item.user.links.html,
      source: "unsplash"
    }))
  } catch (error) {
    console.error("Görsel arama hatası:", error)
    return []
  }
}
