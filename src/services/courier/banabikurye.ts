import prisma from "@/lib/prisma"

export interface BanabiConfig {
  apiToken: string
  baseUrl: string
  pickupAddress: string
  pickupPhone: string
  pickupName: string
  cutoffHour: number
  standardShippingFee: number
}

// Varsayılan mağaza sabit bilgileri (Kozyatağı Mağazası)
const DEFAULT_CONFIG: BanabiConfig = {
  apiToken: process.env.BANABI_API_TOKEN || "",
  baseUrl: process.env.BANABI_API_BASE_URL || "https://robotapitest.banabikurye.com/api/business/1.8",
  pickupAddress: process.env.BANABI_PICKUP_ADDRESS || "Kozyatağı Mah. Kocayol Cad Argun Apt, 34742 Kadıköy/İstanbul",
  pickupPhone: process.env.BANABI_PICKUP_PHONE || "02163844837",
  pickupName: process.env.BANABI_PICKUP_NAME || "İkizler Baharatçılık",
  cutoffHour: 17,
  standardShippingFee: 199,
}

// Ayarları veritabanından (admin paneli) veya ortam değişkenlerinden dinamik olarak yükler
export async function getBanabiConfig(): Promise<BanabiConfig> {
  const config = { ...DEFAULT_CONFIG }

  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: [
            "banabi_api_token",
            "banabi_api_base_url",
            "banabi_pickup_address",
            "banabi_pickup_phone",
            "banabi_pickup_name",
            "banabi_cutoff_hour",
            "standard_shipping_fee",
          ],
        },
      },
    })

    const map = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)

    if (map["banabi_api_token"]?.trim()) config.apiToken = map["banabi_api_token"].trim()
    if (map["banabi_api_base_url"]?.trim()) config.baseUrl = map["banabi_api_base_url"].trim()
    if (map["banabi_pickup_address"]?.trim()) config.pickupAddress = map["banabi_pickup_address"].trim()
    if (map["banabi_pickup_phone"]?.trim()) config.pickupPhone = map["banabi_pickup_phone"].trim()
    if (map["banabi_pickup_name"]?.trim()) config.pickupName = map["banabi_pickup_name"].trim()
    if (map["banabi_cutoff_hour"]) {
      const parsed = parseInt(map["banabi_cutoff_hour"], 10)
      if (!isNaN(parsed) && parsed > 0 && parsed <= 24) config.cutoffHour = parsed
    }
    if (map["standard_shipping_fee"]) {
      const parsedFee = parseFloat(map["standard_shipping_fee"])
      if (!isNaN(parsedFee) && parsedFee >= 0) config.standardShippingFee = parsedFee
    }
  } catch (err) {
    console.warn("Banabikurye DB settings read error, using env/defaults:", err)
  }

  return config
}

// Türkiye saatine göre (Europe/Istanbul) 17:00 son sipariş saati kontrolü
export function isSameDayDeliveryAvailable(cutoffHour: number = 17): {
  available: boolean
  currentHour: number
  currentMinute: number
  reason?: string
} {
  try {
    const now = new Date()
    const trTimeString = now.toLocaleString("en-US", { timeZone: "Europe/Istanbul", hour12: false })
    const trDate = new Date(trTimeString)
    const currentHour = trDate.getHours()
    const currentMinute = trDate.getMinutes()

    // Saat 17:00 ve sonrası için aynı gün kurye hizmeti kapatılır
    if (currentHour >= cutoffHour) {
      return {
        available: false,
        currentHour,
        currentMinute,
        reason: `Bugün için sipariş saati sona erdi (${cutoffHour}:00'a kadar verilen siparişler aynı gün teslim edilir).`,
      }
    }

    return {
      available: true,
      currentHour,
      currentMinute,
    }
  } catch (err) {
    console.error("Timezone calculation error:", err)
    return { available: true, currentHour: 12, currentMinute: 0 }
  }
}

// Telefon numarasını Banabikurye API standardına (+905xxxxxxxxx) dönüştürür
export function formatBanabiPhone(phone: string): string {
  if (!phone) return "+902163844837"
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("90") && digits.length === 12) return `+${digits}`
  if (digits.startsWith("0") && digits.length === 11) return `+9${digits}`
  if (digits.length === 10) return `+90${digits}`
  return digits.startsWith("+") ? digits : `+${digits}`
}

export interface CalculateOrderParams {
  deliveryAddress: string
  deliveryCity?: string
  deliveryDistrict?: string
  weightKg?: number
  matter?: string
}

export interface CalculateOrderResult {
  success: boolean
  available: boolean
  price?: number
  currency?: string
  deliveryFeeAmount?: number
  isAfterCutoff?: boolean
  warnings?: string[]
  error?: string
}

// 1. Fiyat Hesaplama API Çağrısı (POST /calculate-order)
export async function calculateBanabiOrder(params: CalculateOrderParams): Promise<CalculateOrderResult> {
  const config = await getBanabiConfig()

  // 1. Zaman kontrolü (17:00 sınırı)
  const timeCheck = isSameDayDeliveryAvailable(config.cutoffHour)
  if (!timeCheck.available) {
    return {
      success: false,
      available: false,
      isAfterCutoff: true,
      error: timeCheck.reason || "Bugün için sipariş saati sona erdi.",
    }
  }

  // 2. Adres kontrolü
  const rawAddress = params.deliveryAddress?.trim() || ""
  if (!rawAddress || rawAddress.length < 8) {
    return {
      success: false,
      available: false,
      error: "Lütfen geçerli ve detaylı bir teslimat adresi giriniz.",
    }
  }

  // 3. Şehir kontrolü (Banabikurye motosikletli kurye şu anda yalnızca İstanbul genelindedir)
  const fullAddress = `${rawAddress} ${params.deliveryDistrict ? params.deliveryDistrict + " " : ""}${params.deliveryCity || ""}`.trim()
  const isIstanbul = /istanbul|kadıköy|üsküdar|ümraniye|ataşehir|maltepe|kartal|pendik|tuzla|beykoz|çekmeköy|sancaktepe|şişli|beşiktaş|beyoğlu|fatih|bakırköy|bahçelievler|zeytinburnu|güngören|bağcılar|esenyurt|beylikdüzü|küçükçekmece|başakşehir|avcılar|sarıyer|eyüp|kağıthane|gaziosmanpaşa|sultangazi|arnavutköy|silivri|çatalca/i.test(
    fullAddress
  )

  if (!isIstanbul && params.deliveryCity && !params.deliveryCity.toLowerCase().includes("istanbul")) {
    return {
      success: false,
      available: false,
      error: "Aynı Gün Teslimat (Banabikurye) hizmetimiz şu anda yalnızca İstanbul içi siparişlerde geçerlidir.",
    }
  }

  // 4. API Token kontrolü (Henüz tanımlanmadıysa anlaşılır şekilde bilgi ver)
  if (!config.apiToken) {
    console.warn("Banabikurye API Token tanımlı değil (BANABI_API_TOKEN veya admin panelinden girilmelidir).")
    return {
      success: false,
      available: false,
      error: "Aynı Gün Teslimat hizmeti şu anda teknik hazırlık aşamasındadır. Lütfen Standart Kargo'yu tercih ediniz.",
    }
  }

  try {
    const payload = {
      type: "standard",
      matter: params.matter || "Baharat ve Doğal Gıda Ürünleri",
      total_weight_kg: Math.max(1, Math.round(params.weightKg || 1)),
      vehicle_type_id: 8, // Motosiklet (standart moto kurye)
      points: [
        {
          address: config.pickupAddress,
        },
        {
          address: fullAddress,
        },
      ],
    }

    const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/calculate-order`
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-DV-Auth-Token": config.apiToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (res.ok && data.is_successful && data.order) {
      const paymentAmount = parseFloat(data.order.payment_amount || data.order.delivery_fee_amount || "0")

      if (paymentAmount > 0) {
        return {
          success: true,
          available: true,
          price: paymentAmount,
          deliveryFeeAmount: paymentAmount,
          currency: "TL",
          warnings: data.parameter_warnings || [],
        }
      }
    }

    // Hata detayını ayrıştır
    const errorMsg =
      data.errors?.join(", ") ||
      (data.parameter_warnings ? JSON.stringify(data.parameter_warnings) : null) ||
      "Belirtilen adres Banabikurye kurye teslimat bölgesi dışında kalmaktadır."

    return {
      success: false,
      available: false,
      error: errorMsg.includes("address")
        ? "Girilen adres kurye haritasında doğrulanamadı. Lütfen ilçe ve mahalle bilgisini açıkça belirtiniz."
        : "Bu adres için Aynı Gün Kurye hizmeti sağlanamamaktadır. Standart Kargo önerilir.",
    }
  } catch (err: any) {
    console.error("Banabikurye calculate-order exception:", err)
    return {
      success: false,
      available: false,
      error: "Kurye servisine geçici olarak ulaşılamıyor. Lütfen Standart Kargo ile devam ediniz.",
    }
  }
}

export interface CreateOrderParams {
  orderId: string
  orderNumber: string
  deliveryAddress: string
  recipientName: string
  recipientPhone: string
  matter?: string
  weightKg?: number
  note?: string
}

export interface CreateOrderResult {
  success: boolean
  banabiOrderId?: string | number
  trackingUrl?: string
  status?: string
  price?: number
  error?: string
  rawOrder?: any
}

// 2. Kurye Siparişi Oluşturma API Çağrısı (POST /create-order)
// iyzico ödemesi onaylandıktan sonra çağrılır
export async function createBanabiOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  const config = await getBanabiConfig()

  if (!config.apiToken) {
    return {
      success: false,
      error: "Banabikurye API Token bulunamadı. Kurye çağrısı için admin panelinden token tanımlanmalıdır.",
    }
  }

  try {
    const payload = {
      type: "standard",
      matter: params.matter || "Baharat ve Doğal Gıda Ürünleri",
      total_weight_kg: Math.max(1, Math.round(params.weightKg || 1)),
      vehicle_type_id: 8, // Motosiklet
      client_order_id: params.orderNumber,
      points: [
        {
          address: config.pickupAddress,
          contact_person: {
            name: config.pickupName,
            phone: formatBanabiPhone(config.pickupPhone),
          },
          comment: `Sipariş #${params.orderNumber} mağazadan teslim alınacak.`,
        },
        {
          address: params.deliveryAddress,
          contact_person: {
            name: params.recipientName,
            phone: formatBanabiPhone(params.recipientPhone),
          },
          comment: params.note || `İkizler Baharatçılık Siparişi #${params.orderNumber}`,
        },
      ],
    }

    const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/create-order`
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-DV-Auth-Token": config.apiToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (res.ok && data.is_successful && data.order) {
      return {
        success: true,
        banabiOrderId: data.order.order_id,
        trackingUrl: data.order.tracking_url || "",
        status: data.order.status || "created",
        price: parseFloat(data.order.payment_amount || "0"),
        rawOrder: data.order,
      }
    } else {
      const errorMsg = data.errors?.join(", ") || "Banabikurye siparişi oluşturulamadı."
      console.error("Banabikurye create-order API error:", data)
      return {
        success: false,
        error: errorMsg,
      }
    }
  } catch (err: any) {
    console.error("Banabikurye create-order exception:", err)
    return {
      success: false,
      error: err.message || "Kurye servisi bağlantı hatası",
    }
  }
}

// 3. Sipariş Durumu Sorgulama (GET /order)
export async function getBanabiOrderStatus(banabiOrderId: string | number): Promise<any> {
  const config = await getBanabiConfig()
  if (!config.apiToken || !banabiOrderId) return null

  try {
    const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/order?order_id=${encodeURIComponent(banabiOrderId)}`
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "X-DV-Auth-Token": config.apiToken,
      },
      next: { revalidate: 0 },
    })

    const data = await res.json()
    if (res.ok && data.is_successful && data.order) {
      return data.order
    }
    return null
  } catch (err) {
    console.error("Banabikurye status check error:", err)
    return null
  }
}
