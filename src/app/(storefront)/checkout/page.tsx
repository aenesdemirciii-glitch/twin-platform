"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/useCartStore"
import { ShieldCheck, CreditCard, ArrowLeft, CheckCircle2, Lock, AlertCircle, Loader2, Truck, Zap, Clock, MapPin } from "lucide-react"

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Teslimat Yöntemi: "standard" | "banabikurye"
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "banabikurye">("standard")
  const [standardFee] = useState<number>(199.00)
  
  // Banabikurye State
  const [banabiFee, setBanabiFee] = useState<number | null>(null)
  const [isCalculatingBanabi, setIsCalculatingBanabi] = useState(false)
  const [banabiError, setBanabiError] = useState<string | null>(null)
  const [isAfterCutoff, setIsAfterCutoff] = useState(false)

  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState<{ code: string; amount: number } | null>(null)
  const [iyzicoHtml, setIyzicoHtml] = useState<string | null>(null)

  // Müşteri İletişim ve Teslimat Form Verileri
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "İstanbul",
    district: "",
    address: "",
    identityNumber: "11111111111",
    orderNotes: ""
  })

  // Saat 17:00 Kontrolü (İstemci tarafı ilk kontrol)
  useEffect(() => {
    setMounted(true)
    try {
      const trTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul", hour12: false })
      const hour = new Date(trTime).getHours()
      if (hour >= 17) {
        setIsAfterCutoff(true)
      }
    } catch (e) {
      // fallback
    }
  }, [])

  // Aktif Kargo Ücreti
  const activeShippingFee = deliveryMethod === "banabikurye" 
    ? (banabiFee !== null ? banabiFee : standardFee) 
    : standardFee

  const subtotal = getTotal()
  const discountAmount = discountApplied ? discountApplied.amount : 0
  const totalAmount = Math.max(0, subtotal - discountAmount) + (items.length > 0 ? activeShippingFee : 0)

  // Banabikurye Fiyat Hesaplama İstek Fonksiyonu
  const calculateBanabiPrice = useCallback(async (addressText: string, districtText: string, cityText: string) => {
    if (!addressText || addressText.trim().length < 8) {
      setBanabiFee(null)
      setBanabiError("Fiyat için teslimat adresinizi giriniz.")
      return
    }

    setIsCalculatingBanabi(true)
    setBanabiError(null)

    try {
      const res = await fetch("/api/delivery/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryMethod: "banabikurye",
          address: addressText.trim(),
          district: districtText.trim(),
          city: cityText.trim(),
          items: items.map(i => ({ id: i.id, quantity: i.quantity }))
        })
      })

      const data = await res.json()

      if (data.success && typeof data.price === "number") {
        setBanabiFee(data.price)
        setBanabiError(null)
      } else {
        setBanabiFee(null)
        setBanabiError(data.error || "Aynı Gün Teslimat bu adres için sağlanamıyor.")
        if (data.isAfterCutoff) {
          setIsAfterCutoff(true)
        }
      }
    } catch (err) {
      setBanabiFee(null)
      setBanabiError("Fiyat hesaplama servisine ulaşılamadı.")
    } finally {
      setIsCalculatingBanabi(false)
    }
  }, [items])

  // Adres veya İlçe değiştikçe Banabikurye fiyatını debounce ile yeniden hesapla
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedForm = { ...formData, [name]: value }
    setFormData(updatedForm)

    // Eğer adres alanları değişiyorsa ve kurye seçiliyse veya seçilebilir durumdaysa fiyatı sıfırla ve yeniden hesapla
    if (name === "address" || name === "district" || name === "city") {
      setBanabiFee(null)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

      if (deliveryMethod === "banabikurye" && !isAfterCutoff) {
        debounceTimerRef.current = setTimeout(() => {
          calculateBanabiPrice(updatedForm.address, updatedForm.district, updatedForm.city)
        }, 800)
      }
    }
  }

  // Teslimat yöntemi değiştirildiğinde
  const handleSelectDeliveryMethod = (method: "standard" | "banabikurye") => {
    setDeliveryMethod(method)
    setErrorMessage(null)

    if (method === "banabikurye") {
      if (isAfterCutoff) {
        setErrorMessage("Bugün için Aynı Gün Teslimat sipariş saati (17:00) sona ermiştir. Standart kargo ile devam edebilirsiniz.")
        setDeliveryMethod("standard")
        return
      }
      if (banabiFee === null) {
        calculateBanabiPrice(formData.address, formData.district, formData.city)
      }
    }
  }

  const applyDiscount = async () => {
    if (!discountCode.trim()) return
    alert("Kupon sistemi şu anda güncelleniyor.")
  }

  // Ödemeyi Başlat
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("Lütfen ad ve soyadınızı giriniz.")
      return
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Lütfen geçerli bir e-posta adresi giriniz.")
      return
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage("Lütfen geçerli bir cep telefonu numarası giriniz.")
      return
    }
    if (!formData.address.trim()) {
      setErrorMessage("Lütfen teslimat adresinizi eksiksiz giriniz.")
      return
    }

    // Aynı gün teslimat seçilmişse geçerli bir kurye fiyatı olmalı
    if (deliveryMethod === "banabikurye") {
      if (isAfterCutoff) {
        setErrorMessage("Aynı Gün Teslimat için saat 17:00 sınırı aşılmıştır. Lütfen Standart Kargo seçeneğini kullanınız.")
        setDeliveryMethod("standard")
        return
      }
      if (banabiFee === null || isCalculatingBanabi) {
        setErrorMessage("Aynı Gün Teslimat için kurye fiyatı henüz doğrulanamadı. Lütfen adresinizi kontrol ediniz veya Standart Kargo'yu seçiniz.")
        return
      }
    }

    setIsProcessing(true)

    try {
      const fullAddress = `${formData.address.trim()} ${formData.district ? formData.district + ' / ' : ''}${formData.city}`.trim()

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            variantId: (i as any).variantId || null
          })),
          shippingAddress: fullAddress,
          billingAddress: fullAddress,
          deliveryMethod: deliveryMethod,
          clientShippingFee: activeShippingFee,
          orderNotes: formData.orderNotes,
          buyer: {
            name: formData.firstName.trim(),
            surname: formData.lastName.trim(),
            email: formData.email.trim(),
            gsmNumber: formData.phone.trim(),
            city: formData.city.trim(),
            district: formData.district.trim(),
            identityNumber: formData.identityNumber.trim() || "11111111111"
          },
          discountCode: discountApplied ? discountApplied.code : null
        })
      })

      const data = await res.json()

      if (data.priceUpdated && typeof data.newShippingFee === "number") {
        setBanabiFee(data.newShippingFee)
        setErrorMessage(data.error || "Kurye teslimat ücreti güncellendi. Lütfen yeni tutarı kontrol edip tekrar 'Güvenli Öde'ye basınız.")
        setIsProcessing(false)
        return
      }

      if (data.success && data.checkoutFormContent) {
        setIyzicoHtml(data.checkoutFormContent)
      } else {
        setErrorMessage(data.error || "Ödeme sistemi başlatılamadı. Lütfen bilgilerinizi kontrol ediniz.")
        setIsProcessing(false)
      }
    } catch (error: any) {
      console.error("Payment init error:", error)
      setErrorMessage("Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.")
      setIsProcessing(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  // İyzico Formu Hazır Olduğunda Güvenli Ödeme İframe'ini Göster
  if (iyzicoHtml) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              setIyzicoHtml(null)
              setIsProcessing(false)
            }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Bilgileri Düzenle
          </button>
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Korumalı Güvenli Ödeme
          </div>
        </div>

        <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="mb-4 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Güvenli Kart Ödemesi</h2>
              <p className="text-xs text-slate-500 mt-0.5">İyzico 3D Secure onay ekranı</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Ödenecek Toplam Tutar</span>
              <p className="text-xl font-black text-amber-600">{totalAmount.toLocaleString("tr-TR")} TL</p>
            </div>
          </div>

          <div
            id="iyzipay-checkout-form"
            className="w-full responsive min-h-[450px]"
            dangerouslySetInnerHTML={{ __html: iyzicoHtml }}
          />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Ödeme Yap</h1>
          <p className="text-slate-500 mb-8">Sepetinizde ürün bulunmuyor.</p>
          <Link href="/" className="inline-block bg-amber-500 text-slate-950 font-bold py-3 px-8 rounded-xl hover:bg-amber-400 transition-colors">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        <div className="mb-8 flex items-center justify-between">
          <Link href="/sepet" className="flex items-center gap-2 text-slate-700 font-bold hover:text-amber-600 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Sepete Dön
          </Link>
          <div className="flex items-center gap-2 text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL ve 3D Secure Güvenli Altyapı</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sol Kolon: Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
              
              {/* 1. İletişim Bilgileri */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</span> 
                  İletişim Bilgileri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Adınız *</label>
                    <input 
                      required 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Örn: Ahmet"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Soyadınız *</label>
                    <input 
                      required 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Örn: Yılmaz"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">E-Posta Adresi *</label>
                    <input 
                      required 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="siparis@ornek.com (Sipariş ve kargo bilgisi buraya iletilir)"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Cep Telefonu *</label>
                    <input 
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="05XX XXX XX XX (Kargo SMS bildirimi için)"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                </div>
              </div>

              {/* 2. Teslimat Adresi */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</span> 
                  Teslimat & Fatura Adresi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">İl *</label>
                    <input 
                      required 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="İstanbul, Ankara, İzmir..."
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">İlçe</label>
                    <input 
                      type="text" 
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Kadıköy, Üsküdar vb."
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Açık Adres (Mahalle, Cadde, Sokak, Kapı No) *</label>
                    <textarea 
                      required 
                      rows={3} 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Açık adresinizi eksiksiz yazınız. Kurye ve kargo teslimatı bu adrese yapılacaktır."
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Sipariş Notu (Opsiyonel)</label>
                    <input 
                      type="text" 
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Kurye için zil bilgisi, özel teslimat talebi vb."
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900" 
                    />
                  </div>
                </div>
              </div>

              {/* 3. TESLİMAT SEÇENEKLERİ (Standart Kargo & Aynı Gün Teslimat Banabikurye) */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</span> 
                    Teslimat Yöntemi
                  </h2>
                  <span className="text-xs font-medium text-slate-500">2 teslimat seçeneği</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SEÇENEK 1: STANDART KARGO (Sabit 199 TL) */}
                  <label 
                    onClick={() => handleSelectDeliveryMethod("standard")}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      deliveryMethod === "standard" 
                        ? "border-amber-500 bg-amber-50/30 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="radio" 
                            name="deliveryMethodRadio" 
                            checked={deliveryMethod === "standard"} 
                            onChange={() => handleSelectDeliveryMethod("standard")}
                            className="w-4 h-4 accent-amber-500" 
                          />
                          <span className="font-extrabold text-slate-900 text-base">Standart Kargo</span>
                        </div>
                        <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                          Tüm Türkiye
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>3-5 iş günü içerisinde adrese teslimat</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Sabit Kargo Ücreti:</span>
                      <span className="text-base font-black text-slate-900">199,00 TL</span>
                    </div>
                  </label>

                  {/* SEÇENEK 2: AYNI GÜN TESLİMAT (Banabikurye) */}
                  <label 
                    onClick={() => !isAfterCutoff && handleSelectDeliveryMethod("banabikurye")}
                    className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isAfterCutoff 
                        ? "border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed" 
                        : deliveryMethod === "banabikurye" 
                        ? "border-amber-500 bg-amber-50/30 shadow-sm cursor-pointer" 
                        : "border-slate-200 bg-white hover:border-slate-300 cursor-pointer"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="radio" 
                            name="deliveryMethodRadio" 
                            disabled={isAfterCutoff}
                            checked={deliveryMethod === "banabikurye"} 
                            onChange={() => !isAfterCutoff && handleSelectDeliveryMethod("banabikurye")}
                            className="w-4 h-4 accent-amber-500 disabled:opacity-40" 
                          />
                          <span className="font-extrabold text-slate-900 text-base flex items-center gap-1">
                            Aynı Gün Teslimat
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600 fill-amber-500" /> Banabikurye
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-2 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>Banabikurye ile hızlı teslimat (Saat 17:00'ye kadar)</span>
                      </p>

                      {/* Uyarılar & Durum Mesajları */}
                      {isAfterCutoff ? (
                        <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2 my-2">
                          Bugün için sipariş saati sona erdi (17:00).
                        </div>
                      ) : banabiError && deliveryMethod === "banabikurye" ? (
                        <div className="text-[11px] font-semibold text-amber-800 bg-amber-100/60 border border-amber-200 rounded-lg p-2 my-2 flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700 mt-0.5 flex-shrink-0" />
                          <span>{banabiError}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Kurye Ücreti:</span>
                      <div>
                        {isAfterCutoff ? (
                          <span className="text-xs font-bold text-slate-400">Kapalı</span>
                        ) : isCalculatingBanabi ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Hesaplanıyor...
                          </span>
                        ) : banabiFee !== null ? (
                          <span className="text-base font-black text-amber-600">{banabiFee.toFixed(2)} TL</span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500">Adresle Hesaplanır</span>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Ödeme Yöntemi Bilgilendirmesi */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span> 
                  Ödeme Yöntemi
                </h2>
                
                <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-slate-900 text-sm">Kredi Kartı / Banka Kartı ile Güvenli Ödeme</span>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 tracking-tight">iyzi<span className="text-slate-800">co</span></span>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Aşağıdaki <strong>"iyzico ile Güvenli Öde"</strong> butonuna tıkladığınızda, bankanızın 256-bit SSL korumalı ve 3D Secure onaylı resmi iyzico ödeme formu açılacaktır. Kart bilgileriniz sunucularımızda asla saklanmaz.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 pt-2 border-t border-blue-100">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Bonus</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Maximum</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">World</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Axess</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">CardFinans</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Paraf</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Troy / Visa / MC</span>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Sağ Kolon: Sipariş Özeti */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">GÖRSEL</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">Adet: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-xs text-slate-900">
                      {Number(item.price * item.quantity).toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-t border-b border-slate-100 mb-6">
                
                {/* İndirim Kodu Alanı */}
                {!discountApplied ? (
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="İndirim Kodu" 
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-900 uppercase" 
                    />
                    <button 
                      type="button" 
                      onClick={applyDiscount}
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      Uygula
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg mb-2">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs">{discountApplied.code}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setDiscountApplied(null); setDiscountCode(""); }}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      İptal
                    </button>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium text-xs mt-3">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                
                {discountApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold text-xs">
                    <span>İndirim ({discountApplied.code})</span>
                    <span>-{discountApplied.amount.toLocaleString('tr-TR')} TL</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium text-xs">
                  <span>
                    {deliveryMethod === "banabikurye" ? "Aynı Gün Teslimat (Banabikurye)" : "Standart Kargo"}
                  </span>
                  <span className="font-bold text-slate-900">
                    {deliveryMethod === "banabikurye" && isCalculatingBanabi ? (
                      "Hesaplanıyor..."
                    ) : (
                      `${activeShippingFee.toLocaleString('tr-TR')} TL`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-slate-900">Genel Toplam</span>
                <span className="text-2xl font-black text-amber-600">{totalAmount.toLocaleString('tr-TR')} TL</span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing || (deliveryMethod === "banabikurye" && (banabiFee === null || isCalculatingBanabi))}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-200 flex justify-center items-center gap-2 text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Ödeme Sistemi Başlatılıyor...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>iyzico ile Güvenli Öde</span>
                  </>
                )}
              </button>
              
              <p className="text-[11px] text-center text-slate-400 mt-4 leading-relaxed">
                Ödeme tuşuna basarak, <strong>Mesafeli Satış Sözleşmesi</strong>'ni ve <strong>Ön Bilgilendirme Formu</strong>'nu onaylamış olursunuz.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
