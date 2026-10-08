import { ClientBlogForm } from "../ClientBlogForm"

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Yeni Blog Yazısı</h2>
        <p className="text-sm text-slate-500 mt-1">Yeni bir içerik veya duyuru ekleyin.</p>
      </div>

      <ClientBlogForm />
    </div>
  )
}
