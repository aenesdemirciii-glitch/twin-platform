"use client"

import { useState } from "react"
import { createCategory, updateCategory } from "./actions"
import { useRouter } from "next/navigation"
import { Save, Image as ImageIcon, X, Loader2, UploadCloud } from "lucide-react"

export function ClientCategoryForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "")
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      
      if (data.localUrl) {
        setImageUrl(data.localUrl)
      } else {
        setError(data.error || "Yükleme başarısız")
      }
    } catch (err: any) {
      setError("Hata: " + err.message)
    }
    
    setIsUploading(false)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      parentId: formData.get("parentId") || null,
      isActive: formData.get("isActive") === "on",
      seoTitle: formData.get("seoTitle"),
      seoDesc: formData.get("seoDesc"),
      imageUrl
    }

    try {
      if (initialData?.id) {
        await updateCategory(initialData.id, data)
      } else {
        await createCategory(data)
      }
      router.push("/admin-hoppo-twin/kategoriler")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Kategori Bilgileri</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Adı</label>
              <input required type="text" name="name" defaultValue={initialData?.name || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama (Opsiyonel)</label>
              <textarea name="description" rows={3} defaultValue={initialData?.description || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Üst Kategori</label>
              <select name="parentId" defaultValue={initialData?.parentId || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none bg-white">
                <option value="">Ana Kategori (Yok)</option>
                {categories.filter(c => c.id !== initialData?.id).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">SEO Ayarları</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meta Başlık</label>
              <input type="text" name="seoTitle" defaultValue={initialData?.seoTitle || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meta Açıklama</label>
              <textarea name="seoDesc" rows={2} defaultValue={initialData?.seoDesc || ""} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-amber-400 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Kapak Görseli</h3>
            
            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 relative overflow-hidden bg-slate-50 flex items-center justify-center group hover:border-amber-400 transition-colors">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="p-2 bg-white text-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 text-sm font-medium">
                      Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button type="button" onClick={() => setImageUrl("")} className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-slate-400 hover:text-amber-500">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-sm font-medium">Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Dosya Seç (Yükle)</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleFileUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Yayın Durumu</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.active : true} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
              <span className="text-sm font-medium text-slate-700">Kategoriyi Aktif Et</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button type="submit" disabled={isPending || isUploading} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:bg-slate-300 transition-colors shadow-sm">
          <Save className="h-5 w-5" />
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  )
}
