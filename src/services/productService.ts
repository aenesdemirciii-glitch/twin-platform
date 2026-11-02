import prisma from "@/lib/prisma"
import productDescriptions from "@/data/productDescriptions.json"

function normalizeTitle(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '')
}

const KIS_PAKETI_SHORT_DESC = `Kışın sıcaklığını, doğanın bereketini ve geleneksel lezzetleri bir araya getiren İkizler Baharatçılık Kış Paketi, özenle seçilmiş 14 farklı üründen oluşan zengin içeriğiyle sizlerle buluşuyor. Çıtır kuruyemişlerden doğal meyve lezzetlerine, kış aylarının vazgeçilmezi bitki çaylarından geleneksel kahvaltılık ürünlere kadar birçok lezzet bu özel pakette bir araya geliyor.`

const KIS_PAKETI_LONG_DESC = `## Kış Paketi

Kışın sıcaklığını, doğanın bereketini ve geleneksel lezzetleri bir araya getiren **İkizler Baharatçılık Kış Paketi**, özenle seçilmiş 14 farklı üründen oluşan zengin içeriğiyle sizlerle buluşuyor.

Çıtır kuruyemişlerden doğal meyve lezzetlerine, kış aylarının vazgeçilmezi bitki çaylarından geleneksel kahvaltılık ürünlere kadar birçok lezzet bu özel pakette bir araya geliyor.

Hem kendiniz hem de sevdikleriniz için hazırlanan Kış Paketi, lezzetli bir kış geçirmek ve farklı ürünleri tek pakette deneyimlemek isteyenler için ideal bir seçenek.

### Paket İçeriği

**Kuruyemişler ve Geleneksel Lezzetler**
- Fındık 250 g
- Sarı Üzüm 250 g
- Günkurusu Jumbo Kayısı 250 g
- Ceviz İçi 250 g
- Sarı Leblebi 250 g
- Cevizli Sucuk 500 g
- Köy Leblebisi 250 g
- Tuzlu Jumbo Yer Fıstığı 250 g

**Çay Çeşitleri**
- Kış Çayı 200 g
- Beyaz Çay 50 g

**Geleneksel Sofra Lezzetleri**
- Saf Nar Ekşisi
- Taze Çekilmiş Tahin

**Kişisel Bakım Ürünleri**
- Balen Lavanta Yağı
- Bıttım Sabunu

### Neden Kış Paketi?

Özenle seçilmiş kuruyemiş çeşitleri, geleneksel tatlar ve aromatik çaylarla kış günlerinize lezzet katın. Taze çekilmiş tahin ve saf nar ekşisiyle sofralarınızı zenginleştirirken lavanta yağı ve bıttım sabunuyla kişisel bakımınıza da yer açın.

İkizler Baharatçılık tarafından bir araya getirilen bu özel paket, farklı ihtiyaçlara hitap eden ürünleri tek alışverişte edinme kolaylığı sunar.

**Kışın en sevilen lezzetleri ve doğal bakım ürünleri tek pakette!**

*Not: Ürünlerin içerik ve alerjen bilgileri için ambalaj üzerindeki etiketleri inceleyiniz. Kuruyemişler, yer fıstığı, cevizli sucuk ve tahin alerjen içerebilir.*`

const KIS_PAKETI_SEO_DESC = `İkizler Baharatçılık Kış Paketi, 14 farklı kuruyemiş, bitki çayı, saf nar ekşisi, tahin ve doğal bakım ürünleriyle kış boyu lezzet ve enerji sunar.`

export async function getProductBySlug(slug: string) {
  try {
    let product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        attributes: true,
        category: true,
        brand: true,
      }
    })

    // If not found, check alternative slug for winter package
    if (!product && (slug === 'k-paketi' || slug === 'kis-paketi')) {
      const altSlug = slug === 'k-paketi' ? 'kis-paketi' : 'k-paketi'
      product = await prisma.product.findUnique({
        where: { slug: altSlug },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          attributes: true,
          category: true,
          brand: true,
        }
      })
    }

    // Secondary fallback for winter package by name if still not found
    if (!product && (slug === 'k-paketi' || slug === 'kis-paketi')) {
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { name: { contains: 'Kış Paketi' } },
            { name: { contains: 'Kis Paketi' } }
          ],
          isActive: true
        },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          attributes: true,
          category: true,
          brand: true,
        }
      })
    }

    // Virtual fallback if product record is missing from database
    if (!product && (slug === 'k-paketi' || slug === 'kis-paketi')) {
      product = {
        id: 'kis-paketi-virtual-id',
        name: 'Kış Paketi',
        slug: slug,
        price: 3500 as any,
        discountPrice: 3000 as any,
        stock: 100,
        isActive: true,
        isFeatured: true,
        shortDescription: KIS_PAKETI_SHORT_DESC,
        longDescription: KIS_PAKETI_LONG_DESC,
        seoDescription: KIS_PAKETI_SEO_DESC,
        images: [
          {
            id: 'kis-paketi-virtual-img',
            productId: 'kis-paketi-virtual-id',
            url: '/images/kis-paketi.jpg',
            sortOrder: 0,
            createdAt: new Date(),
          } as any
        ],
        variants: [],
        attributes: [],
        category: { id: 'kat-ozel', name: 'Özel Paketler', slug: 'ozel-paketler' },
        brand: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any
    }
    
    if (product) {
      const isKisPaketi = 
        product.slug === 'k-paketi' || 
        product.slug === 'kis-paketi' || 
        slug === 'k-paketi' || 
        slug === 'kis-paketi' ||
        product.name.toLowerCase().includes('kış paketi') ||
        product.name.toLowerCase().includes('kis paketi')

      if (isKisPaketi) {
        product.price = 3500 as any
        product.discountPrice = 3000 as any
        product.images = [
          {
            id: 'kis-paketi-banner-img',
            productId: product.id,
            url: '/images/kis-paketi.jpg',
            sortOrder: 0,
            createdAt: new Date(),
          } as any,
          ...(product.images ? product.images.filter((img: any) => img.url !== '/images/kis-paketi.jpg') : [])
        ]
        product.shortDescription = KIS_PAKETI_SHORT_DESC
        product.longDescription = KIS_PAKETI_LONG_DESC
        product.seoDescription = KIS_PAKETI_SEO_DESC
      }

      // If DB description is empty or default, fallback to Excel descriptions
      if (!product.shortDescription || product.shortDescription.trim() === '') {
        const targetNorm = normalizeTitle(product.name)
        const match = productDescriptions.find((item: any) => {
          const itemNorm = normalizeTitle(item.name)
          return itemNorm === targetNorm || itemNorm.includes(targetNorm) || targetNorm.includes(itemNorm)
        })
        if (match) {
          product.shortDescription = match.description
          product.longDescription = (match as any).longDescription || match.description
          if (!product.seoDescription) {
            product.seoDescription = match.seoDescription
          }
        }
      }
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getActiveProducts(params?: { categorySlug?: string, take?: number, skip?: number }) {
  try {
    const whereClause: any = { isActive: true }
    
    if (params?.categorySlug) {
      whereClause.category = { slug: params.categorySlug.toLowerCase() }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 }
      },
      take: params?.take || 20,
      skip: params?.skip || 0,
      orderBy: { createdAt: 'desc' }
    })
    
    const mapProduct = (p: any) => {
      const isWinter = p.slug === 'k-paketi' || p.slug === 'kis-paketi' || p.name?.toLowerCase().includes('kış paketi') || p.name?.toLowerCase().includes('kis paketi')
      if (isWinter) {
        return {
          ...p,
          price: 3500 as any,
          discountPrice: 3000 as any,
          images: [{ id: 'kis-cover', url: '/images/kis-paketi.jpg' }]
        }
      }
      return p
    }

    return products.map(mapProduct)
  } catch (error) {
    console.error("Error fetching active products:", error)
    return []
  }
}

export async function getCategoryData(slug: string, params?: { take?: number, skip?: number, sort?: string }) {
  try {
    const category = await prisma.category.findUnique({ where: { slug: slug.toLowerCase() } })
    
    const whereClause: any = { isActive: true, category: { slug: slug.toLowerCase() } }
    
    let orderBy: any = { createdAt: 'desc' }
    if (params?.sort === 'price_asc') orderBy = { price: 'asc' }
    if (params?.sort === 'price_desc') orderBy = { price: 'desc' }
    if (params?.sort === 'newest') orderBy = { createdAt: 'desc' }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 }
      },
      take: params?.take || 12,
      skip: params?.skip || 0,
      orderBy
    })
    
    const total = await prisma.product.count({ where: whereClause })
    
    const mapProduct = (p: any) => {
      const isWinter = p.slug === 'k-paketi' || p.slug === 'kis-paketi' || p.name?.toLowerCase().includes('kış paketi') || p.name?.toLowerCase().includes('kis paketi')
      if (isWinter) {
        return {
          ...p,
          price: 3500 as any,
          discountPrice: 3000 as any,
          images: [{ id: 'kis-cover', url: '/images/kis-paketi.jpg' }]
        }
      }
      return p
    }

    return { category, products: products.map(mapProduct), total }
  } catch (error) {
    console.error("Error fetching category data:", error)
    return { category: null, products: [], total: 0 }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      }
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Admin function
export async function createProductFromDraft(draftData: any) {
  // Logic to convert draft JSON into a real DB product (status: false/draft)
  try {
    const product = await prisma.product.create({
      data: {
        name: draftData.name,
        slug: draftData.slug,
        sku: `SKU-${Date.now()}`,
        shortDescription: draftData.shortDescription,
        longDescription: draftData.longDescription,
        price: 0, // Admin needs to set price
        seoTitle: draftData.seoTitle,
        seoDescription: draftData.seoDescription,
        isActive: false, // Default false until admin approves
      }
    })
    return product
  } catch (error) {
    console.error("Error creating product from draft:", error)
    throw error
  }
}
