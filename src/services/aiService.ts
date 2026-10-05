import OpenAI from "openai"

// Initialize OpenAI client (requires OPENAI_API_KEY in .env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
})

export interface AIProductDraft {
  name: string
  slug: string
  category: string
  shortDescription: string
  longDescription: string
  seoTitle: string
  seoDescription: string
  tags: string[]
  attributes: { key: string; value: string }[]
}

const SYSTEM_PROMPT = `Sen profesyonel bir e-ticaret ve gıda perakendesi ürün yöneticisisin. 
Sana verilen ürün adını inceleyerek detaylı, SEO uyumlu, iştah açıcı ve premium bir ürün taslağı oluşturacaksın.

KURALLAR:
1. Asla sağlık/tedavi iddialarında bulunma (örn: "hastalığı tedavi eder", "bağışıklığı kesin güçlendirir", "kilo verdirir" KULLANMA).
2. Sadece JSON formatında, aşağıdaki yapıya birebir uyarak cevap ver. Başka hiçbir metin veya markdown ekleme.
3. Kategori bilgisini "Kuru Yemiş", "Kuru Meyve", "Lokum", "Çikolata", "Kahve", "Yöresel", "Baharat" vb. ana gruplardan en uygun olanı seçerek yaz.
4. Slug alanını Türkçe karakter kullanmadan, küçük harfle, boşlukları tire ile değiştirerek oluştur.

Beklenen JSON Yapısı:
{
  "name": "Tam Ürün Adı (Örn: Ekstra İri Kavrulmuş Antep Fıstığı)",
  "slug": "ekstra-iri-kavrulmus-antep-fistigi",
  "category": "Kuru Yemiş",
  "shortDescription": "Maksimum 150 karakterlik iştah açıcı kısa açıklama.",
  "longDescription": "Detaylı, lezzet profili ve kullanım alanlarını anlatan, HTML p etiketleri kullanılmış uzun açıklama.",
  "seoTitle": "SEO Uyumlu Title (Maks 60 karakter)",
  "seoDescription": "SEO Uyumlu Meta Description (Maks 160 karakter)",
  "tags": ["antep fıstığı", "kavrulmuş", "tuzlu", "atıştırmalık"],
  "attributes": [
    { "key": "Kavrulma Durumu", "value": "Kavrulmuş" },
    { "key": "Tuz Oranı", "value": "Hafif Tuzlu" },
    { "key": "Boyut", "value": "İri (Duble)" }
  ]
}
`

export async function generateProductDraft(productName: string): Promise<AIProductDraft> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for speed and cost-efficiency
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Lütfen şu ürün için taslak oluştur: "${productName}"` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error("AI did not return any content.")

    const parsed = JSON.parse(content) as AIProductDraft
    return parsed
  } catch (error) {
    console.error("AI Generation Error:", error)
    throw new Error("Ürün taslağı oluşturulurken bir hata oluştu.")
  }
}
