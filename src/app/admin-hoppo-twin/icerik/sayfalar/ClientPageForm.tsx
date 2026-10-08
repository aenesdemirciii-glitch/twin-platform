"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X } from "lucide-react"
import { savePage } from "./actions"

export function ClientPageForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      id: initialData?.id,
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      isActive: formData.get("isActive") === "on",
    }

    try {
      await savePage(data)
      router.push("/admin-hoppo-twin/icerik/sayfalar")
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
            <label className="block text-sm font-semibold mb-1">Sayfa Başlığı</label>
            <input required type="text" name="title" defaultValue={initialData?.title} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">URL (Slug) - örn: hakkimizda</label>
            <input required type="text" name="slug" defaultValue={initialData?.slug} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="w-4 h-4" />
            <span className="font-semibold text-sm">Yayında (Aktif)</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Sayfa İçeriği (Markdown veya Düz Metin)</label>
          <textarea required name="content" defaultValue={initialData?.content} rows={15} className="w-full px-4 py-2 border rounded-lg font-mono text-sm"></textarea>
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
