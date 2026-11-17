"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Search, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  X,
  Filter
} from "lucide-react"
import { saveProductDescriptions } from "./actions"

type ProductDescItem = {
  id: string
  name: string
  slug: string
  sku: string
  categoryName: string
  imageUrl: string | null
  shortDescription: string | null
  longDescription: string | null
}

export function FastDescriptionClient({ initialProducts }: { initialProducts: ProductDescItem[] }) {
  const [products, setProducts] = useState<ProductDescItem[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "missing" | "completed">("all")
  
  // Track expanded product ID for inline editing
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Editing state
  const [editShort, setEditShort] = useState("")
  const [editLong, setEditLong] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleOpenEditor = (p: ProductDescItem) => {
    if (expandedId === p.id) {
      setExpandedId(null)
    } else {
      setExpandedId(p.id)
      setEditShort(p.shortDescription || "")
      setEditLong(p.longDescription || "")
      setMessage(null)
    }
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    setMessage(null)

    try {
      const res = await saveProductDescriptions({
        id,
        shortDescription: editShort,
        longDescription: editLong,
      })

      if (res.success) {
        setProducts(prev => prev.map(p => {
          if (p.id === id) {
            return {
              ...p,
              shortDescription: editShort.trim() || null,
              longDescription: editLong.trim() || null,
            }
          }
          return p
        }))

        setSavedId(id)
        setMessage({ type: "success", text: "Ürün açıklaması başarıyla kaydedildi!" })
        setTimeout(() => {
          setSavedId(null)
          setMessage(null)
        }, 3000)
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Kaydetme başarısız oldu." })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search check
      const s = search.toLowerCase()
      const matchesSearch = !s || 
        p.name.toLowerCase().includes(s) || 
        p.sku.toLowerCase().includes(s) || 
        p.categoryName.toLowerCase().includes(s)

      if (!matchesSearch) return false

      // Filter check
      const hasShort = !!p.shortDescription && p.shortDescription.trim().length > 0
      const hasLong = !!p.longDescription && p.longDescription.trim().length > 0
      
      if (filter === "missing") {
        return !hasShort || !hasLong
      }
      if (filter === "completed") {
        return hasShort && hasLong
      }
      return true
    })
  }, [products, search, filter])

  const stats = useMemo(() => {
    let completed = 0
    let missing = 0
    for (const p of products) {
      if (p.shortDescription && p.longDescription) completed++
      else missing++
    }
    return { total: products.length, completed, missing }
  }, [products])

  return (
    <div className="space-y-6">
      {/* İstatistik & Bilgi Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Ürün</span>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Açıklaması Tam</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.completed}</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Açıklama Bekleyen</span>
            <p className="text-2xl font-black text-amber-700 mt-1">{stats.missing}</p>
          </div>
          <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 font-bold">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Arama & Filtre Çubuğu */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ürün adı, kategori veya SKU ile ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tümü ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "completed" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tam ({stats.completed})
          </button>
          <button
            type="button"
            onClick={() => setFilter("missing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "missing" ? "bg-amber-500 text-slate-950 shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Eksik ({stats.missing})
          </button>
        </div>
      </div>

      {/* Mesaj Bildirimi */}
      {message && (
        <div className={`p-4 rounded-xl border text-sm flex items-center gap-2 shadow-sm ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Ürün Listesi */}
      <div className="space-y-3">
        {filteredProducts.map((p) => {
          const isExpanded = expandedId === p.id
          const hasShort = !!p.shortDescription && p.shortDescription.trim().length > 0
          const hasLong = !!p.longDescription && p.longDescription.trim().length > 0
          const isJustSaved = savedId === p.id

          return (
            <div 
              key={p.id}
              className={`bg-white rounded-xl border transition-all shadow-sm overflow-hidden ${
                isExpanded 
                  ? "border-amber-400 ring-2 ring-amber-100" 
                  : isJustSaved 
                    ? "border-emerald-400 bg-emerald-50/20" 
                    : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Başlık Satırı */}
              <div 
                onClick={() => handleOpenEditor(p)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">Görsel</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">{p.name}</h3>
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">({p.sku})</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{p.categoryName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Durum Rozetleri */}
                  <div className="hidden md:flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      hasShort 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      Kısa Açıklama: {hasShort ? "Var" : "Yok"}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      hasLong 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      Detaylı Açıklama: {hasLong ? "Var" : "Yok"}
                    </span>
                  </div>

                  <Link 
                    href={`/urun/${p.slug}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Mağazada Gör"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <button 
                    type="button"
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                      isExpanded 
                        ? "bg-amber-500 text-slate-950" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{isExpanded ? "Kapat" : "Açıklamayı Düzenle"}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Genişletilmiş Düzenleyici Bölümü */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-5 animate-in fade-in duration-200">
                  {/* Kısa Açıklama */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Kısa Açıklama (Ürün Özeti / Başlık Altı)
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Karakter: {editShort.length}
                      </span>
                    </div>
                    <textarea 
                      rows={3}
                      value={editShort}
                      onChange={(e) => setEditShort(e.target.value)}
                      placeholder="Ürün sayfasında başlığın ve fiyatın altında görünen 1-2 cümlelik vurucu tanıtım metni..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-amber-400 outline-none leading-relaxed shadow-sm"
                    />
                  </div>

                  {/* Detaylı Açıklama */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Detaylı Ürün Açıklaması & Paket Detayları (Markdown Destekli)
                      </label>
                      <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Başlıklar (##) ve Maddeler (-) desteklenir
                      </span>
                    </div>
                    <textarea 
                      rows={8}
                      value={editLong}
                      onChange={(e) => setEditLong(e.target.value)}
                      placeholder={"## Ürün Açıklaması\nİkizler Baharatçılık güvencesiyle taze ve doğal...\n\n### Faydaları\n- Doğal ve katkısız\n- Zengin vitamin ve mineral kaynağı\n- Özenle seçilmiş birinci sınıf kalite\n\n### Saklama Koşulları\nSerin ve kuru yerde, ağzı kapalı muhafaza ediniz."}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:ring-2 focus:ring-amber-400 outline-none leading-relaxed shadow-sm"
                    />
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                      <span>Hızlı Format:</span>
                      <button 
                        type="button" 
                        onClick={() => setEditLong(prev => prev + "\n\n## Başlık")}
                        className="bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10px]"
                      >
                        + ## Başlık
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditLong(prev => prev + "\n\n### Alt Başlık")}
                        className="bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10px]"
                      >
                        + ### Alt Başlık
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditLong(prev => prev + "\n- Madde 1\n- Madde 2")}
                        className="bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10px]"
                      >
                        + Madde Listesi
                      </button>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <Link
                      href={`/admin-hoppo-twin/urunler/${p.id}`}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Tüm Ürün Detaylarını Düzenle &rarr;
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(p.id)}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{isSaving ? "Kaydediliyor..." : "Açıklamayı Kaydet"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-600">Aramanıza uygun ürün bulunamadı.</p>
            <p className="text-xs text-slate-400 mt-1">Arama kelimesini veya filtreyi değiştirip tekrar deneyin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
