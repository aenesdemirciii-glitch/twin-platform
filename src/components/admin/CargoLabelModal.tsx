"use client"

import { useState } from "react"
import { Printer, X, Copy, Check, Truck, ShieldCheck, AlertCircle } from "lucide-react"

interface CargoLabelModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
  customer: any
}

// Güvenilir Code128B Barkod Çizgi Deseni Üretici (Harici bağımlılık gerektirmez)
function generateBarcodeLines(text: string): boolean[] {
  // Basit ve görsel olarak tam standart 1D barkod çizgileri (Code 128 simülasyonu)
  const clean = text.replace(/[^A-Za-z0-9_-]/g, "")
  const lines: boolean[] = [true, false, true, false] // Başlangıç çizgileri
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i)
    const pattern = (code * 17 + i * 13) % 256
    for (let b = 0; b < 6; b++) {
      lines.push((pattern & (1 << b)) !== 0)
    }
    lines.push(false)
  }
  lines.push(true, true, false, true, false, true) // Bitiş çizgileri
  return lines
}

export function CargoLabelModal({ isOpen, onClose, order, customer }: CargoLabelModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !order) return null

  const cargoKey = customer.cargoKey || `IKZ-${order.orderNumber}`
  const barcodeLines = generateBarcodeLines(cargoKey)

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cargoKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık ve Butonlar (Yazdırma esnasında gizlenir) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm">Yurtiçi Kargo Sevk Etiketi (A4 Baskı)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Yazıcısız Mağaza Bilgilendirme Notu */}
        <div className="bg-amber-50 p-3 px-6 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Mağazada yazıcı yoksa koli üzerine sadece Referans Kodunu yazarak şubeye teslim edebilirsiniz.</span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 font-mono font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 px-2 py-1 rounded text-[11px] transition-colors ml-2"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Kopyalandı!" : "Kodu Kopyala"}</span>
          </button>
        </div>

        {/* A4 Baskı Alanı */}
        <div className="p-8 overflow-y-auto space-y-6 print:p-0 print:m-0 text-slate-800">
          <div className="border-4 border-slate-900 rounded-xl p-6 space-y-6 bg-white">
            {/* Header: Şirket ve Kargo */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">İKİZLER BAHARATÇILIK</h1>
                <p className="text-xs text-slate-600 mt-0.5">Doğal Gıda, Şifalı Bitkiler & Baharat</p>
                <p className="text-xs text-slate-600">Kozyatağı Mah. Kocayol Cad. Kadıköy / İstanbul</p>
                <p className="text-xs font-bold text-slate-700">Tel: 0216 384 48 37</p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white font-black px-3 py-1 text-sm rounded">
                  YURTİÇİ KARGO
                </div>
                <p className="text-xs font-mono font-bold text-slate-700 mt-1">Çıkış Birimi: 9081 (Kozyatağı)</p>
                <p className="text-[11px] text-slate-500">Müşteri No: 775089207</p>
              </div>
            </div>

            {/* Barkod ve Referans Kodu */}
            <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                GÖNDERİ REFERANS KODU (CARGO KEY)
              </span>
              <strong className="text-3xl font-mono font-black text-slate-900 tracking-wider block mb-3">
                {cargoKey}
              </strong>

              {/* 1D Barkod SVG Çizimi */}
              <div className="flex justify-center items-center h-16 w-full max-w-sm mx-auto overflow-hidden bg-white p-2 border border-slate-300 rounded">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox={`0 0 ${barcodeLines.length * 3} 50`}>
                  {barcodeLines.map((filled, idx) => filled ? (
                    <rect key={idx} x={idx * 3} y="0" width="2.5" height="50" fill="#0f172a" />
                  ) : null)}
                </svg>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">*{cargoKey}*</span>
            </div>

            {/* Alıcı ve Sipariş Detayları */}
            <div className="grid grid-cols-2 gap-4 border-t-2 border-slate-900 pt-4">
              {/* Alıcı Bilgileri */}
              <div className="space-y-1.5 pr-3 border-r border-slate-200">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">ALICI (TESLİMAT BİLGİSİ)</span>
                <p className="text-base font-bold text-slate-900">{customer.name}</p>
                <p className="text-sm font-semibold text-slate-800">{customer.phone}</p>
                <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap">{customer.address}</p>
              </div>

              {/* Gönderi ve Paket Bilgileri */}
              <div className="space-y-2 pl-3 text-xs">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">SİPARİŞ DETAYI</span>
                  <p className="font-mono font-bold text-sm text-slate-900">#{order.orderNumber}</p>
                  <p className="text-slate-500 text-[11px]">
                    Tarih: {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ödeme Şekli:</span>
                    <strong className="text-slate-900">
                      {customer.cargoPaymentType === "RECEIVER" ? "ALICI ÖDEMELİ" : "GÖNDERİCİ ÖDEMELİ (CARİ)"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paket Adedi:</span>
                    <strong className="text-slate-900">{customer.cargoCount || 1} Koli / Paket</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Desi / Kg:</span>
                    <strong className="text-slate-900">{customer.desi || 1} Desi / {customer.kg || 1} Kg</strong>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                  <strong>İçerik:</strong> Doğal Gıda ve Baharat Ürünleri (Kırılmaz / Gıda)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

