import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // 1. Seed Pages
    const pages = [
      {
        title: "Hakkımızda",
        slug: "hakkimizda",
        content: "### Biz Kimiz?\n\nİkizler Baharatçılık olarak yarım asırlık tecrübemizle en taze ve kaliteli kuruyemiş, baharat ve yöresel ürünleri sofralarınıza getiriyoruz...\n\n(Lütfen admin panelden bu metni güncelleyiniz.)",
        isActive: true
      },
      {
        title: "Kalite Belgelerimiz",
        slug: "kalite-belgelerimiz",
        content: "Tüm ürünlerimiz uluslararası kalite standartlarına uygun olarak üretilmekte ve paketlenmektedir.\n\n(Lütfen kalite belgelerinizin görsellerini ve detaylarını admin panelden buraya ekleyiniz.)",
        isActive: true
      },
      {
        title: "Mağazalarımız & İletişim",
        slug: "iletisim",
        content: "### İletişim Bilgilerimiz\n\n**Adres:** Örnek Mahallesi, Örnek Sokak No:1\n**Telefon:** 0555 555 55 55\n**E-posta:** info@ikizlerbaharatcilik.com",
        isActive: true
      },
      {
        title: "Toptan Satış",
        slug: "toptan",
        content: "Kafe, restoran veya işletmeniz için toptan kuruyemiş ve baharat alımlarınızda bize ulaşın. Özel fiyatlandırma ve hızlı teslimat avantajlarından yararlanın.",
        isActive: true
      },
      {
        title: "Mesafeli Satış Sözleşmesi",
        slug: "mesafeli-satis",
        content: "### MADDE 1 - TARAFLAR\n\nİşbu Sözleşme, aşağıdaki taraflar arasında belirtilen hüküm ve şartlar çerçevesinde imzalanmıştır...\n\n(Lütfen yasal metninizi buraya yapıştırınız.)",
        isActive: true
      },
      {
        title: "KVKK Aydınlatma Metni",
        slug: "kvkk",
        content: "Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu sıfatıyla şirketimiz tarafından işlenmektedir...\n\n(Lütfen tam yasal metninizi buraya yapıştırınız.)",
        isActive: true
      },
      {
        title: "Sıkça Sorulan Sorular",
        slug: "sss",
        content: "### Kargo kaç günde gelir?\nSiparişleriniz 1-3 iş günü içerisinde kargoya teslim edilmektedir.\n\n### İade yapabilir miyim?\nEvet, açılmamış paketleri 14 gün içinde iade edebilirsiniz.",
        isActive: true
      },
      {
        title: "İade ve İptal Koşulları",
        slug: "iade",
        content: "Almış olduğunuz ürünleri ambalajı açılmamış, kullanılmamış ve bozulmamış olması şartıyla teslimat tarihinden itibaren 14 gün içinde iade edebilirsiniz.",
        isActive: true
      },
      {
        title: "Gizlilik Sözleşmesi",
        slug: "gizlilik",
        content: "Müşterilerimize ait tüm kişisel bilgiler, en yüksek güvenlik standartlarında korunmakta olup, 3. şahıs veya kurumlarla kesinlikle paylaşılmamaktadır.",
        isActive: true
      }
    ]

    for (const page of pages) {
      const exists = await prisma.page.findUnique({ where: { slug: page.slug } })
      if (!exists) {
        await prisma.page.create({ data: page })
      }
    }

    // 2. Seed Blog Posts from blogData
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

    return NextResponse.json({ success: true, message: "CMS içerikleri başarıyla eklendi!" })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
