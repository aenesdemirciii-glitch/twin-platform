"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Image as ImageIcon, Upload } from "lucide-react"
import { saveBlogPost } from "./actions"

export function ClientBlogForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", e.target.files[0])
    
    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok && data.url) setImageUrl(data.url)
    } catch (err) {
      alert("Görsel yüklenemedi")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      id: initialData?.id,
      title: formData.get("title"),
      slug: formData.get("slug"),
      category: formData.get("category"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      isActive: formData.get("isActive") === "on",
      imageUrl
    }

    try {
      await saveBlogPost(data)
      router.push("/admin-hoppo-twin/icerik/blog")
    } catch (err: any) {
      alert("Hata: " + err.message)
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Başlık</label>
            <input required type="text" name="title" defaultValue={initialData?.title} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">URL (Slug)</label>
            <input required type="text" name="slug" defaultValue={initialData?.slug} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kategori</label>
            <input type="text" name="category" defaultValue={initialData?.category} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="w-4 h-4" />
              <span className="font-semibold text-sm">Yayında (Aktif)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Kısa Özet</label>
          <textarea name="excerpt" defaultValue={initialData?.excerpt} rows={2} className="w-full px-4 py-2 border rounded-lg"></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">İçerik (Markdown veya Düz Metin)</label>
          <textarea required name="content" defaultValue={initialData?.content} rows={10} className="w-full px-4 py-2 border rounded-lg font-mono text-sm"></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Kapak Görseli</label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {imageUrl && (
              <div className="w-48 h-32 rounded-lg border overflow-hidden shrink-0">
                <img src={imageUrl} alt="Kapak" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 w-full space-y-3">
              <div>
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Veya görsel URL'si yapıştırın (/uploads/...)" 
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Yükleniyor..." : "Görsel Yükle"}
                </button>
                {imageUrl && <button type="button" onClick={() => setImageUrl("")} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Temizle</button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 sticky bottom-6 z-10">
        <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-white border font-bold rounded-xl shadow-sm">İptal</button>
        <button type="submit" disabled={isPending} className="flex items-center gap-2 px-8 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-sm">
          <Save className="h-4 w-4" />
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  )
}
