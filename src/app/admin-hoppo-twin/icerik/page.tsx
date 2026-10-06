import { LayoutTemplate, Plus, FileText, Image as ImageIcon } from "lucide-react"

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">İçerik Yönetimi</h2>
          <p className="text-sm text-slate-500 mt-1">Blog yazıları, kurumsal sayfalar ve slider görselleri.</p>
        </div>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
          <Plus className="h-4 w-4" />
          İçerik Ekle (Geliştirme Aşamasında)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center h-48 opacity-75">
          <ImageIcon className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="font-semibold text-slate-700">Ana Sayfa Banner</h3>
          <p className="text-xs text-slate-500 mt-2">Banner yönetimi henüz veritabanına bağlı değildir. Tema dosyalarından düzenlenmektedir.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center h-48 opacity-75">
          <FileText className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="font-semibold text-slate-700">Blog Yazıları</h3>
          <p className="text-xs text-slate-500 mt-2">Blog yazıları şu an 'blogData.ts' içerisinden çekilmektedir. Yakında panele eklenecektir.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center h-48 opacity-75">
          <LayoutTemplate className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="font-semibold text-slate-700">Kurumsal Sayfalar</h3>
          <p className="text-xs text-slate-500 mt-2">Hakkımızda, İletişim gibi sayfalar kod düzeyinde statik şablonlarla yönetilmektedir.</p>
        </div>
      </div>
    </div>
  )
}
