"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/useCartStore"
import { ShieldCheck, CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState<{ code: string; amount: number } | null>(null)

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = getTotal()
  let shippingCost = 0
  if (shippingMethod === "standard") {
    shippingCost = subtotal >= 3000 ? 0 : 249.00
  } else if (shippingMethod === "sameday-anadolu") {
    shippingCost = 199.00
  } else if (shippingMethod === "sameday-avrupa") {
    shippingCost = 299.00
  }

  const discountAmount = discountApplied ? discountApplied.amount : 0
  const totalAmount = Math.max(0, subtotal - discountAmount) + (items.length > 0 ? shippingCost : 0)

  const applyDiscount = () => {
    if (!discountCode.trim()) return
    // Mock discount logic: 10% off for any code
    const amount = subtotal * 0.10
    setDiscountApplied({ code: discountCode.toUpperCase(), amount })
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Mock iyzico payment processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
      clearCart()
    }, 2000)
  }

  if (!mounted) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Yükleniyor...</div>

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-brand-slate mb-4">Siparişiniz Alındı!</h1>
          <p className="text-slate-600 mb-8 font-medium leading-relaxed">
            Teşekkür ederiz. Ödemeniz iyzico güvencesiyle başarıyla tamamlandı. Sipariş numaranız <strong>#TWIN-{Math.floor(Math.random() * 900000) + 100000}</strong>. Detaylar e-posta adresinize gönderildi.
          </p>
          <Link href="/" className="inline-flex items-center justify-center w-full bg-brand-slate text-white font-bold py-4 rounded-xl hover:bg-brand-gold hover:text-brand-slate transition-colors text-lg">
            Alışverişe Dön
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-black text-brand-slate mb-4">Ödeme Yap</h1>
          <p className="text-slate-500 mb-8">Sepetinizde ürün bulunmuyor.</p>
          <Link href="/" className="inline-block bg-brand-slate text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-gold hover:text-brand-slate transition-colors">
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
          <Link href="/sepet" className="flex items-center gap-2 text-brand-slate font-bold hover:text-brand-gold transition-colors">
            <ArrowLeft className="w-5 h-5" /> Sepete Dön
          </Link>
          <div className="flex items-center gap-2 text-brand-slate opacity-60">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold">256-bit SSL Güvenli Ödeme</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
              
              {/* İletişim Bilgileri */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-brand-slate mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand-slate text-white flex items-center justify-center text-sm">1</span> 
                  İletişim Bilgileri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">Ad</label>
                    <input required type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-slate" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">Soyad</label>
                    <input required type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-slate" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600">E-Posta</label>
                    <input required type="email" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-slate" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600">Cep Telefonu</label>
                    <input required type="tel" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-slate" />
                  </div>
                </div>
              </div>

              {/* Teslimat Adresi */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-brand-slate mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand-slate text-white flex items-center justify-center text-sm">2</span> 
                  Teslimat & Fatura Adresi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">İl</label>
                    <input required type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-slate" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">İlçe</label>
                    <input required type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-slate" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600">Açık Adres</label>
                    <textarea required rows={3} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-slate" placeholder="Mahalle, sokak, no..."></textarea>
                  </div>
                  <div className="space-y-2 md:col-span-2 flex items-center gap-3 mt-2">
                    <input type="checkbox" id="same-address" defaultChecked className="w-5 h-5 accent-brand-gold" />
                    <label htmlFor="same-address" className="text-sm font-bold text-slate-600 cursor-pointer">Fatura adresim teslimat adresim ile aynı olsun</label>
                  </div>
                </div>
              </div>

              {/* Kargo Seçenekleri */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-brand-slate mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand-slate text-white flex items-center justify-center text-sm">3</span> 
                  Kargo Seçeneği
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === "standard" ? "border-brand-gold bg-brand-gold/5" : "border-slate-200 hover:border-brand-gold/50"}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value="standard" 
                        checked={shippingMethod === "standard"} 
                        onChange={() => setShippingMethod("standard")}
                        className="w-5 h-5 accent-brand-gold" 
                      />
                      <div>
                        <div className="font-bold text-brand-slate">Standart Teslimat</div>
                        <div className="text-sm text-slate-500">2-3 iş günü içinde kargoda</div>
                      </div>
                    </div>
                    <div className="font-black text-brand-slate">
                      {subtotal >= 3000 ? "Ücretsiz" : "249,00 TL"}
                    </div>
                  </label>
                  
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === "sameday-anadolu" ? "border-brand-gold bg-brand-gold/5" : "border-slate-200 hover:border-brand-gold/50"}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value="sameday-anadolu" 
                        checked={shippingMethod === "sameday-anadolu"} 
                        onChange={() => setShippingMethod("sameday-anadolu")}
                        className="w-5 h-5 accent-brand-gold" 
                      />
                      <div>
                        <div className="font-bold text-brand-slate flex items-center gap-2">
                          Aynı Gün Kurye (Anadolu Yakası)
                          <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">HIZLI</span>
                        </div>
                        <div className="text-sm text-slate-500">Saat 18:00'a kadar teslim edilir</div>
                      </div>
                    </div>
                    <div className="font-black text-brand-slate">
                      199,00 TL
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === "sameday-avrupa" ? "border-brand-gold bg-brand-gold/5" : "border-slate-200 hover:border-brand-gold/50"}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value="sameday-avrupa" 
                        checked={shippingMethod === "sameday-avrupa"} 
                        onChange={() => setShippingMethod("sameday-avrupa")}
                        className="w-5 h-5 accent-brand-gold" 
                      />
                      <div>
                        <div className="font-bold text-brand-slate flex items-center gap-2">
                          Aynı Gün Kurye (Avrupa Yakası)
                          <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">HIZLI</span>
                        </div>
                        <div className="text-sm text-slate-500">Saat 18:00'a kadar teslim edilir</div>
                      </div>
                    </div>
                    <div className="font-black text-brand-slate">
                      299,00 TL
                    </div>
                  </label>
                </div>
              </div>

              {/* Ödeme Bilgileri (iyzico mockup) */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0"></div>
                <h2 className="text-xl font-black text-brand-slate mb-6 flex items-center gap-2 relative z-10">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">4</span> 
                  Ödeme Bilgileri
                </h2>
                <div className="mb-6 flex items-center gap-2 relative z-10">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Altyapı:</div>
                  <div className="font-black text-blue-600 text-lg tracking-tight">iyzi<span className="text-slate-800">co</span></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600">Kart Üzerindeki İsim</label>
                    <input required type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-brand-slate" />
                  </div>
                  <div className="space-y-2 md:col-span-2 relative">
                    <label className="text-sm font-bold text-slate-600">Kart Numarası</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-500 text-brand-slate tracking-widest font-mono" />
                    <CreditCard className="absolute left-4 top-10 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">Son Kullanma Tarihi</label>
                    <input required type="text" placeholder="AA / YY" maxLength={5} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-brand-slate font-mono text-center" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">CVV</label>
                    <input required type="password" placeholder="***" maxLength={3} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-brand-slate font-mono text-center" />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
              <h2 className="text-xl font-black text-brand-slate mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 hide-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 relative">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">GÖRSEL</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-brand-slate truncate">{item.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">Adet: {item.quantity}</p>
                    </div>
                    <div className="font-black text-sm text-brand-slate">
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
                      className="flex-1 border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-gold text-brand-slate uppercase" 
                    />
                    <button 
                      type="button" 
                      onClick={applyDiscount}
                      className="bg-brand-slate text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-gold hover:text-brand-slate transition-colors"
                    >
                      Uygula
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg mb-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-bold text-sm">{discountApplied.code}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setDiscountApplied(null); setDiscountCode(""); }}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      İptal
                    </button>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium text-sm mt-4">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                
                {discountApplied && (
                  <div className="flex justify-between text-green-600 font-bold text-sm">
                    <span>İndirim ({discountApplied.code})</span>
                    <span>-{discountApplied.amount.toLocaleString('tr-TR')} TL</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium text-sm">
                  <span>Kargo Ücreti</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-bold">Ücretsiz</span>
                  ) : (
                    <span>{shippingCost.toLocaleString('tr-TR')} TL</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-black text-brand-slate">Genel Toplam</span>
                <span className="text-2xl font-black text-brand-gold">{totalAmount.toLocaleString('tr-TR')} TL</span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
              >
                {isProcessing ? "İşleniyor..." : "iyzico ile Güvenli Öde"}
              </button>
              
              <p className="text-xs text-center text-slate-400 mt-4 font-medium px-4">
                Ödeme tuşuna basarak, Mesafeli Satış Sözleşmesi'ni ve Ön Bilgilendirme Formu'nu kabul etmiş olursunuz.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
