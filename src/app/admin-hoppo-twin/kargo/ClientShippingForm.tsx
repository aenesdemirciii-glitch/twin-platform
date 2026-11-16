"use client"

import { useState } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import { saveSettings } from "../ayarlar/actions" // We can reuse this!

export function ClientShippingForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")

  async function action(formData: FormData) {
    setIsPending(true)
    setMessage("")
    try {
      await saveSettings(formData)
      setMessage("Kargo ayarları başarıyla güncellendi.")
    } catch (e: any) {
      setMessage("Hata: " + e.message)
    }
    setIsPending(false)
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ücretsiz Kargo Eşiği (TL)</label>
          <input 
            type="number" 
            name="free_shipping_threshold"
            defaultValue={initialSettings['free_shipping_threshold'] || '3000'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">Bu tutarın üzerindeki sepetlerde kargo bedava olur.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Standart Kargo Ücreti (TL)</label>
          <input 
            type="number" 
            name="shipping_cost"
            defaultValue={initialSettings['shipping_cost'] || '249'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">Eşik altı siparişlerde uygulanan sabit ücret.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Aynı Gün (Anadolu) Ücreti (TL)</label>
          <input 
            type="number" 
            name="same_day_anadolu"
            defaultValue={initialSettings['same_day_anadolu'] || '199'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Aynı Gün (Avrupa) Ücreti (TL)</label>
          <input 
            type="number" 
            name="same_day_avrupa"
            defaultValue={initialSettings['same_day_avrupa'] || '299'}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Yurtiçi Kargo API Ayarları */}
      <div className="pt-6 border-t border-slate-200">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Yurtiçi Kargo API Entegrasyon Ayarları</span>
            <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              KOPS Standart SOAP Servisi
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Müşteri Kodu, Çıkış Birimi ve SOAP API bağlantı bilgileri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Müşteri Kodu (custProdId)
            </label>
            <input 
              type="text" 
              name="yurtici_customer_code"
              defaultValue={initialSettings['yurtici_customer_code'] || '775089207'}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">İkizler Baharatçılık Yurtiçi Kargo müşteri kodu.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Çıkış Birimi (orgGeoCode)
            </label>
            <input 
              type="text" 
              name="yurtici_org_geo_code"
              defaultValue={initialSettings['yurtici_org_geo_code'] || '9081'}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">9081 - Kozyatağı Şubesi</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              SOAP Kullanıcı Adı (wsUserName)
            </label>
            <input 
              type="text" 
              name="yurtici_username"
              defaultValue={initialSettings['yurtici_username'] || ''}
              placeholder="Yurtiçi Kargo web servis kullanıcı adı"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Ortam değişkeni (YURTICI_USERNAME) de kullanılabilir.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              SOAP Şifresi (wsPassword)
            </label>
            <input 
              type="password" 
              name="yurtici_password"
              defaultValue={initialSettings['yurtici_password'] || ''}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Ortam değişkeni (YURTICI_PASSWORD) de kullanılabilir.</p>
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
            <div>
              <span className="block text-xs font-bold text-slate-800">Test / Simülasyon Modu</span>
              <span className="text-[11px] text-slate-500">
                Açık olduğunda veya API bilgisi girilmediğinde güvenli test modunda çalışır, gerçek gönderi oluşturmaz.
              </span>
            </div>
            <select
              name="yurtici_test_mode"
              defaultValue={initialSettings['yurtici_test_mode'] || 'true'}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="true">Test Modu (Açık)</option>
              <option value="false">Canlı Mod (Aktif)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex-1">
          {message && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg transition-colors ${
            isPending 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <Save className="h-4 w-4" />
          {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  )
}
