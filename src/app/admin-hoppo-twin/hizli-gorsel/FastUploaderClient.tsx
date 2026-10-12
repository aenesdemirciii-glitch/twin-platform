"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { 
  Upload, 
  SkipForward, 
  SkipBack, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Trash2, 
  ExternalLink, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  X,
  Sparkles,
  Info
} from "lucide-react"
import Link from "next/link"
import { addImageToProduct, removeProductImage } from "./actions"

export interface ProductItem {
  id: string
  name: string
  sku: string
  price: number
  categoryId: string | null
  categoryName: string
  images: { id: string; url: string; isMain: boolean }[]
  hasImage: boolean
}

export interface CategoryItem {
  id: string
  name: string
}

interface Props {
  initialProducts: ProductItem[]
  categories: CategoryItem[]
}

export function FastUploaderClient({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts)
  const [statusFilter, setStatusFilter] = useState<"no_image" | "has_image" | "all">("no_image")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [viewMode, setViewMode] = useState<"wizard" | "list">("wizard")
  const [wizardIndex, setWizardIndex] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null)
  
  // URL Ekleme Modalı / Girişi
  const [urlModalProduct, setUrlModalProduct] = useState<ProductItem | null>(null)
  const [urlInput, setUrlInput] = useState<string>("")

  // Otomatik sonraki ürüne geçiş seçeneği (Sihirbazda)
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true)

  // Bildirim toast
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const wizardFileInputRef = useRef<HTMLInputElement>(null)

  function showNotification(type: "success" | "error", message: string) {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr))
    }, 3500)
  }

  // İstatistikler (Canlı hesaplama)
  const stats = useMemo(() => {
    const total = products.length
    const withImages = products.filter((p) => p.hasImage).length
    const withoutImages = total - withImages
    const percent = total > 0 ? Math.round((withImages / total) * 100) : 0
    return { total, withImages, withoutImages, percent }
  }, [products])

  // Filtrelenmiş liste
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Görsel durumu
      if (statusFilter === "no_image" && product.hasImage) return false
      if (statusFilter === "has_image" && !product.hasImage) return false

      // 2. Kategori
      if (selectedCategory !== "all" && product.categoryId !== selectedCategory) return false

      // 3. Arama
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = product.name.toLowerCase().includes(q)
        const matchSku = product.sku ? product.sku.toLowerCase().includes(q) : false
        if (!matchName && !matchSku) return false
      }

      return true
    })
  }, [products, statusFilter, selectedCategory, searchQuery])

  // Filtre veya arama değiştiğinde sihirbaz indeksini sıfırla
  useEffect(() => {
    setWizardIndex(0)
  }, [statusFilter, selectedCategory, searchQuery])

  // Geçerli sihirbaz indeksi
  const safeIndex = Math.min(Math.max(0, wizardIndex), Math.max(0, filteredProducts.length - 1))
  const currentProduct = filteredProducts[safeIndex]

  // Dosya Yükleme Fonksiyonu
  async function handleFileUpload(productId: string, file: File) {
    setIsUploading(true)
    setUploadingProductId(productId)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const text = await res.text()
      let data: any
      try {
        data = JSON.parse(text)
      } catch (parseErr) {
        showNotification("error", "Sunucu yanıtı çözümlenemedi.")
        setIsUploading(false)
        setUploadingProductId(null)
        return
      }

      if (res.ok && data.url) {
        const result = await addImageToProduct(productId, data.url)
        if (result.success) {
          // Yerel state'i güncelle
          setProducts((prev) =>
            prev.map((p) => {
              if (p.id === productId) {
                return {
                  ...p,
                  hasImage: true,
                  images: [{ id: result.image?.id || String(Date.now()), url: data.url, isMain: true }],
                }
              }
              return p
            })
          )

          showNotification("success", "Görsel başarıyla yüklendi ve ürüne bağlandı!")

          // Sihirbaz modunda otomatik ilerle
          if (viewMode === "wizard" && autoAdvance) {
            // Eğer görselsizler filtresindeysek ürün listeden çıkacağından mevcut indeks doğal olarak sonrakini gösterir.
            // Tümü veya görselliler filtresindeyse indeksi bir artır:
            if (statusFilter !== "no_image") {
              setWizardIndex((prev) => prev + 1)
            }
          }
        } else {
          showNotification("error", result.error || "Görsel kaydedilemedi.")
        }
      } else {
        showNotification("error", data.error || "Dosya yüklenemedi: HTTP " + res.status)
      }
    } catch (err: any) {
      console.error(err)
      showNotification("error", "Yükleme hatası: " + (err.message || String(err)))
    } finally {
      setIsUploading(false)
      setUploadingProductId(null)
      if (wizardFileInputRef.current) {
        wizardFileInputRef.current.value = ""
      }
    }
  }

  // URL ile Görsel Kaydetme Fonksiyonu
  async function handleUrlSubmit(productId: string, url: string) {
    if (!url.trim()) {
      showNotification("error", "Lütfen geçerli bir görsel bağlantısı girin.")
      return
    }

    setIsUploading(true)
    setUploadingProductId(productId)

    try {
      const result = await addImageToProduct(productId, url.trim())
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                hasImage: true,
                images: [{ id: result.image?.id || String(Date.now()), url: url.trim(), isMain: true }],
              }
            }
            return p
          })
        )

        showNotification("success", "Görsel URL başarıyla kaydedildi!")
        setUrlModalProduct(null)
        setUrlInput("")

        if (viewMode === "wizard" && autoAdvance && statusFilter !== "no_image") {
          setWizardIndex((prev) => prev + 1)
        }
      } else {
        showNotification("error", result.error || "URL kaydedilemedi.")
      }
    } catch (err: any) {
      console.error(err)
      showNotification("error", "Hata: " + (err.message || String(err)))
    } finally {
      setIsUploading(false)
      setUploadingProductId(null)
    }
  }

  // Görsel Silme Fonksiyonu
  async function handleRemoveImage(productId: string) {
    if (!confirm("Bu ürünün görselini silmek istediğinize emin misiniz?")) return

    setIsUploading(true)
    setUploadingProductId(productId)

    try {
      const result = await removeProductImage(productId)
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                hasImage: false,
                images: [],
              }
            }
            return p
          })
        )
        showNotification("success", "Görsel kaldırıldı.")
      } else {
        showNotification("error", result.error || "Silinemedi.")
      }
    } catch (err: any) {
      console.error(err)
      showNotification("error", "Hata: " + (err.message || String(err)))
    } finally {
      setIsUploading(false)
      setUploadingProductId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Bildirim */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold transition-all transform animate-in fade-in slide-in-from-bottom-4 ${
            notification.type === "success"
              ? "bg-emerald-800 text-white border border-emerald-700"
              : "bg-rose-800 text-white border border-rose-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white/70 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. ÖZET İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Ürün</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">Katalogdaki tüm ürünler</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Görseli Eksik</p>
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-200 text-amber-900 rounded-full">
              Acil
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats.withoutImages}</p>
          <p className="text-xs text-amber-700 mt-1">Fotoğraf bekleyen ürün</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Görseli Olan</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.withImages}</p>
          <p className="text-xs text-emerald-700 mt-1">Fotoğrafı hazır ürün</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tamamlanma</p>
            <span className="text-xs font-bold text-slate-700">%{stats.percent}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {stats.withoutImages === 0 ? "Tüm görseller eksiksiz!" : `${stats.withoutImages} ürün kaldı`}
          </p>
        </div>
      </div>

      {/* 2. FİLTRELEME & GÖRÜNÜM KONTROL ÇUBUĞU */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Görsel Durumu Filtre Sekmeleri */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setStatusFilter("no_image")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "no_image"
                  ? "bg-amber-500 text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Görselsizler ({stats.withoutImages})</span>
            </button>
            <button
              onClick={() => setStatusFilter("has_image")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "has_image"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Görselliler ({stats.withImages})</span>
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Tümü ({stats.total})</span>
            </button>
          </div>

          {/* Sağ Alan: Kategori, Arama ve Görünüm Seçici */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Kategori Seçici */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-amber-500"
            >
              <option value="all">Tüm Kategoriler ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Arama Kutusu */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ürün adı veya SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 text-slate-800 rounded-lg pl-8 pr-3 py-2 outline-none focus:border-amber-500 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Görünüm Modu Düğmeleri */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setViewMode("wizard")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                  viewMode === "wizard"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Sırayla tek tek yükleme sihirbazı"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sihirbaz</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Toplu liste görünümü"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Liste</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ANA İÇERİK: SİHİRBAZ VEYA LİSTE */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {statusFilter === "no_image"
              ? "Tebrikler! Görselsiz Ürün Kalmadı."
              : "Kriterlere Uygun Ürün Bulunamadı."}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {statusFilter === "no_image"
              ? "Seçilen kategori veya arama kriterinde görseli olmayan hiçbir ürün bulunmuyor."
              : "Arama veya filtre kriterlerinizi değiştirerek diğer ürünleri inceleyebilirsiniz."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Tüm Ürünleri Göster ({stats.total})
              </button>
            )}
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Tüm Kategorilere Dön
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "wizard" ? (
        /* ========================================================================= */
        /* SİHİRBAZ GÖRÜNÜMÜ (Tek Tek Odaklı Yükleme) */
        /* ========================================================================= */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Üst Başlık & Ürün Bilgileri */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
                  Sıra: {safeIndex + 1} / {filteredProducts.length}
                </span>
                <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold">
                  {currentProduct.categoryName}
                </span>
                {currentProduct.hasImage ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Görsel Mevcut
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Görsel Eksik
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentProduct.name}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
                <span>SKU: <strong className="text-slate-700">{currentProduct.sku}</strong></span>
                <span>•</span>
                <span>Fiyat: <strong className="text-slate-700">₺{currentProduct.price.toLocaleString("tr-TR")}</strong></span>
                <span>•</span>
                <Link
                  href={`/admin-hoppo-twin/urunler/${currentProduct.id}`}
                  target="_blank"
                  className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 hover:underline"
                >
                  Ürün Detayı <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Sihirbaz Kontrolleri (Önceki - Sonraki) */}
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => setWizardIndex((prev) => Math.max(0, prev - 1))}
                disabled={safeIndex === 0 || isUploading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:pointer-events-none text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Önceki
              </button>
              <button
                onClick={() => setWizardIndex((prev) => Math.min(filteredProducts.length - 1, prev + 1))}
                disabled={safeIndex >= filteredProducts.length - 1 || isUploading}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none text-slate-900 rounded-lg text-xs font-bold transition-colors"
              >
                Sonraki <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Orta Alan: Yükleme ve Önizleme */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Mevcut Görsel Varsa Önizleme */}
            {currentProduct.hasImage && currentProduct.images.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                    <img
                      src={currentProduct.images[0].url}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Mevcut Kayıtlı Görsel</p>
                    <p className="text-xs text-slate-500 break-all max-w-md line-clamp-1">
                      {currentProduct.images[0].url}
                    </p>
                    <span className="inline-block mt-1 text-[11px] text-emerald-600 font-semibold">
                      Yeni bir görsel yüklediğinizde bu görsel güncellenecektir.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveImage(currentProduct.id)}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Görseli Kaldır
                </button>
              </div>
            )}

            {/* Büyük Sürükle-Bırak Yükleme Alanı */}
            <div>
              <label
                className={`w-full min-h-[220px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer ${
                  isUploading
                    ? "border-emerald-400 bg-emerald-50/50 text-emerald-700 pointer-events-none"
                    : "border-slate-300 bg-slate-50 hover:border-amber-500 hover:bg-amber-50/40 text-slate-600"
                }`}
              >
                <input
                  ref={wizardFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(currentProduct.id, e.target.files[0])
                    }
                  }}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
                    <p className="text-base font-bold text-emerald-800">Görsel Yükleniyor ve Kaydediliyor...</p>
                    <p className="text-xs text-emerald-600 mt-1">Lütfen bekleyin, işlem tamamlanınca sıradaki ürüne geçilecek.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7" />
                    </div>
                    <p className="text-base font-bold text-slate-800">
                      Fotoğraf Dosyası Seçin veya Buraya Sürükleyin
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5 max-w-sm">
                      JPG, PNG, WEBP formatları desteklenir. Görsel yüklendiği anda veritabanına kaydedilir.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800">
                      Bilgisayardan Dosya Seç
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Alternatif: Web URL'si ile Kaydetme */}
            <div className="pt-2 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Veya Doğrudan Görsel URL'si Yapıştırın</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/resim.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isUploading}
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-slate-800"
                  />
                  <button
                    onClick={() => handleUrlSubmit(currentProduct.id, urlInput)}
                    disabled={isUploading || !urlInput.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    URL'yi Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sihirbaz Alt Çubuğu & İlerleme */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-600 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <span>Yükleme tamamlandığında otomatik sonraki ürüne geç</span>
            </label>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-36 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((safeIndex + 1) / filteredProducts.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
                {safeIndex + 1} / {filteredProducts.length} (%{Math.round(((safeIndex + 1) / filteredProducts.length) * 100)})
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* LİSTE GÖRÜNÜMÜ (Toplu Liste / Tablo Halinde Hızlı Yükleme) */
        /* ========================================================================= */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Listelenen: {filteredProducts.length} Ürün
            </span>
            <span className="text-xs text-slate-500">
              Her ürünün yanındaki "Yükle" butonuna tıklayarak doğrudan fotoğraf atayabilirsiniz.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Ürün</th>
                  <th className="px-5 py-3.5">Kategori</th>
                  <th className="px-5 py-3.5">Fiyat</th>
                  <th className="px-5 py-3.5">Görsel Durumu</th>
                  <th className="px-5 py-3.5 text-right">Hızlı Yükle & İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const isCurrentItemUploading = uploadingProductId === product.id && isUploading

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Ürün & Küçük Görsel */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400">
                            {product.hasImage && product.images.length > 0 ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{product.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="px-5 py-3 text-xs text-slate-600 font-medium">
                        {product.categoryName}
                      </td>

                      {/* Fiyat */}
                      <td className="px-5 py-3 text-xs font-bold text-slate-800">
                        ₺{product.price.toLocaleString("tr-TR")}
                      </td>

                      {/* Durum */}
                      <td className="px-5 py-3">
                        {product.hasImage ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3" /> Görsel Var
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertCircle className="w-3 h-3" /> Görsel Yok
                          </span>
                        )}
                      </td>

                      {/* Hızlı İşlem Butonları */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Dosya Yükle Butonu */}
                          <label
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isCurrentItemUploading
                                ? "bg-emerald-100 text-emerald-700 pointer-events-none"
                                : "bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm"
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUpload(product.id, e.target.files[0])
                                  e.target.value = ""
                                }
                              }}
                            />
                            {isCurrentItemUploading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Yükleniyor...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>{product.hasImage ? "Değiştir" : "Görsel Yükle"}</span>
                              </>
                            )}
                          </label>

                          {/* URL ile Ekle */}
                          <button
                            onClick={() => {
                              setUrlModalProduct(product)
                              setUrlInput(product.hasImage ? product.images[0]?.url || "" : "")
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="URL ile Görsel Ekle / Değiştir"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>

                          {/* Görseli Sil (Varsa) */}
                          {product.hasImage && (
                            <button
                              onClick={() => handleRemoveImage(product.id)}
                              disabled={isUploading}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Görseli Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Ürün Düzenleme Sayfasına Git */}
                          <Link
                            href={`/admin-hoppo-twin/urunler/${product.id}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ürünü İncele"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* URL EKLEME MODAL */}
      {urlModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Görsel URL Ekle</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{urlModalProduct.name}</p>
              </div>
              <button
                onClick={() => setUrlModalProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Doğrudan Resim Linki</label>
              <input
                type="url"
                placeholder="https://example.com/resim.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                autoFocus
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-amber-500 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUrlModalProduct(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={() => handleUrlSubmit(urlModalProduct.id, urlInput)}
                disabled={isUploading || !urlInput.trim()}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-900 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Görseli Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
