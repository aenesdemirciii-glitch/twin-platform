import { NextResponse } from "next/server"
import { calculateBanabiOrder, getBanabiConfig, isSameDayDeliveryAvailable } from "@/services/courier/banabikurye"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { deliveryMethod, address, city, district, items } = body

    const config = await getBanabiConfig()

    // Test ürünü kontrolü: Eğer sepette "test" adında bir ürün varsa kargo bedeli 0 TL
    const isTestOrder = Array.isArray(items) && items.some((i: any) => 
      (i.name && String(i.name).toLowerCase().includes("test"))
    )

    if (isTestOrder) {
      return NextResponse.json({
        success: true,
        available: true,
        deliveryMethod: deliveryMethod || "standard",
        title: deliveryMethod === "banabikurye" ? "Aynı Gün Teslimat (Test Ücretsiz)" : "Standart Kargo (Test Ücretsiz)",
        description: "Test siparişinde kargo ücretsizdir.",
        price: 0,
        currency: "TL",
      })
    }

    // 1. SEÇENEK: STANDART KARGO (Sabit 199 TL)
    if (deliveryMethod === "standard" || !deliveryMethod) {
      return NextResponse.json({
        success: true,
        available: true,
        deliveryMethod: "standard",
        title: "Standart Kargo",
        description: "3-5 iş günü içerisinde teslimat",
        price: config.standardShippingFee || 199.00,
        currency: "TL",
      })
    }

    // 2. SEÇENEK: AYNI GÜN TESLİMAT (Banabikurye)
    if (deliveryMethod === "banabikurye") {
      // Saat kontrolü (17:00)
      const timeCheck = isSameDayDeliveryAvailable(config.cutoffHour)
      if (!timeCheck.available) {
        return NextResponse.json({
          success: false,
          available: false,
          deliveryMethod: "banabikurye",
          isAfterCutoff: true,
          error: timeCheck.reason || "Bugün için sipariş saati sona erdi.",
        })
      }

      // Adres kontrolü
      if (!address || typeof address !== "string" || address.trim().length < 6) {
        return NextResponse.json({
          success: false,
          available: false,
          deliveryMethod: "banabikurye",
          error: "Aynı Gün Teslimat fiyatı hesaplamak için lütfen teslimat adresinizi giriniz.",
        })
      }

      // Sepet ağırlığı tahmini (varsayılan her ürün ~0.5kg veya minimum 1kg)
      let totalWeight = 1
      if (Array.isArray(items) && items.length > 0) {
        totalWeight = items.reduce((sum, item) => sum + (Number(item.quantity) || 1) * 0.5, 0)
      }

      const result = await calculateBanabiOrder({
        deliveryAddress: address,
        deliveryCity: city || "İstanbul",
        deliveryDistrict: district || "",
        weightKg: Math.max(1, Math.round(totalWeight)),
        matter: "Baharat ve Doğal Gıda Ürünleri",
      })

      if (result.success && result.available && typeof result.price === "number") {
        return NextResponse.json({
          success: true,
          available: true,
          deliveryMethod: "banabikurye",
          title: "Aynı Gün Teslimat (Banabikurye)",
          description: "Banabikurye ile hızlı teslimat (Saat 17:00'ye kadar)",
          price: result.price,
          currency: "TL",
          warnings: result.warnings,
        })
      } else {
        return NextResponse.json({
          success: false,
          available: false,
          deliveryMethod: "banabikurye",
          isAfterCutoff: result.isAfterCutoff || false,
          error: result.error || "Bu adres için Aynı Gün Kurye hizmeti sağlanamamaktadır. Standart Kargo önerilir.",
        })
      }
    }

    return NextResponse.json({ error: "Geçersiz teslimat yöntemi." }, { status: 400 })
  } catch (error: any) {
    console.error("Delivery calculate API error:", error)
    return NextResponse.json(
      { error: "Teslimat ücreti hesaplanırken bir sorun oluştu. Lütfen Standart Kargo ile devam ediniz." },
      { status: 500 }
    )
  }
}
