import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { STATIC_PAGES } from "@/data/staticPages"

export async function GET() {
  try {
    // 1. Delete or deactivate SSS if it exists
    await prisma.page.deleteMany({
      where: { slug: "sss" }
    }).catch(() => {})

    // 2. Upsert static pages
    for (const [slug, pageData] of Object.entries(STATIC_PAGES)) {
      await prisma.page.upsert({
        where: { slug },
        update: {
          title: pageData.title,
          content: pageData.content,
          seoTitle: pageData.seoTitle,
          seoDesc: pageData.metaDescription,
          isActive: true
        },
        create: {
          slug,
          title: pageData.title,
          content: pageData.content,
          seoTitle: pageData.seoTitle,
          seoDesc: pageData.metaDescription,
          isActive: true
        }
      })
    }

    // 3. Seed Blog Posts from blogData
    const blogPosts = [
      {
        slug: "cevizin-faydalari-nelerdir",
        title: "Cevizin Faydaları: Neden Her Gün Tüketmeliyiz?",
        category: "Sağlıklı Yaşam",
        excerpt: "Beyin dostu ceviz, kalp sağlığından sindirim sistemine kadar birçok fayda sunar. Peki cevizi nasıl ve ne kadar tüketmeliyiz?",
        content: "Ceviz, hem lezzeti hem de sunduğu inanılmaz sağlık faydalarıyla kuruyemiş dünyasının şüphesiz yıldızlarından biridir. İçerdiği yüksek omega-3 yağ asitleri sayesinde beyin fonksiyonlarını desteklediği uzun yıllardır bilinen bir gerçektir.\n\n### Kalp Dostu Bir Seçim\nHer gün bir avuç ceviz tüketmek, kötü kolesterol (LDL) seviyelerinin düşmesine yardımcı olur. Aynı zamanda kan damarlarının esnekliğini koruyarak kalp krizi riskini azaltır.\n\n### Günlük Ne Kadar Tüketilmeli?\nUzmanlar, günde ortalama 3-4 tam ceviz (veya bir avuç) tüketmenin günlük ihtiyaç duyulan sağlıklı yağları almak için ideal olduğunu belirtmektedir.",
        isActive: true
      },
      {
        slug: "kavrulmus-ve-cig-kuruyemis-farki",
        title: "Kavrulmuş ve Çiğ Kuruyemiş Arasındaki Farklar Nelerdir?",
        category: "Beslenme Rehberi",
        excerpt: "Kuruyemiş alırken çiğ mi yoksa kavrulmuş mu tercih etmelisiniz? Besin değerleri nasıl değişiyor?",
        content: "Kuruyemişleri çiğ veya kavrulmuş olarak tüketmek tamamen damak tadınıza bağlı gibi görünse de, işin beslenme boyutunda bazı önemli detaylar bulunur.\n\n### Besin Değeri Kaybı Yaşanır Mı?\nKavurma işlemi genellikle kuruyemişin aromasını ve çıtırlığını artırır. Ancak çok yüksek ısıda kavurma, kuruyemişte bulunan B vitaminleri gibi sıcağa duyarlı bazı vitaminlerin azalmasına neden olabilir.\n\n### Hangi Durumda Çiğ Tercih Edilmeli?\nEğer kuruyemişlerden en yüksek oranda doğal yağ, mineral ve vitamin almak istiyorsanız veya diyetiniz gereği tamamen işlenmemiş ürünler tüketiyorsanız, çiğ (kavrulmamış) ceviz, badem veya fındık tercih edebilirsiniz.",
        isActive: true
      },
      {
        slug: "antep-fistigi-hakkinda-ilginc-bilgiler",
        title: "Boz İç Antep Fıstığı Neden Daha Değerli?",
        category: "Ürün İncelemeleri",
        excerpt: "Baklavaların gizli kahramanı boz iç fıstık nedir ve normal Antep fıstığından neden daha kıymetlidir?",
        content: "Gaziantep yöresinin altın değerindeki ürünü Antep fıstığı, hasat zamanına göre farklı isimler alır. Kırmızı kabuklu, tam olgunlaşmış fıstıklar kuruyemiş olarak tüketilirken, baklavacılıkta \"Boz İç\" fıstık kullanılır.\n\n### Boz İç Nedir?\nFıstık henüz tam olgunlaşmadan, yani içi kırmızıya dönmeden bir ay önce hasat edilirse buna boz fıstık denir. Bu dönemde fıstığın içi zümrüt yeşilidir ve aroma olarak en yoğun olduğu evredir.\n\n### Neden Daha Pahalı?\nHenüz tam büyümeden hasat edildiği için ağaçtan alınan toplam ürün ağırlığı düşüktür. Bir kilo boz iç fıstık elde etmek için çok daha fazla fıstık harcanır. Ancak sunduğu o eşsiz tat ve muazzam yeşil renk, tatlılarda onu vazgeçilmez kılar.",
        isActive: true
      }
    ]

    for (const post of blogPosts) {
      const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
      if (!exists) {
        await prisma.blogPost.create({ data: post })
      }
    }

    return NextResponse.json({ success: true, message: "CMS içerikleri ve kurumsal sayfalar güncellendi!" })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
