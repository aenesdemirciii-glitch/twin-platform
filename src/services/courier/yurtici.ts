import prisma from "@/lib/prisma"

export interface YurticiConfig {
  username: string
  password: string
  customerCode: string
  orgGeoCode: string
  endpointUrl: string
  testMode: boolean
}

// Varsayılan İkizler Baharatçılık Yurtiçi Kargo Parametreleri
const DEFAULT_CONFIG: YurticiConfig = {
  username: process.env.YURTICI_USERNAME || "",
  password: process.env.YURTICI_PASSWORD || "",
  customerCode: process.env.YURTICI_CUSTOMER_CODE || "775089207",
  orgGeoCode: process.env.YURTICI_ORG_GEO_CODE || "9081", // Kozyatağı Birimi
  endpointUrl: process.env.YURTICI_ENDPOINT_URL || "https://ws.yurticikargo.com/KOPSWebServices/ShippingOrderDispatcherServices",
  testMode: process.env.YURTICI_TEST_MODE === "true",
}

// Ayarları veritabanından (admin paneli) veya ortam değişkenlerinden dinamik olarak yükler
export async function getYurticiConfig(): Promise<YurticiConfig> {
  const config = { ...DEFAULT_CONFIG }

  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: [
            "yurtici_username",
            "yurtici_password",
            "yurtici_customer_code",
            "yurtici_org_geo_code",
            "yurtici_endpoint_url",
            "yurtici_test_mode",
          ],
        },
      },
    })

    const map = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)

    if (map["yurtici_username"]?.trim()) config.username = map["yurtici_username"].trim()
    if (map["yurtici_password"]?.trim()) config.password = map["yurtici_password"].trim()
    if (map["yurtici_customer_code"]?.trim()) config.customerCode = map["yurtici_customer_code"].trim()
    if (map["yurtici_org_geo_code"]?.trim()) config.orgGeoCode = map["yurtici_org_geo_code"].trim()
    if (map["yurtici_endpoint_url"]?.trim()) config.endpointUrl = map["yurtici_endpoint_url"].trim()
    if (map["yurtici_test_mode"] !== undefined) {
      config.testMode = map["yurtici_test_mode"] === "true" || map["yurtici_test_mode"] === "1"
    }
  } catch (err) {
    console.warn("Yurtici Kargo DB settings read error, using env/defaults:", err)
  }

  return config
}

// XML karakter kaçırma
function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return ""
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// Basit ve güvenilir XML tag çıkarma yardımcısı
function extractXmlTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<(?:[a-zA-Z0-9_]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${tag}>`, "i")
  const match = regex.exec(xml)
  return match ? match[1].trim() : null
}

function extractAllXmlTags(xml: string, tag: string): string[] {
  const regex = new RegExp(`<(?:[a-zA-Z0-9_]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${tag}>`, "gi")
  const results: string[] = []
  let match
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim())
  }
  return results
}

export interface YurticiCreateShipmentInput {
  orderId: string
  orderNumber: string
  cargoKey: string // Gönderi Referans Kodu
  receiverName: string
  receiverAddress: string
  cityName: string
  townName: string
  receiverPhone: string
  emailAddress?: string
  taxNumber?: string
  desi?: number
  kg?: number
  cargoCount?: number
  paymentType?: "SENDER" | "RECEIVER" // SENDER = Gönderici Ödemeli, RECEIVER = Alıcı Ödemeli
  description?: string
}

export interface YurticiCreateShipmentResult {
  success: boolean
  cargoKey: string
  jobId?: string
  outFlag?: string
  outResult?: string
  errorCode?: number | string
  errorMessage?: string
  rawResponse?: string
  isSimulated?: boolean
}

export interface YurticiQueryShipmentResult {
  success: boolean
  cargoKey: string
  trackingNumber?: string
  trackingUrl?: string
  jobId?: string
  operationCode?: number | string
  operationStatus?: string
  operationMessage?: string
  cargoEvent?: string
  deliveryDate?: string
  departureUnit?: string
  arrivalUnit?: string
  rawResponse?: string
  isSimulated?: boolean
  error?: string
}

export interface YurticiCancelShipmentResult {
  success: boolean
  cargoKey: string
  outFlag?: string
  outResult?: string
  errorCode?: number | string
  errorMessage?: string
  rawResponse?: string
  isSimulated?: boolean
}

// 1. GÖNDERİ OLUŞTURMA (createShipment)
export async function createYurticiShipment(
  input: YurticiCreateShipmentInput,
  overrideConfig?: Partial<YurticiConfig>
): Promise<YurticiCreateShipmentResult> {
  const config = { ...(await getYurticiConfig()), ...overrideConfig }

  // Telefon numarasını temizle (10 haneli rakam formatına getir)
  const cleanPhone = (input.receiverPhone || "").replace(/\D/g, "")
  const formattedPhone = cleanPhone.startsWith("90") && cleanPhone.length === 12
    ? cleanPhone.slice(2)
    : cleanPhone.startsWith("0") && cleanPhone.length === 11
    ? cleanPhone.slice(1)
    : cleanPhone

  // Ödeme tipi: Gönderici ödemeli (0), Alıcı ödemeli (1)
  // Yurtiçi Kargo KOPS servisinde: dcSelectedCredit: 0 = Gönderici Ödemeli (Cari Hesap)
  const dcSelectedCredit = input.paymentType === "RECEIVER" ? 1 : 0

  // Canlı API kullanıcı adı / şifre girilmemişse veya test modunda ise güvenli test simülasyonu
  if (!config.username || !config.password || config.testMode) {
    console.log(`[Yurtiçi Kargo Test Modu] Gönderi oluşturuluyor: #${input.orderNumber} (cargoKey: ${input.cargoKey})`)
    return {
      success: true,
      cargoKey: input.cargoKey,
      jobId: `SIM-JOB-${Date.now()}`,
      outFlag: "0",
      outResult: "Test Modu: Gönderi kaydı başarıyla oluşturuldu. Yurtiçi Kargo şubesi referans kodunu kabul edebilir.",
      rawResponse: JSON.stringify({
        mode: "TEST_SIMULATION",
        customerCode: config.customerCode,
        orgGeoCode: config.orgGeoCode,
        cargoKey: input.cargoKey,
        receiver: input.receiverName,
        phone: formattedPhone,
        address: input.receiverAddress,
        city: input.cityName,
        town: input.townName,
        paymentType: input.paymentType || "SENDER",
      }),
      isSimulated: true,
    }
  }

  // SOAP XML Zarfı (WSDL ShippingOrderDispatcherServices tanımına birebir uygun)
  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
  <soapenv:Header/>
  <soapenv:Body>
    <ship:createShipment>
      <wsUserName>${escapeXml(config.username)}</wsUserName>
      <wsPassword>${escapeXml(config.password)}</wsPassword>
      <userLanguage>TR</userLanguage>
      <ShippingOrderVO>
        <cargoKey>${escapeXml(input.cargoKey)}</cargoKey>
        <invoiceKey>${escapeXml(input.orderNumber)}</invoiceKey>
        <receiverCustName>${escapeXml(input.receiverName)}</receiverCustName>
        <receiverAddress>${escapeXml(input.receiverAddress)}</receiverAddress>
        <cityName>${escapeXml(input.cityName)}</cityName>
        <townName>${escapeXml(input.townName)}</townName>
        <receiverPhone1>${escapeXml(formattedPhone)}</receiverPhone1>
        <emailAddress>${escapeXml(input.emailAddress || "")}</emailAddress>
        <taxOfficeId>0</taxOfficeId>
        <taxNumber>${escapeXml(input.taxNumber || "")}</taxNumber>
        <desi>${Number(input.desi || 1).toFixed(2)}</desi>
        <kg>${Number(input.kg || 1).toFixed(2)}</kg>
        <cargoCount>${Math.max(1, input.cargoCount || 1)}</cargoCount>
        <ttInvoiceAmount>0</ttInvoiceAmount>
        <ttDocumentId>0</ttDocumentId>
        <ttCollectionType></ttCollectionType>
        <ttDocumentSaveType></ttDocumentSaveType>
        <dcSelectedCredit>${dcSelectedCredit}</dcSelectedCredit>
        <dcCreditRule>0</dcCreditRule>
        <description>${escapeXml(input.description || `İkizler Baharatçılık Siparişi #${input.orderNumber}`)}</description>
        <orgGeoCode>${escapeXml(config.orgGeoCode)}</orgGeoCode>
        <custProdId>${escapeXml(config.customerCode)}</custProdId>
      </ShippingOrderVO>
    </ship:createShipment>
  </soapenv:Body>
</soapenv:Envelope>`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const response = await fetch(config.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: "createShipment",
      },
      body: soapEnvelope,
      signal: controller.signal,
    })

    clearTimeout(timeout)
    const xmlText = await response.text()

    // Hata veya Başarı Çıkarımı
    const outFlag = extractXmlTag(xmlText, "outFlag")
    const outResult = extractXmlTag(xmlText, "outResult")
    const jobId = extractXmlTag(xmlText, "jobId")
    const errCode = extractXmlTag(xmlText, "errCode")
    const errMessage = extractXmlTag(xmlText, "errMessage")
    const returnedCargoKey = extractXmlTag(xmlText, "cargoKey") || input.cargoKey

    // outFlag "0" başarılı demektir
    const isSuccess = outFlag === "0" && (!errCode || errCode === "0")

    return {
      success: isSuccess,
      cargoKey: returnedCargoKey,
      jobId: jobId || undefined,
      outFlag: outFlag || undefined,
      outResult: outResult || undefined,
      errorCode: errCode || undefined,
      errorMessage: errMessage || (isSuccess ? undefined : outResult || "Yurtiçi Kargo gönderi oluşturulamadı."),
      rawResponse: xmlText,
      isSimulated: false,
    }
  } catch (error: any) {
    console.error("Yurtiçi Kargo SOAP createShipment network error:", error)
    return {
      success: false,
      cargoKey: input.cargoKey,
      errorMessage: error.name === "AbortError" 
        ? "Yurtiçi Kargo servisi zaman aşımına uğradı (12 saniye)." 
        : `Yurtiçi Kargo bağlantı hatası (IP yetkilendirmesi veya ağ erişimi kontrol edilmeli): ${error.message || String(error)}`,
      rawResponse: String(error),
      isSimulated: false,
    }
  }
}

// 2. GÖNDERİ DURUMUNU SORGULA (queryShipment)
export async function queryYurticiShipment(
  cargoKey: string,
  overrideConfig?: Partial<YurticiConfig>
): Promise<YurticiQueryShipmentResult> {
  const config = { ...(await getYurticiConfig()), ...overrideConfig }

  // Test modu veya kimlik bilgisi yoksa simüle durum döndür
  if (!config.username || !config.password || config.testMode) {
    return {
      success: true,
      cargoKey,
      trackingNumber: `YK-${cargoKey}`,
      trackingUrl: `https://yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(cargoKey)}`,
      jobId: "SIM-QUERY-1",
      operationCode: 1,
      operationStatus: "PROCESSING",
      operationMessage: "Gönderi kaydı mevcut. Şube kabulü bekleniyor.",
      cargoEvent: "Sipariş Kaydı Alındı / Hazırlanıyor",
      departureUnit: "Kozyatağı (9081)",
      arrivalUnit: "Teslimat Şubesi",
      isSimulated: true,
    }
  }

  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
  <soapenv:Header/>
  <soapenv:Body>
    <ship:queryShipment>
      <wsUserName>${escapeXml(config.username)}</wsUserName>
      <wsPassword>${escapeXml(config.password)}</wsPassword>
      <wsLanguage>TR</wsLanguage>
      <keys>${escapeXml(cargoKey)}</keys>
      <keyType>0</keyType>
      <addHistoricalData>true</addHistoricalData>
      <onlyTracking>false</onlyTracking>
    </ship:queryShipment>
  </soapenv:Body>
</soapenv:Envelope>`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const response = await fetch(config.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: "queryShipment",
      },
      body: soapEnvelope,
      signal: controller.signal,
    })

    clearTimeout(timeout)
    const xmlText = await response.text()

    const outFlag = extractXmlTag(xmlText, "outFlag")
    const outResult = extractXmlTag(xmlText, "outResult")
    const errCode = extractXmlTag(xmlText, "errCode")
    const errMessage = extractXmlTag(xmlText, "errMessage")
    const jobId = extractXmlTag(xmlText, "jobId")
    const operationCode = extractXmlTag(xmlText, "operationCode")
    const operationStatus = extractXmlTag(xmlText, "operationStatus")
    const operationMessage = extractXmlTag(xmlText, "operationMessage")
    const trackingUrl = extractXmlTag(xmlText, "trackingUrl")
    const docNumber = extractXmlTag(xmlText, "docNumber") || extractXmlTag(xmlText, "documentDebitId")
    const cargoEvent = extractXmlTag(xmlText, "cargoEventExplanation") || extractXmlTag(xmlText, "documentEventExplanation")
    const deliveryDate = extractXmlTag(xmlText, "deliveryDate")
    const departureUnitName = extractXmlTag(xmlText, "departureUnitName")
    const arrivalUnitName = extractXmlTag(xmlText, "arrivalUnitName")

    const isSuccess = outFlag === "0" || (!errCode || errCode === "0")

    return {
      success: isSuccess,
      cargoKey,
      trackingNumber: docNumber || undefined,
      trackingUrl: trackingUrl || (docNumber ? `https://yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(docNumber)}` : undefined),
      jobId: jobId || undefined,
      operationCode: operationCode || undefined,
      operationStatus: operationStatus || undefined,
      operationMessage: operationMessage || outResult || undefined,
      cargoEvent: cargoEvent || undefined,
      deliveryDate: deliveryDate || undefined,
      departureUnit: departureUnitName || undefined,
      arrivalUnit: arrivalUnitName || undefined,
      rawResponse: xmlText,
      isSimulated: false,
      error: !isSuccess ? (errMessage || outResult || "Gönderi bilgisi sorgulanamadı.") : undefined,
    }
  } catch (error: any) {
    console.error("Yurtiçi Kargo queryShipment error:", error)
    return {
      success: false,
      cargoKey,
      error: `Yurtiçi Kargo sorgulama hatası: ${error.message || String(error)}`,
      rawResponse: String(error),
      isSimulated: false,
    }
  }
}

// 3. GÖNDERİ İPTAL (cancelShipment)
export async function cancelYurticiShipment(
  cargoKey: string,
  overrideConfig?: Partial<YurticiConfig>
): Promise<YurticiCancelShipmentResult> {
  const config = { ...(await getYurticiConfig()), ...overrideConfig }

  if (!config.username || !config.password || config.testMode) {
    return {
      success: true,
      cargoKey,
      outFlag: "0",
      outResult: "Test Modu: Gönderi iptal talebi başarıyla işlendi.",
      isSimulated: true,
    }
  }

  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
  <soapenv:Header/>
  <soapenv:Body>
    <ship:cancelShipment>
      <wsUserName>${escapeXml(config.username)}</wsUserName>
      <wsPassword>${escapeXml(config.password)}</wsPassword>
      <userLanguage>TR</userLanguage>
      <cargoKeys>${escapeXml(cargoKey)}</cargoKeys>
    </ship:cancelShipment>
  </soapenv:Body>
</soapenv:Envelope>`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const response = await fetch(config.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: "cancelShipment",
      },
      body: soapEnvelope,
      signal: controller.signal,
    })

    clearTimeout(timeout)
    const xmlText = await response.text()

    const outFlag = extractXmlTag(xmlText, "outFlag")
    const outResult = extractXmlTag(xmlText, "outResult")
    const errCode = extractXmlTag(xmlText, "errCode")
    const errMessage = extractXmlTag(xmlText, "errMessage")

    const isSuccess = outFlag === "0" && (!errCode || errCode === "0")

    return {
      success: isSuccess,
      cargoKey,
      outFlag: outFlag || undefined,
      outResult: outResult || undefined,
      errorCode: errCode || undefined,
      errorMessage: errMessage || (isSuccess ? undefined : outResult || "Gönderi iptal edilemedi."),
      rawResponse: xmlText,
      isSimulated: false,
    }
  } catch (error: any) {
    console.error("Yurtiçi Kargo cancelShipment error:", error)
    return {
      success: false,
      cargoKey,
      errorMessage: `Yurtiçi Kargo iptal hatası: ${error.message || String(error)}`,
      rawResponse: String(error),
      isSimulated: false,
    }
  }
}

