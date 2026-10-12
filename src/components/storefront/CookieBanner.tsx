"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, X, Check, ShieldCheck, Settings } from "lucide-react"

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // always required
    functional: true,
    analytics: true,
    marketing: true
  })

  useEffect(() => {
    try {
      const consent = localStorage.getItem("ikizler_cookie_consent")
      if (!consent) {
        setIsOpen(true)
      }
    } catch (e) {
      // ignore SSR or local storage error
    }
  }, [])

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("ikizler_cookie_consent", JSON.stringify({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
        date: new Date().toISOString()
      }))
    } catch (e) {}
    setIsOpen(false)
    setShowManageModal(false)
  }

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem("ikizler_cookie_consent", JSON.stringify({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
        date: new Date().toISOString()
      }))
    } catch (e) {}
    setIsOpen(false)
    setShowManageModal(false)
  }

  const handleSavePreferences = () => {
    try {
      localStorage.setItem("ikizler_cookie_consent", JSON.stringify({
        ...preferences,
        essential: true,
        date: new Date().toISOString()
      }))
    } catch (e) {}
    setIsOpen(false)
    setShowManageModal(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Cookie Banner Bar */}
      <aside 
        aria-label="Çerez Politikası ve İzin Tercihleri" 
        className="fixed bottom-0 inset-x-0 z-[999] p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-300"
      >
        <div className="container mx-auto px-4 max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span>Sitemizin çalışması ve güvenliği için zorunlu çerezler kullanıyoruz. Onay verirseniz analiz, işlev ve reklam amaçlı çerezleri de kullanabiliriz. Tercihinizi istediğiniz zaman değiştirebilirsiniz. Ayrıntılar için </span>
              <Link href="/sayfa/cerez-politikasi" className="text-brand-slate font-bold underline hover:text-brand-gold transition-colors">
                Çerez Politikamızı
              </Link>
              <span> inceleyin.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end shrink-0">
            <button
              onClick={() => setShowManageModal(true)}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <Settings className="h-4 w-4" />
              Tercihleri Yönet
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
            >
              Zorunlu Olmayanları Reddet
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 rounded-xl bg-brand-slate hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Tümünü Kabul Et
            </button>
          </div>
        </div>
      </aside>

      {/* Preferences Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-amber-500" />
                <h3 className="font-black text-brand-slate text-lg">Çerez Tercihlerini Yönet</h3>
              </div>
              <button 
                onClick={() => setShowManageModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
              <p className="text-slate-600">
                Aşağıdaki çerez kategorilerini ihtiyaçlarınıza göre etkinleştirebilir veya devre dışı bırakabilirsiniz.
              </p>

              {/* Essential */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Zorunlu Çerezler
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border">Her Zaman Açık</span>
                </div>
                <p className="text-xs text-slate-500">
                  Web sitesinin ve alışveriş sepetinin sorunsuz çalışması için gereklidir, kapatılamaz.
                </p>
              </div>

              {/* Functional */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-800">İşlevsel Çerezler</div>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="h-4 w-4 rounded accent-brand-gold cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Gelişmiş kullanıcı deneyimi ve tercihlerinizi hatırlamamıza olanak tanır.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-800">Analitik Çerezler</div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="h-4 w-4 rounded accent-brand-gold cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Ziyaretçi trafiğini ve sayfa kullanımını ölçerek siteyi optimize etmemize yardımcı olur.
                </p>
              </div>

              {/* Marketing */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-800">Pazarlama Çerezleri</div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="h-4 w-4 rounded accent-brand-gold cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  İlgi alanlarınıza uygun kişiselleştirilmiş içerik ve reklamlar sunmak için kullanılır.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
              <button
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2 rounded-xl bg-brand-slate hover:bg-black text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                Tercihleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
